<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Department;
use App\Models\TicketResponse;
use App\Models\Attachment;
class Ticket extends Model
{
    use HasFactory;


    protected $fillable = ['title','description','status','priority','client_id','department_id','assigned_user_id'];


    public function client() {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function department() {
        return $this->belongsTo(Department::class);
    }

    public function assigneduser() {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function responses() {
        return $this->hasMany(TicketResponse::class);
    }
     public function attachments() {
        return $this->hasMany(Attachment::class);
    }
}
