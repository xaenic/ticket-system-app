<?php 


namespace App\Services;


use App\Models\User;


class userService {

    protected $user; 


    public function __construct(user $user) {
        $this->user = $user;
    }

    public function getAllUsers() {
        return $this->user->all();
    }


    public function createUser(array $data) {
        return $this->user->create($data);
    }
    
    public function updateuser(int $id, array $data) {

        $user = $this->user->find($id);

        if(!$user) return null;
        
        return $user->update($data);
    }

    public function assigndepartment(int $id, int $departmentId) {
        $user = $this->user->find($id);
        $user->department_id = $departmentId;
        return $user->save();
    }
    
    public function deleteUser(int $id) {
        return $this->user->find($id)->delete();
    }
    

    
}