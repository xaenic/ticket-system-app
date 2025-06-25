<?php

namespace App\Validations;


use Illuminate\Foundation\Http\FormRequest;

class UserLoginValidation extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ];

    }
   
    public function getEmail(): string
    {
        return $this->input('email');
    }
    public function getPassword(): string
    {
        return $this->input('password');
    }
}
