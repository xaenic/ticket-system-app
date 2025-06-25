<?php

namespace App\Validations;


use Illuminate\Foundation\Http\FormRequest;

class DepartmentValidation extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
        ];
    }

    public function getName(): string
    {
        return $this->input('name');
    }
}
