<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Http\Resources\PaginationResource;
use App\Notifications\NewResponse;
use App\Services\UserService;
use App\Validations\AssignmentDepartmentValidation as AssignmentRequest;
use App\Validations\ProfileValidation as ProfileRequest;
use App\Validations\UserValidation as UserRequest;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService) {
        
        $this->userService = $userService;

        $this->middleware(['auth:api']);
        $this->middleware('role:admin')->except(['openedTickets', 'profileUpdate', 'notifications', 'markAsRead','responses']);
    }

    public function index() {
        
        try {
            $results = $this->userService->getAllUsers(); 
            return response()->json(
                $results
            , 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function agents(Request $request) {
        
        try {
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 10);
            $query = $request->query('query',"");

            $results = $this->userService->getAllAgents($page, $perPage, $query); 
            return response()->json(
                $results
            , 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /*
        For creating new Agents.
    */

    public function store(UserRequest $request) {

        try {
            $data = $request->validated();

            $results = $this->userService->createUser($data);

            $results->assignRole(Role::where('name','agent')->first());

            return response()->json([
                'status' => 'success',
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function destroy($id) {
     
        try {
            $results = $this->userService->deleteUser($id);
            return response()->json(null, 204);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(UserRequest $request, $id) {

        try {
            $request->validated();

            $data =  [
                'name' => $request->getName(),
                'department_id' => $request->getDepartmentId()
            ];
            
            $results = $this->userService->updateUser($id, $data);
            return response()->json(null, 204);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function assign(AssignmentRequest $request, $id) {

        try {
            $user = $this->userService->findUserById($id);
    

            $result = $this->userService->assignDepartment($id, $request->getDepartmentId());

            return response()->json(['status' => 'success', 'message' => 'Department assigned successfully'], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function openedTickets(Request $request) {

        try {
            $id = auth()->id();
            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 10);
            $query = $request->query('query',"");

            $result = $this->userService->getOpenedTickets($id, $page, $perPage, $query);
            

            return response()->json($result, 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
     public function profileUpdate(ProfileRequest $request) {

        $data=  $request->validated();
        if (!Hash::check($data['password'], auth()->user()->password)) {
            return response()->json(['message' => 'Invalid password entered'], 403);
        }
        try {
            if(!empty($data['new_password'])) {
                $data['password'] =$data['new_password'];
            }
           
            $id = auth()->id();

            $result = $this->userService->updateUser($id, $data);
            return response()->json($result, 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),

            ], 500);
        }
    }
    public function notifications(Request $request, $status) {

        $user = auth()->user();
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
     
        try {
            if($status !== 'all' && $status !== 'unread') {
                return response()->json([
                    'message' => 'Invalid status parameter. Use "all" or "unread".'
                ], 400);
            }
            if($status === 'all') $results = $user->notifications()->where("type","!=", NewResponse::class)->paginate($perPage, ['*'], 'page', $page);

            else $results = $user->unreadNotifications()->where("type","!=", NewResponse::class)->paginate($perPage, ['*'], 'page', $page);


            $unreadCount = $user->unreadNotifications()->where("type","!=", NewResponse::class)->count();
            $notificationsData = NotificationResource::collection($results->items());

            $paginationData = (new PaginationResource($results))->toArray(request());
            
             return response()->json(array_merge(
                    ['data' => $notificationsData],
                    $paginationData,
                    ['unread_count' => $unreadCount ]
            ));
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    public function responses(Request $request) {

     
        try {
            
            $user = auth()->user();
            $allResponses = $user->notifications()
                ->where('type', NewResponse::class)
                ->latest()
                ->get();
                
            $totalUnread = $allResponses->whereNull('read_at')->count();
            $groupedByUser = $allResponses
                    ->filter(fn ($n) => isset($n->data['user_id']))
                    ->groupBy(fn ($n) => $n->data['user_id']);

            $final = $groupedByUser->map(function (Collection $group, $userId) {
                $unreadCount = $group->whereNull('read_at')->count();
                $notification = $group->whereNull('read_at')->first() ?? $group->first();
                return [
                    'user_id' => $userId,
                    'notification' => [
                        'id' => $notification->id,
                        'message' => $notification->data['message'] ?? null,
                        'user' => $notification->data['user'] ?? null,
                        'response' => $notification->data['response'] ?? null,
                        'read_at' => $notification->read_at,
                        'created_at' => $notification->created_at,
                    ],
                    'unread_count' => $unreadCount,
                ];

            })->values();

         return response()->json([
                        'data' => $final], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    public function markAsRead(Request $request, $id, $ticket_id = null ) {
        try {
            $user = auth()->user();
            $notification = $user->notifications()->where('id', $id)->first();
    
            if (!$notification) {
                throw new ModelNotFoundException('Notification not found');
            }
            

            if($notification->type == NewResponse::class) {
                $targetUserId = $notification->data['user_id'];

                $user->unreadNotifications()
                ->where('type', NewResponse::class)
                ->get()
                ->filter(fn ($n) => $n->data['user_id'] == $targetUserId)
                ->each->markAsRead();
            }
            
            
            $notification->markAsRead();
            
            return response()->json([
                'message' => 'Notification marked as read',
                'data' => new NotificationResource($notification)
            ], 200);
            
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 404);

        }catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
