<?php 


namespace App\Services;


use App\Models\Department;

use Exception;

use Illuminate\Database\Eloquent\ModelNotFoundException;

class DepartmentService {

    protected $department; 


    public function __construct(Department $department) {
        $this->department = $department;
    }

    public function createDepartment(array $data) {
        return $this->department->create($data);
    }
    
    public function updateDepartment(int $id, array $data) {

        $department = $this->department->find($id);

        if(!$department) throw new ModelNotFoundException("Department Not Found");
        $department->update($data);
        
        return $department;
    }

    public function deleteDepartment(int $id) {

        $result = $this->department->find($id);

        if(!$result) throw new ModelNotFoundException("Department Not Found");

        return  $result->delete();
    }
    
    public function getDepartmentById(int $id) {

        $result = $this->department->find($id);

        if(!$result) throw new ModelNotFoundException("Department Not Found");
            
        return $result;
    }
    
    public function getAllDepartments(int $page = 1, int $perpage = 10, string $query = '') {

        if($query) return $this->department->where('name', 'like', "%{$query}%")
                                    ->paginate($perpage, ['*'], 'page', $page);
        
        return $this->department->orderBy('created_at', 'desc')->paginate($perpage, ['*'], 'page', $page);
    }

    public function getDepartmentCounts() {
        return $this->department->count();
    }
    
}