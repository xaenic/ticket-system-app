<?php 


namespace App\Services;


use App\Models\User;
use \Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class userService {

    protected $user; 


    public function __construct(user $user) {
        $this->user = $user;
    }

    
    public function createUser(array $data) {
         if (array_key_exists('avatar', $data) ) {
               $data['avatar'] = $data['avatar'] instanceof UploadedFile
               ? $data['avatar']->store('avatars', 'public') : $data->file('avatar')->store('avatars', 'public');
        } else {
            $data['avatar'] = null; 
        }
        
        return $this->user->create($data);
    }
    
    public function updateUser(int $id, array $data) {

        $user = $this->user->find($id);

        if(!$user) throw new ModelNotFoundException("User not found");

        if (array_key_exists('avatar', $data)) {
              $data['avatar'] = $data['avatar'] instanceof UploadedFile
               ? $data['avatar']->store('avatars', 'public') : $data->file('avatar')->store('avatars', 'public');
        } else {
            $data['avatar'] = null; // Set a default value if no avatar is uploaded
        }
        $user->update($data);
        return $user;
    }

    public function assignDepartment(int $id, int $departmentId) {
        $user = $this->user->find($id);
        
        if(!$user) throw new ModelNotFoundException("User not found");

        $user->department_id = $departmentId;
        return $user->save();
    }
    
    public function deleteUser(int $id) {
        $user = $this->user->find($id);
        if(!$user) throw new ModelNotFoundException("User not found");
        return $user->delete();
    }
    
    public function getUserById(int $id) {
        $user = $this->user->find($id);
        if(!$user) throw new ModelNotFoundException("User not found");
        return $user;
    }

    public function getUserByEmail(string $email) {
        $user = $this->user->where('email', $email)->first();
        if(!$user) throw new ModelNotFoundException("User not found");
        return $user;
    }
    public function getAllUsers(int $page = 1, int $perpage = 10) {
        return $this->user->paginate($perpage, ['*'], 'page', $page);
    }

    public function getAllAgents(int $page = 1, int $perpage = 10, $query = "") {
        if($query != "") return $this->user->role('agent')->with('department')
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->paginate($perpage, ['*'], 'page', $page);

        return $this->user->role('agent')->with('department')->paginate($perpage, ['*'], 'page', $page);
    }

    public function getUserCountsByRole(string $role) {

        return $this->user->role($role)->count();
    }
    
    public function getOpenedTickets($id,int $page = 1, int $perpage = 10, $query = "") {
        $user = $this->user->with('department')->find($id);
        if(!$user) throw new ModelNotFoundException("User not found");
        
        $tickets =  $user->department ? $user->department->tickets()->with('client')->where('status','open')->paginate($perpage, ['*'], 'page', $page) : collect() ;

        return $tickets;
    }
    
}