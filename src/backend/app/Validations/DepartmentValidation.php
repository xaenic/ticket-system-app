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
            'name' => 'required|unique:departments,name',
        ];
    }

    public function getName(): string
    {
        return $this->input('name');
    }
}


class AssignmentDepartmentValidation extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    
    public function rules(): array
    {
        return [
            'department_id' => 'required|exists:departments,id',
        ];
    }

    public function getDepartmentId(): int
    {
        return $this->input('department_id');
    }
    
}
