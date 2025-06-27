<?php 


namespace App\Services;


use App\Models\TicketResponse;
use App\Models\Ticket;

use App\Traits\HandleFileUploads; // Assuming this trait is used for file handling
class TicketResponseService {

    protected $ticketResponse;
    
    use HandleFileUploads;
    public function __construct(TicketResponse $ticketResponse) {
        $this->ticketResponse = $ticketResponse;
    }

    public function createResponse(array $data) {
         $data['user_id'] = auth()->id();
         $data['ticket_id'] = $data['ticket_id'];

         $ticket = Ticket::find($data['ticket_id']);

         if($ticket->assigned_user_id == null) {
            throw new \Exception('Ticket is not assigned to any agent');
         }
         if(auth()->id() != $ticket->assigned_user_id && auth()->id() != $ticket->client_id) {
            throw new \Exception('You are not authorized to respond to this ticket');
         }
         if($ticket->status == 'closed' || $ticket->status == 'resolved') {
            throw new \Exception("You can't add more response to this ticket.");
         }
         $ticket = $this->ticketResponse->create($data);
         if(isset($data['attachments'])) {
            $this->uploadAttachments($data, $ticket);

         }
        return $ticket;
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