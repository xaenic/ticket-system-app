<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Validations\TicketResponseValidation as TicketResponseRequest;



use App\Services\TicketResponseService;

use Spatie\Permission\Models\Role;

class TicketResponseController extends Controller
{
    protected $ticketResponseService;

    public function __construct(TicketResponseService $ticketResponseService) {
        
        $this->ticketResponseService = $ticketResponseService;

        $this->middleware(['auth:api']);
    }

    public function index(int $id) {

        $user_id = auth()->user()->id;

        $results = $this->ticketResponseService->getResponsesById($id, $user_id); 
        return response()->json([
            'status' => 'success',
            'data' => $results,
        ], 200);
    }

    public function store(TicketResponseRequest $request) {

        $data = $request->validated();

        $results = $this->ticketResponseService->createResponse($data);

        return response()->json([
            'status' => 'success',
        ], 201);
    }
    
    public function destroy($id) {
     
        $results = $this->ticketResponseService->deleteResponse($id);

        return response()->json([
            'status' => 'success',
            'message' => "Response Not Found",
        ], $results ? 204 : 404);
    }

    public function update(TicketResponseRequest $request, $id) {

       
        $data = $request->validated();
        $results = $this->ticketResponseService->updateResponse($id, $data);
        return response()->json([
            'status' => 'success',
            'message' => "Response not found",
        ], $results ? 204 : 404);
    }

}
