<?php

namespace App\Http\Controllers;

use App\Services\DepartmentService;
use App\Validations\DepartmentValidation as DepartmentRequest;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
class DepartmentController extends Controller
{
    protected $departmentService;

    public function __construct(DepartmentService $departmentService) {
        
       

        $this->departmentService = $departmentService;

        $this->middleware(['auth:api', 'role:admin'], ['except' => ['index']]);
    }

    public function index(Request $request) {

        try{

            $page = $request->query('page', 1);
            $perPage = $request->query('per_page', 10);
            $query = $request->query('query',"");

            $results = $this->departmentService->getAllDepartments($page, $perPage,$query);

            return response()->json($results, 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
      
    }

    public function store(DepartmentRequest $request) {

        $data = $request->validated();
        try {

            $results = $this->departmentService->createDepartment($data); 

            return response()->json([
                'status' => 'success',
            ], 201);

        }catch(Exception $e) {
               return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }

    }
    
    public function destroy($id) {
     
        try {

            $results = $this->departmentService->deleteDepartment($id);
            return response()->json(null,204);

        }catch (ModelNotFoundException $e) {

            return response()->json([
                'message' => $e->getMessage(),
            ], 404);

        }catch(Exception $e) {

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);

        }
            
    }

    public function update(DepartmentRequest $request, $id) {
        $data = $request->validated();

        try {

            $results = $this->departmentService->updateDepartment($id, $data);
            return response()->json(null,204);

         }catch (ModelNotFoundException $e) {

            return response()->json([
                'message' => $e->getMessage(),
            ], 404);

        }catch(Exception $e) {

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
            
        }

        
    }


}
