<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;
use App\Models\Attachment;

use Spatie\Permission\Models\Role;

use Illuminate\Database\Eloquent\ModelNotFoundException;


use Exception;

class AttachmentController extends Controller
{
 
    public function __construct() {
        


        $this->middleware(['auth:api']);
        
    }

    public function download($id) {
        
        try {
                $user_id = auth()->id();
                $attachment = Attachment::findOrFail($id);
                $ticket = $attachment->ticket;
                $response = $attachment->response;

                if ($attachment->uploaded_by !== $user_id && $ticket->client_id != $user_id && $ticket->assigned_user_id != $user_id) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'You are not allowed to download this file.',
                    ], 403);
             
                }
                $filePath = $attachment->file_path;
                return Storage::disk('private')->download($filePath, $attachment->filename);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

         

    
}
