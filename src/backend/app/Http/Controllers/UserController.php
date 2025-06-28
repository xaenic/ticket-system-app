<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Validations\UserValidation as UserRequest;
use App\Validations\AssignmentDepartmentValidation as AssignmentRequest;

use App\Services\UserService;

use Spatie\Permission\Models\Role;

use Illuminate\Database\Eloquent\ModelNotFoundException;

use Exception;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService) {
        
        $this->userService = $userService;

        $this->middleware(['auth:api']);
         $this->middleware('role:admin')->except(['openedTickets']);
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
}
