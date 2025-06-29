<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\NewTicket;
use App\Notifications\TicketUpdate;
use App\Services\TicketService;
use App\Validations\StatusValidation as StatusRequest;
use App\Validations\TicketValidation as TicketRequest;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketService $ticketService) {
        
        $this->ticketService = $ticketService;

        $this->middleware(['auth:api']);
        $this->middleware(['role:admin'], ['except' => ['userTickets','assign','store','show','update','updateStatus']]);
    }

    public function index() {
    
        $results = $this->ticketService->getAllTickets('admin'); 
        return response()->json($results, 200);
    }

    public function store(TicketRequest $request) {
        $data = $request->validated();
        try {
            $data['attachments'] = $request->file('attachments', []);
            $data['uploaded_by'] = auth()->id();
    
            $results = $this->ticketService->createTicket($data);
            $users = User::where('department_id', $results->department_id)->get();

            foreach ($users as $user) {
                $user->notify(new NewTicket($results->load('client')));
            }
            return response()->json([
                'status' => 'success',
            ], 201);
        }catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
        
    }

    public function update(TicketRequest $request, $id) {

        try {

            $data = $request->validated();
            $data['uploaded_by'] = auth()->id();
                
            $results = $this->ticketService->updateTicket($id, $data);

            return response()->json([
                  
                    'message' => "Ticket not found",
            ], $results ? 204 : 404);

        }catch(AuthorizationException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 403);
        }
        catch(ModelNotFoundException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 404);
        }catch(Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
        }
    }


    public function assign($id) {

        try {
             $ticket = $this->ticketService->getTicketById($id);
            if (!$ticket) {
                return response()->json(['status' => 'error', 'message' => 'Ticket not found'], 404);
            }
            $agent_id = auth()->id();
            $result = $this->ticketService->assignAgent($agent_id,$id);
            
            $user = $result->client;
            $user->notify(new TicketUpdate($result->load('assigneduser')));

            return response()->json(['status' => 'success', 'message' => 'Agent assigned successfully'], 200);
        } catch(AuthorizationException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 403);
        }
        catch(ModelNotFoundException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 404);
        }catch(Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
        }
       
    }

    public function show($id) {
        try {
                $userid = auth()->id();
                $ticket = $this->ticketService->getTicketById($id, $userid);

                return response()->json([
                    'status' => 'success',
                    'data' => [$ticket],
                ], 200);

        }catch(ModelNotFoundException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 404);
        }catch(Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
        }
        
    }

    public function userTickets(Request $request) {

        try {
                $id = auth()->id();

                $page = $request->query('page', 1);
                $perPage = $request->query('per_page', 10);
                $query = $request->query('query',"");
                $status = $request->query('status',"");
                $priority = $request->query('priority',"");

                $role = auth()->user()->getRoleNames()->first();
                $results = $this->ticketService->getAllTickets($role, $id, $page, $perPage, $query,$status,$priority);

                return response()->json($results , 200);

        } catch(Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
        }
       
    }

    public function updateStatus(StatusRequest $request, $id) {
        try {
                $data = $request->validated();

                $results = $this->ticketService->updateTicketStatus($data['status'],$id);

                $user = $results->client;
                $user->notify(new TicketUpdate($results->load('assigneduser')));

                return response()->json([
                    'status' => 'success',
                    'message' => 'Ticket status updated successfully',
                ], 200);
        }
        catch(AuthorizationException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 403);
        }
        catch(ModelNotFoundException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 404);
        }
        catch(Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
        }
       
    }
    
    
}
