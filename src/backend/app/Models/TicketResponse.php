<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Ticket;
class TicketResponse extends Model
{
    use HasFactory;

    protected $fillable = ['ticket_id', 'user_id', 'message', 'created_at'];

    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function ticket() {
        return $this->belongsTo(Ticket::class);
    }
}
