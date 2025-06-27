<?php

namespace App\Validations;


use Illuminate\Foundation\Http\FormRequest;

class StatusValidation extends FormRequest
{

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:in-progress,open,closed,resolved'],
        ];

    }
}
