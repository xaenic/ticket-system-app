<?php 


namespace App\Services;


use App\Models\Ticket;

use Exception;
use App\Traits\HandleFileUploads;

class TicketService {

    protected $ticket; 

    use HandleFileUploads;
    
    public function __construct(Ticket $ticket) {
        $this->ticket = $ticket;
    }

   
    public function createTicket(array $data) {
        $data['client_id'] = $data['uploaded_by'];
        $ticket = $this->ticket->create($data);
        if(isset($data['attachments'])) {
            \Log::error('Ticket update error:');
            $this->uploadAttachments($data, $ticket);
        }
        return $ticket;
    }
    
    public function updateTicket(int $id, array $data) {

        $ticket = $this->ticket->find($id);

        if(!$ticket) return null;
        
        if ($ticket->status !== 'open') {
            throw new \Exception('Only open tickets can be updated.');
        }

        if($ticket->client_id != auth()->id()) {
             throw new \Exception('Only the client who created the ticket can update it.');
        }

        if(isset($data['new_attachments'])) {
            $data['attachments'] = $data['new_attachments'];
            $this->uploadAttachments($data, $ticket);
        }
        if(isset($data['deleted_files'])) {
            $this->deleteAttachments($data,$ticket);
        }
        
        return $ticket->update($data);
    }

    public function assignAgent(int $agent_id, int $ticket_id) {
        $ticket = $this->ticket->find($id);
        $ticket->department_id = $departmentId;
        return $ticket->save();
    }
    
    public function deleteTicket(int $id) {
        return $this->ticket->find($id)->delete();
    }
    
    public function getTicketById(int $id, int $user_id=null) {

        $query = Ticket::query();
        $query->with('responses')->with('responses.attachments')->with('responses.user');  
        $query->with('assigneduser');  
        $query->with('attachments')->with('attachments.uploadedBy');  
        if($user_id) $query->where(function ($q) use ($user_id) {
            $q->where('client_id', $user_id)
              ->orWhere('assigned_user_id', $user_id);
            });
        return $query->where('id',$id)->first();
    }

    public function getAlltickets(string $role, int $id = null, int $page = 1, int $perpage = 10, string $query = '', string $status ='' , string $priority='') {

        $ticketQuery = Ticket::query();

        if($query)      $ticketQuery->where('title', 'like', "%{$query}%")->orWhere('description', 'like', "%{$query}%");

        if($status)     $ticketQuery->where('status', $status);
        
        if($priority)   $ticketQuery->where('priority', $priority);

        if($role === 'agent') $ticketQuery->where('assigned_user_id',$id);
        
        if($role === 'client') $ticketQuery->where('client_id',$id);

         return $ticketQuery->with('department')->paginate($perpage, ['*'], 'page', $page);
    }

    public function getRecentTickets(int $limit = 5) {
        return $this->ticket->orderBy('created_at', 'desc')->take($limit)->get();
    }

    public function getTicketCounts() {
        return $this->ticket->count();
    }

    public function getTicketCountByStatus(string $status) {
        return $this->ticket->where('status', $status)->count();
    }

    public function getTicketCountByPriority(string $priority) {
        return $this->ticket->where('priority', $priority)->count();
    }
    
}