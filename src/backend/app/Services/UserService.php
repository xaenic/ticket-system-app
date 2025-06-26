<?php 


namespace App\Services;


use App\Models\User;

use Spatie\Permission\Models\Role;

class userService {

    protected $user; 


    public function __construct(user $user) {
        $this->user = $user;
    }

    
    public function createUser(array $data) {
        return $this->user->create($data);
    }
    
    public function updateUser(int $id, array $data) {

        $user = $this->user->find($id);

        if(!$user) return null;
        
        return $user->update($data);
    }

    public function assignDepartment(int $id, int $departmentId) {
        $user = $this->user->find($id);
        $user->department_id = $departmentId;
        return $user->save();
    }
    
    public function deleteUser(int $id) {
        return $this->user->find($id)->delete();
    }
    
    public function getUserById(int $id) {
        return $this->user->find($id);
    }

    public function getUserByEmail(string $email) {
        return $this->user->where('email', $email)->first();
    }
    public function getAllUsers(int $page = 1, int $perpage = 10) {
        return $this->user->paginate($perpage, ['*'], 'page', $page);
    }

    public function getUserCountsByRole(string $role) {
        return $this->user->role($role)->count();
    }
    
}