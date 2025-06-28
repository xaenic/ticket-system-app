<?php

namespace App\Validations;


use Illuminate\Foundation\Http\FormRequest;

class ProfileValidation extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */

    
    public function rules(): array
    {
         
        return [
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'], 
            'password' => ['nullable','string', 'min:8'],
            'new_password' => ['nullable', 'string', 'min:8'],
        ];

    }
}
