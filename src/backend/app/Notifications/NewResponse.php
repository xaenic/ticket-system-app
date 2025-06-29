<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use App\Models\TicketResponse;

class NewResponse extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $message;
    protected $ticketResponse;

    public function __construct(TicketResponse $ticketResponse, $message = null)
    {
        $this->ticketResponse = $ticketResponse;
        $this->message = $message ?? "New ticket response from {$ticketResponse->user->name}!";
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => $this->message,
            'user_id' => $this->ticketResponse->user_id,
            'user'=> $this->ticketResponse->user, 
            'type' => 'response',
            'response' => $this->ticketResponse, // Eloquent model will be serialized
        ];
    }

    public function toDatabase($notifiable)
    {
       return [
            'message' => $this->message,
            'user_id' => $this->ticketResponse->user_id,
            'user'=> $this->ticketResponse->user, 
            'type' => 'response',
            'response' => $this->ticketResponse, // Eloquent model will be serialized
        ];
    }


    public function toBroadcast($notifiable)
    {
         return [
            'message' => $this->message,
            'user_id' => $this->ticketResponse->user_id,
            'user'=> $this->ticketResponse->user, 
            'type' => 'response',
            'response' => $this->ticketResponse, // Eloquent model will be serialized
        ];
    }

    public function broadcastOn()
    {
         return [];
    }
        
    public function broadcastAs()
    {
        return 'new-response';
    }
}
