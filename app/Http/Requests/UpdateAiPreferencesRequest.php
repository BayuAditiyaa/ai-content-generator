<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAiPreferencesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'preferred_ai_provider' => [
                'nullable',
                'string',
                Rule::in(['gemini', 'groq']),
            ],
            'preferred_output_language' => [
                'required',
                'string',
                Rule::in(['en', 'id']),
            ],
        ];
    }
}
