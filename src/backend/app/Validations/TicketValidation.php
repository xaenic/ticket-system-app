<?php

namespace App\Validations;


use Illuminate\Foundation\Http\FormRequest;

class TicketValidation extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'status' => ['required', 'in:pending,open,closed,duplicate'],
            'priority' => ['required', 'in:low,medium,high'],
        ];

    }

    public function getTitle(): string
    {
        return $this->input('title');
    }
    public function getDescription(): string
    {
        return $this->input('description');
    }

    public function getStatus(): string
    {
        return $this->input('status');
    }

    public function getPriority(): string
    {
        return $this->input('priority');
    }

    public function getClientId(): int
    {
        return $this->input('client_id');
    }
    public function getDepartmentId(): int
    {
        return $this->input('department_id');
    }
}
