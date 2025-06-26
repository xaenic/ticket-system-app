<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Validations\TicketValidation as TicketRequest;



use App\Services\TicketService;

use Spatie\Permission\Models\Role;

class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketService $ticketService) {
        
        $this->ticketService = $ticketService;

        $this->middleware(['auth:api']);
        $this->middleware(['role:admin'], ['except' => ['userTickets','assign','store']]);
    }

    public function index() {
    
        $results = $this->ticketService->getAllTickets('admin'); 
        return response()->json($results, 200);
    }

    public function store(TicketRequest $request) {

        $data = $request->validated();
        $data['attachments'] = $request->file('attachments', []);
        $data['uploaded_by'] = auth()->id();
  
        
        $results = $this->ticketService->createTicket($data);
        
        return response()->json([
            'status' => 'success',
        ], 201);
    }
    
    public function destroy($id) {
     
        $results = $this->ticketService->deleteTicket($id);

        return response()->json([
            'status' => 'success',
            'message' => "Ticket Not Found",
        ], $results ? 204 : 404);
    }

    public function update(TicketRequest $request, $id) {

        $request->validated();

        $data =  [
            'title' => $request->getTitle(),
            'description' => $request->getDescription(),
            'status' => $request->getStatus(),
            'priority' => $request->getPriority(),
        ];
        $results = $this->ticketService->updateTicket($id, $data);
        return response()->json([
            'status' => 'success',
            'message' => "Ticket not found",
        ], $results ? 204 : 404);
    }


    public function assign($id) {

        $ticket = $this->ticketService->getTicketById($id);
        if (!$ticket) {
            return response()->json(['status' => 'error', 'message' => 'Ticket not found'], 404);
        }
        $agent_id = auth()->id();
        $result = $this->ticketService->assignAgent($agent_id,$id);

        return response()->json(['status' => 'success', 'message' => 'Agent assigned successfully'], 200);
    }

    public function show($id) {
        $ticket = $this->ticketService->getTicketById($id);
        if (!$ticket) {
            return response()->json(['status' => 'error', 'message' => 'Ticket not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $ticket,
        ], 200);
    }

    public function userTickets(Request $request) {

        $id = auth()->id();

        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $query = $request->query('query',"");
        $status = $request->query('status',"");
        $priority = $request->query('priority',"");

        $role = auth()->user()->getRoleNames()->first();
        $results = $this->ticketService->getAllTickets($role, $id, $page, $perPage, $query,$status,$priority);

        return response()->json($results , 200);
    }
}
