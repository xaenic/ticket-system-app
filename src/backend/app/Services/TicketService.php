<?php 


namespace App\Services;


use App\Models\Ticket;


class TicketService {

    protected $ticket; 


    public function __construct(Ticket $ticket) {
        $this->ticket = $ticket;
    }

    


    public function createTicket(array $data) {
        $data['client_id'] = $data['uploaded_by'];
        $ticket = $this->ticket->create($data);
        if(isset($data['attachments'])) {
           foreach ($data['attachments'] as $file) {
                $path = $file->store('attachments', 'private');
                $ticket->attachments()->create([
                    'filename' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'extension' => $file->getClientOriginalExtension(),
                    'uploaded_by' => $data['uploaded_by'],
                   
                ]);
            }
        }
        return $ticket;
    }
    
    public function updateTicket(int $id, array $data) {

        $ticket = $this->ticket->find($id);

        if(!$ticket) return null;
        
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
    
    public function getTicketById(int $id) {
        return $this->ticket->with('responses')->find($id);
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