<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Validations\TicketResponseValidation as TicketResponseRequest;

use Illuminate\Auth\Access\AuthorizationException;

use App\Services\TicketResponseService;

use Spatie\Permission\Models\Role;

use Exception;

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

                $results = $this->ticketResponseService->createResponse($data);

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
