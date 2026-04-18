<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContentGeneration extends Model
{
    protected $fillable = [
        'user_id',
        'content_type',
        'topic',
        'keywords',
        'target_audience',
        'tone',
        'template_key',
        'ui_language',
        'content_goal',
        'output_format',
        'cta_style',
        'custom_instruction',
        'length_control_type',
        'length_control_value',
        'variation_count',
        'best_variation_index',
        'variations',
        'prompt',
        'generated_content',
        'provider',
        'model',
        'generation_duration_ms',
    ];

    protected function casts(): array
    {
        return [
            'keywords' => 'array',
            'variations' => 'array',
            'best_variation_index' => 'integer',
            'generation_duration_ms' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (! $term) {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($term) {
            $builder
                ->where('topic', 'like', "%{$term}%")
                ->orWhere('content_type', 'like', "%{$term}%")
                ->orWhere('target_audience', 'like', "%{$term}%")
                ->orWhere('tone', 'like', "%{$term}%")
                ->orWhere('generated_content', 'like', "%{$term}%");
        });
    }
}
