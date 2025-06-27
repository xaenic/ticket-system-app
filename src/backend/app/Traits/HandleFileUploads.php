<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\Attachment;

trait HandleFileUploads
{
   
   public function uploadAttachments($data, $ticket) {
        foreach ($data['attachments'] as $file) {
                    $path = $file->store('attachments', 'private');
                    $ticket->attachments()->create([
                        'filename' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'mime_type' => $file->getClientMimeType(),
                        'size' => $file->getSize(),
                        'extension' => $file->getClientOriginalExtension(),
                        'uploaded_by' => $data['uploaded_by'],
                        'ticket_id' => isset($data['ticket_id']) ? $data['ticket_id'] : null,
                    ]);
                }
    }
    public function deleteAttachments($data) {
        foreach ($data['deleted_files'] as $fileId) {
            Attachment::where('id', $fileId)->delete();
        }

    }
}
