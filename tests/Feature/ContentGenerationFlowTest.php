<?php

namespace Tests\Feature;

use App\Models\ContentGeneration;
use App\Models\User;
use App\Services\AiContentGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class ContentGenerationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_store_a_generation(): void
    {
        $user = User::factory()->create();

        $this->mock(AiContentGeneratorService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('generate')
                ->once()
                ->andReturn([
                    'prompt' => 'Prompt body',
                    'generated_content' => 'Primary generated video script',
                    'variations' => [
                        ['title' => 'Variation 1', 'script' => 'Primary generated video script', 'content' => 'Primary generated video script', 'scenes' => []],
                        ['title' => 'Variation 2', 'script' => 'Alternative generated video script', 'content' => 'Alternative generated video script', 'scenes' => []],
                    ],
                    'provider' => 'gemini',
                    'model' => 'gemini-3-flash-preview',
                    'generation_duration_ms' => 842,
                ]);
        });

        $response = $this->actingAs($user)->post(route('generations.store'), [
            'template_key' => 'blank',
            'ui_language' => 'en',
            'video_type' => 'Marketing Video',
            'topic' => 'Launch video for a productivity app',
            'keywords' => 'ai, productivity, launch',
            'target_audience' => 'Busy professionals',
            'tone' => 'Professional',
            'video_goal' => 'Awareness',
            'video_format' => 'Storyboard',
            'cta_style' => 'Soft',
            'custom_instruction' => 'Keep it concise.',
            'variation_count' => 2,
            'duration_seconds' => 30,
        ]);

        $generation = ContentGeneration::query()->latest()->first();

        $this->assertNotNull($generation);
        $response->assertRedirect(route('dashboard', ['generation' => $generation->id]));
        $this->assertSame('Launch video for a productivity app', $generation->topic);
        $this->assertSame('Marketing Video', $generation->content_type);
        $this->assertSame('gemini', $generation->provider);
        $this->assertSame(30, $generation->duration_seconds);
        $this->assertSame(842, $generation->generation_duration_ms);
        $this->assertNull($generation->best_variation_index);
        $this->assertSame(['ai', 'productivity', 'launch'], $generation->keywords);
    }

    public function test_user_can_mark_a_variation_as_favorite(): void
    {
        $user = User::factory()->create();
        $generation = ContentGeneration::query()->create([
            'user_id' => $user->id,
            'content_type' => 'Marketing Video',
            'topic' => 'Launch video',
            'keywords' => ['launch', 'product'],
            'target_audience' => 'Existing users',
            'tone' => 'Persuasive',
            'template_key' => 'product-launch-video',
            'ui_language' => 'en',
            'content_goal' => 'Conversion',
            'output_format' => 'Storyboard',
            'cta_style' => 'Direct',
            'custom_instruction' => null,
            'duration_seconds' => 30,
            'length_control_type' => 'words',
            'length_control_value' => 150,
            'variation_count' => 2,
            'best_variation_index' => null,
            'variations' => [
                ['title' => 'Variation 1', 'script' => 'First script', 'content' => 'First script', 'scenes' => []],
                ['title' => 'Variation 2', 'script' => 'Favorite script', 'content' => 'Favorite script', 'scenes' => []],
            ],
            'prompt' => 'Prompt body',
            'generated_content' => 'First script',
            'provider' => 'gemini',
            'model' => 'gemini-3-flash-preview',
            'generation_duration_ms' => 650,
        ]);

        $response = $this->actingAs($user)->post(route('generations.favorite', $generation), [
            'variation_index' => 1,
        ]);

        $response->assertRedirect();

        $generation->refresh();

        $this->assertSame(1, $generation->best_variation_index);
        $this->assertSame('Favorite script', $generation->generated_content);
    }

    public function test_user_can_regenerate_an_existing_brief(): void
    {
        $user = User::factory()->create([
            'preferred_ai_provider' => 'groq',
            'preferred_output_language' => 'id',
        ]);

        $existingGeneration = ContentGeneration::query()->create([
            'user_id' => $user->id,
            'content_type' => 'Educational Clip',
            'topic' => 'Monthly product education clip',
            'keywords' => ['update', 'office'],
            'target_audience' => 'Internal team',
            'tone' => 'Professional',
            'template_key' => 'blank',
            'ui_language' => 'id',
            'content_goal' => 'Engagement',
            'output_format' => 'Storyboard',
            'cta_style' => 'Consultative',
            'custom_instruction' => 'Use a warm tone.',
            'duration_seconds' => 60,
            'length_control_type' => 'words',
            'length_control_value' => 180,
            'variation_count' => 2,
            'best_variation_index' => 0,
            'variations' => [
                ['title' => 'Variation 1', 'script' => 'Existing script', 'content' => 'Existing script', 'scenes' => []],
            ],
            'prompt' => 'Old prompt',
            'generated_content' => 'Existing script',
            'provider' => 'gemini',
            'model' => 'gemini-3-flash-preview',
            'generation_duration_ms' => 500,
        ]);

        $this->mock(AiContentGeneratorService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('generate')
                ->once()
                ->andReturn([
                    'prompt' => 'New prompt',
                    'generated_content' => 'Fresh regenerated script',
                    'variations' => [
                        ['title' => 'Variation 1', 'script' => 'Fresh regenerated script', 'content' => 'Fresh regenerated script', 'scenes' => []],
                    ],
                    'provider' => 'groq',
                    'model' => 'llama-3.1-8b-instant',
                    'generation_duration_ms' => 910,
                ]);
        });

        $response = $this->actingAs($user)->post(route('generations.regenerate', $existingGeneration));

        $this->assertDatabaseCount('content_generations', 2);

        $newGeneration = ContentGeneration::query()
            ->whereKeyNot($existingGeneration->id)
            ->latest('id')
            ->first();

        $response->assertRedirect(route('dashboard', ['generation' => $newGeneration->id]));
        $this->assertSame('Monthly product education clip', $newGeneration->topic);
        $this->assertSame('groq', $newGeneration->provider);
        $this->assertSame('Fresh regenerated script', $newGeneration->generated_content);
        $this->assertNull($newGeneration->best_variation_index);
    }

    public function test_user_can_update_ai_preferences(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch(route('settings.ai.update'), [
            'preferred_ai_provider' => 'groq',
            'preferred_output_language' => 'id',
        ]);

        $response->assertRedirect();

        $user->refresh();

        $this->assertSame('groq', $user->preferred_ai_provider);
        $this->assertSame('id', $user->preferred_output_language);
    }

    public function test_history_page_filters_by_provider_and_favorites(): void
    {
        $user = User::factory()->create();

        ContentGeneration::query()->create([
            'user_id' => $user->id,
            'content_type' => 'Marketing Video',
            'topic' => 'Gemini video draft',
            'keywords' => ['gemini'],
            'target_audience' => 'Marketers',
            'tone' => 'Professional',
            'template_key' => 'blank',
            'ui_language' => 'en',
            'content_goal' => 'Awareness',
            'output_format' => 'Storyboard',
            'cta_style' => 'Soft',
            'custom_instruction' => null,
            'duration_seconds' => 30,
            'length_control_type' => 'words',
            'length_control_value' => 250,
            'variation_count' => 1,
            'best_variation_index' => null,
            'variations' => [
                ['title' => 'Variation 1', 'script' => 'Gemini script', 'content' => 'Gemini script', 'summary' => 'Gemini summary', 'scenes' => []],
            ],
            'prompt' => 'Prompt',
            'generated_content' => 'Gemini script',
            'provider' => 'gemini',
            'model' => 'gemini-3-flash-preview',
            'generation_duration_ms' => 700,
        ]);

        ContentGeneration::query()->create([
            'user_id' => $user->id,
            'content_type' => 'Social Media Reel',
            'topic' => 'Groq favorite reel',
            'keywords' => ['groq'],
            'target_audience' => 'Teams',
            'tone' => 'Friendly',
            'template_key' => 'blank',
            'ui_language' => 'en',
            'content_goal' => 'Engagement',
            'output_format' => 'UGC Style',
            'cta_style' => 'Direct',
            'custom_instruction' => null,
            'duration_seconds' => 15,
            'length_control_type' => 'words',
            'length_control_value' => 150,
            'variation_count' => 1,
            'best_variation_index' => 0,
            'variations' => [
                ['title' => 'Variation 1', 'script' => 'Groq favorite script', 'content' => 'Groq favorite script', 'summary' => 'Groq favorite summary', 'scenes' => []],
            ],
            'prompt' => 'Prompt',
            'generated_content' => 'Groq favorite script',
            'provider' => 'groq',
            'model' => 'llama-3.1-8b-instant',
            'generation_duration_ms' => 620,
        ]);

        $response = $this->actingAs($user)->get(route('history.index', [
            'provider' => 'groq',
            'favorites' => 1,
        ]));

        $response->assertOk();
        $response->assertJsonPath('component', 'ContentGenerator/History');
        $response->assertJsonPath('props.filters.provider', 'groq');
        $response->assertJsonPath('props.filters.favorites', true);
        $response->assertJsonCount(1, 'props.generations.data');
        $response->assertJsonPath('props.generations.data.0.topic', 'Groq favorite reel');
    }

    public function test_dashboard_can_select_a_generation_outside_the_current_page(): void
    {
        $user = User::factory()->create();

        foreach (range(1, 8) as $index) {
            ContentGeneration::query()->create([
                'user_id' => $user->id,
                'content_type' => 'Marketing Video',
                'topic' => "Recent video result {$index}",
                'keywords' => ["recent-{$index}"],
                'target_audience' => 'Marketers',
                'tone' => 'Professional',
                'template_key' => 'blank',
                'ui_language' => 'en',
                'content_goal' => 'Awareness',
                'output_format' => 'Storyboard',
                'cta_style' => 'Soft',
                'custom_instruction' => null,
                'duration_seconds' => 30,
                'length_control_type' => 'words',
                'length_control_value' => 250,
                'variation_count' => 1,
                'best_variation_index' => null,
                'variations' => [
                    ['title' => 'Variation 1', 'script' => "Recent script {$index}", 'content' => "Recent script {$index}", 'scenes' => []],
                ],
                'prompt' => 'Prompt',
                'generated_content' => "Recent script {$index}",
                'provider' => 'gemini',
                'model' => 'gemini-3-flash-preview',
                'generation_duration_ms' => 300 + $index,
                'created_at' => now()->subHours($index),
                'updated_at' => now()->subHours($index),
            ]);
        }

        $olderGeneration = ContentGeneration::query()->create([
            'user_id' => $user->id,
            'content_type' => 'Marketing Video',
            'topic' => 'Older saved video result',
            'keywords' => ['older'],
            'target_audience' => 'Subscribers',
            'tone' => 'Friendly',
            'template_key' => 'blank',
            'ui_language' => 'en',
            'content_goal' => 'Engagement',
            'output_format' => 'Storyboard',
            'cta_style' => 'Soft',
            'custom_instruction' => null,
            'duration_seconds' => 45,
            'length_control_type' => 'words',
            'length_control_value' => 150,
            'variation_count' => 1,
            'best_variation_index' => null,
            'variations' => [
                ['title' => 'Variation 1', 'script' => 'Older script', 'content' => 'Older script', 'scenes' => []],
            ],
            'prompt' => 'Prompt',
            'generated_content' => 'Older script',
            'provider' => 'gemini',
            'model' => 'gemini-3-flash-preview',
            'generation_duration_ms' => 300,
            'created_at' => now()->subDays(2),
            'updated_at' => now()->subDays(2),
        ]);

        $response = $this->actingAs($user)->get(route('dashboard', [
            'generation' => $olderGeneration->id,
        ]));

        $response->assertOk();
        $response->assertJsonPath('component', 'ContentGenerator/Index');
        $response->assertJsonPath('props.selectedGenerationId', $olderGeneration->id);
        $response->assertJsonPath('props.selectedGeneration.id', $olderGeneration->id);
        $response->assertJsonPath('props.selectedGeneration.topic', 'Older saved video result');
    }
}
