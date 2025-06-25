<?php 


namespace App\Services;


use App\Models\TicketResponse;


class TicketResponseService {

    protected $ticketResponse;


    public function __construct(TicketResponse $ticketResponse) {
        $this->ticketResponse = $ticketResponse;
    }

    public function createResponse(array $data) {
        return $this->ticketResponse->create($data);
    }
    
    public function updateResponse(int $id, array $data) {

        $ticket = $this->ticketResponse->find($id);

        if(!$ticket) return null;
        
        return $ticket->update($data);
    }

    public function deleteResponse(int $id) {
        return $this->ticketResponse->find($id)->delete();
    }
    
    public function getResponsesById(int $ticket_id, int $user_id) {
        return $this->ticketResponse->where('ticket_id', $ticket_id)->where('user_id', $user_id)->get();
    }
    
}