<?php 


namespace App\Services;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\Ticket;
use App\Models\User;

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
            $this->uploadAttachments($data, $ticket);
        }
        return $ticket;
    }
    
    public function updateTicket(int $id, array $data) {

        $ticket = $this->ticket->find($id);

        if(!$ticket) throw new ModelNotFoundException('Ticket not found.');
        
        if ($ticket->status !== 'open') {
            throw new AuthorizationException('Only open tickets can be updated.');
        }

        if($ticket->client_id != auth()->id()) {
             throw new AuthorizationException('Only the client who created the ticket can update it.');
        }

        if(isset($data['new_attachments'])) {
            $data['attachments'] = $data['new_attachments'];
            $this->uploadAttachments($data, $ticket);
        }
        if(isset($data['deleted_files'])) {
            $this->deleteAttachments($data,$ticket);
        }
       $ticket->update($data);
        return $ticket;
    }

    public function assignAgent(int $agent_id, int $ticket_id) {
        $ticket = $this->ticket->find($ticket_id);
        if($ticket->assigned_user_id) {
            throw new AuthorizationException('Ticket is already assigned to an agent.');
        }


        $user = User::find($agent_id);
        if(!$user) {
            throw new ModelNotFoundException('User is not an agent.');
        }

        if($user->department_id != $ticket->department_id) {
            throw new AuthorizationException('Agent does not belong to the same department as the ticket.');
        }

        $ticket->status= 'in-progress';
        $ticket->assigned_user_id = $agent_id;

        $ticket->save();
        return $ticket;
    }

    public function updateTicketStatus(string $status, int $ticket_id) {
        $ticket = $this->ticket->find($ticket_id);
        if(!$ticket) {
            throw new ModelNotFoundException('Ticket not found.');
        }

        $user_id = auth()->id();
        $role = auth()->user()->getRoleNames()->first();
        
        if($user_id != $ticket->assigned_user_id && $role != "admin") {
            throw new AuthorizationException('Only the assigned agent can update the ticket status.');
        }
        if($ticket-> status != 'in-progress' && $ticket->status != 'open') {
            throw new AuthorizationException('Only pending or open tickets can be updated.');
        }
        $ticket->status = $status;
        $ticket->save();
        return $ticket;
    }

    
    public function getTicketById(int $id) {

        $query = Ticket::query();
        $query->with('responses')->with('responses.attachments')->with('responses.user');  
        $query->with('assigneduser');  
        $query->with('department');  
        $query->with('attachments')->with('attachments.uploadedBy');  
        $result = $query->where('id',$id)->first();

        if(!$result) throw new ModelNotFoundException('Ticket not found.');

        return $result;
    }

    public function getAlltickets(string $role, int $id = null, int $page = 1, int $perpage = 10, string $query = '', string $status ='' , string $priority='') {

        $ticketQuery = Ticket::query();

        if($query)      $ticketQuery->where('title', 'like', "%{$query}%")->orWhere('description', 'like', "%{$query}%");

        if($status)     $ticketQuery->where('status', $status);
        
        if($priority)   $ticketQuery->where('priority', $priority);

        if($role === 'agent') $ticketQuery->where('assigned_user_id',$id);
        
        if($role === 'client') $ticketQuery->where('client_id',$id);

        if($role === 'admin') $ticketQuery->with('assigneduser');


         return $ticketQuery->with('client')->with('department')->paginate($perpage, ['*'], 'page', $page);
    }

    public function getRecentTickets(string $role, int $limit = 5) {

        $id = auth()->id();
      
        if($role == "admin") {
            return $this->ticket->with('client')->orderBy('created_at', 'desc')->take($limit)->get();
        }
        return $this->ticket->with('assigneduser')->with('client')->where('client_id', $id)->orWhere('assigned_user_id',$id)->orderBy('updated_at', 'desc')->take($limit)->get();
    }

    public function getTicketCounts(string $role) {

        $id = auth()->id(); 
        
        if($role == "admin")
            return $this->ticket->count();
        return $this->ticket->where('client_id', $id)->orWhere('assigned_user_id',$id)->count();
    }

    public function getTicketCountByStatus(string $role, string $status) {
        if($role == "admin")
            return $this->ticket->where('status', $status)->count();

        $id = auth()->id(); 
        
        return $this->ticket->where('status',$status)->where(function ($q) use ($id) {
            $q->where('assigned_user_id',$id)->orWhere('client_id',$id);
        })->count();
    }

    public function getTicketCountByPriority(string $priority) {
        return $this->ticket->where('priority', $priority)->count();
    }
    
}