<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\User;
use App\Models\Ticket;
class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name'];



    public function users() {
        return $this->hasMany(User::class);
    }


    public function tickets() {
        return $this->hasMany(Ticket::class);
    }

}
