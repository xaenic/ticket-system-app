<?php

namespace App\Validations;


use Illuminate\Foundation\Http\FormRequest;

class TicketResponseValidation extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'ticket_id' => ['required', 'int', 'exists:tickets,id'],
            'message' => ['required', 'string'],
        ];

    }

    public function getTicketId(): int
    {
        return $this->input('ticket_id');
    }

    public function getMessage(): string
    {
        return $this->input('description');
    }
}
