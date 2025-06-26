<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Ticket;
use App\Models\TicketResponse;
class Attachment extends Model
{
    use HasFactory;


    protected $fillable = ['ticket_id','response_id','filename','file_path','mime_type','size','extension', 'uploaded_by'];


    public function ticket() {
        return $this->belongsTo(Ticket::class);
    }

    public function response() {
        return $this->belongsTo(TicketResponse::class);
    }

    public function uploadedBy() {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
