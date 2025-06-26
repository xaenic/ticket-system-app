<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Validations\UserValidation as UserRequest;
use App\Validations\AssignmentDepartmentValidation as AssignmentRequest;

use App\Services\UserService;

use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService) {
        
        $this->userService = $userService;

        $this->middleware(['auth:api', 'role:admin']);
    }

    public function index() {
    
        $results = $this->userService->getAllUsers(); 
        return response()->json(
            $results
        , 200);
    }

    /*
        For creating new Agents.
    */

    public function store(UserRequest $request) {

        $data = $request->validated();

        $results = $this->userService->createUser($data);

        $results->assignRole(Role::where('name','agent')->first());

        return response()->json([
            'status' => 'success',
        ], 201);
    }
    
    public function destroy($id) {
     
        $results = $this->userService->deleteUser($id);

        return response()->json([
            'status' => 'success',
            'message' => "User Not Found",
        ], $results ? 204 : 404);
    }

    public function update(UserRequest $request, $id) {

        $request->validated();

        $data =  [
            'name' => $request->getName()
        ];
        $results = $this->userService->updateUser($id, $data);
        return response()->json([
            'status' => 'success',
            'message' => "User not found",
        ], $results ? 204 : 404);
    }


    public function assign(AssignmentRequest $request, $id) {

        $user = $this->userService->findUserById($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        $result = $this->userService->assignDepartment($id, $request->getDepartmentId());

        return response()->json(['status' => 'success', 'message' => 'Department assigned successfully'], 200);
    }
}
