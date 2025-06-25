<?php 


namespace App\Services;


use App\Models\Ticket;


class TicketService {

    protected $ticket; 


    public function __construct(Ticket $ticket) {
        $this->ticket = $ticket;
    }

    


    public function createTicket(array $data) {
        return $this->ticket->create($data);
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

    public function getAlltickets(string $role, int $id = null) {
        if(!$id && $role === 'admin') {
            return $this->ticket->all();
        }
        if($role === 'agent') {
            return $this->ticket->where('agent_id', $id)->get();
        }
        if($role === 'client') 
        return $this->ticket->where('client_id', $id)->get();
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