<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContentGenerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content_type' => ['required', 'string', 'max:100'],
            'topic' => ['required', 'string', 'max:200'],
            'keywords' => ['nullable', 'string', 'max:500'],
            'target_audience' => ['required', 'string', 'max:255'],
            'tone' => ['required', 'string', 'max:100'],
            'variation_count' => ['required', 'integer', 'min:1', 'max:3'],
            'template_key' => ['nullable', 'string', 'max:100'],
            'ui_language' => ['required', 'string', 'in:en,id'],
            'content_goal' => ['nullable', 'string', 'max:100'],
            'output_format' => ['nullable', 'string', 'max:100'],
            'cta_style' => ['nullable', 'string', 'max:100'],
            'custom_instruction' => ['nullable', 'string', 'max:1500'],
            'length_control_type' => ['required', 'string', 'in:words,characters'],
            'length_control_value' => ['required', 'integer', 'min:50', 'max:3000'],
        ];
    }
}
