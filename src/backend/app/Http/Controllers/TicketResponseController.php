<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Notifications\NewResponse;
use App\Services\TicketResponseService;
use App\Validations\TicketResponseValidation as TicketResponseRequest;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class TicketResponseController extends Controller
{
    protected $ticketResponseService;

    public function __construct(TicketResponseService $ticketResponseService) {
        
        $this->ticketResponseService = $ticketResponseService;

        $this->middleware(['auth:api']);
    }

    public function index(int $id) {
        try {
            $user_id = auth()->user()->id;

            $results = $this->ticketResponseService->getResponsesById($id, $user_id); 
            return response()->json([
                'status' => 'success',
                'data' => $results,
            ], 200);
        }
        catch(Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
        }
        
    }

    public function store(TicketResponseRequest $request) {
        
        try {
                $data = $request->validated();

                $data['attachments'] = $request->file('attachments', []);
                $data['uploaded_by'] = auth()->id();

                $result = $this->ticketResponseService->createResponse($data);

                $user = auth()->user(); 

                $ticket = Ticket::findOrFail($result->ticket_id);
                

                $userToNotify = $ticket->assigned_user_id === $user->id ? $ticket->client : $ticket->assigneduser;
                $userToNotify->notify(new NewResponse($result->load('user')));
                return response()->json([
                    'success' => true,
                    ], 201);
        }
        catch(AuthorizationException $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 403);
        }
        catch(Exception $e) {
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage(),
                ], 500);
        }
        
    }
    
}
