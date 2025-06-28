<?php

namespace App\Validations;


use Illuminate\Foundation\Http\FormRequest;

class UserValidation extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */

    
    public function rules(): array
    {
         
        return [
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'], // Optional avatar field
            'email' => [ $this->isMethod('PUT') ? 'sometimes' : 'required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => [$this->isMethod('PUT') ? 'sometimes' : 'required', 'string', 'min:8', 'confirmed'],
            'department_id' => ['nullable','string', 'exists:departments,id'], // Optional department ID
        ];

    }

    public function getName(): string
    {
        return $this->input('name');
    }
    public function getEmail(): string
    {
        return $this->input('email');
    }

    public function getPassword(): string
    {
        return $this->input('password');
    }
    public function getDepartmentId():int
    {
        return $this->input('department_id');
    }
}
