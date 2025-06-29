<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use App\Models\Ticket;

class NewTicket extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $message;
    protected $ticket;
    
    public function __construct(Ticket $ticket, $message = null)
    {
        $this->ticket = $ticket;
        $this->message = $message ?? "New ticket has been created by client!";
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
            'ticket' => $this->ticket, // Eloquent model will be serialized
        ];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->message,
            'ticket' => $this->ticket,
        ];
    }


    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->message,
            'ticket' => $this->ticket, // Same here
        ]);
    }

    public function broadcastOn()
    {
         return new PrivateChannel('department.'. $this->ticket->department_id);
    }
        
    public function broadcastAs()
    {
        return 'new-ticket';
    }
}
