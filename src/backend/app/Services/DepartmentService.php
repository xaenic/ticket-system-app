<?php 


namespace App\Services;


use App\Models\Department;


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

        if(!$department) return null;
        
        return $department->update($data);
    }

    public function deleteDepartment(int $id) {
        return $this->department->find($id)->delete();
    }
    
    public function getAllDepartments() {
        return $this->department->all();
    }
    
}