<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Validations\DepartmentValidation as DepartmentRequest;

use App\Services\DepartmentService;

class DepartmentController extends Controller
{
    protected $departmentService;

    public function __construct(DepartmentService $departmentService) {
        
       

        $this->departmentService = $departmentService;

        $this->middleware(['auth:api', 'role:admin'], ['except' => ['index']]);
    }

    public function index(Request $request) {
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $results = $this->departmentService->getAllDepartments($page, $perPage);

        return response()->json($results, 200);
    }

    public function store(DepartmentRequest $request) {
        $data = $request->validated();

        $results = $this->departmentService->createDepartment($data); 

        return response()->json([
            'status' => 'success',
        ], 201);
    }
    
    public function destroy($id) {
     
        $results = $this->departmentService->deleteDepartment($id);

        return response()->json([
            'status' => 'success',
            'message' => "Department Not Found",
        ], $results ? 204 : 404);
    }

    public function update(DepartmentRequest $request, $id) {

        $request->validated();

        $data =  [
            'name' => $request->getName()
        ];


        $results = $this->departmentService->updateDepartment($id, $data);
        return response()->json([
            'status' => 'success',
            'message' => "Department not found",
        ], $results ? 204 : 404);
    }
}
