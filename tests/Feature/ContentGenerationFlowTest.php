<?php

namespace Tests\Feature;

use App\Models\ContentGeneration;
use App\Models\User;
use App\Services\AiContentGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
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
                    'generated_content' => 'Primary generated content',
                    'variations' => [
                        ['title' => 'Variation 1', 'content' => 'Primary generated content'],
                        ['title' => 'Variation 2', 'content' => 'Alternative generated content'],
                    ],
                    'provider' => 'gemini',
                    'model' => 'gemini-3-flash-preview',
                    'generation_duration_ms' => 842,
                ]);
        });

        $response = $this->actingAs($user)->post(route('generations.store'), [
            'template_key' => 'blank',
            'ui_language' => 'en',
            'content_type' => 'Blog Post',
            'topic' => 'How to save time with AI',
            'keywords' => 'ai, productivity',
            'target_audience' => 'Busy professionals',
            'tone' => 'Professional',
            'content_goal' => 'Awareness',
            'output_format' => 'Paragraph',
            'cta_style' => 'Soft',
            'custom_instruction' => 'Keep it concise.',
            'variation_count' => 2,
            'length_control_type' => 'words',
            'length_control_value' => 250,
        ]);

        $response->assertRedirect(route('dashboard'));

        $generation = ContentGeneration::query()->latest()->first();

        $this->assertNotNull($generation);
        $this->assertSame('How to save time with AI', $generation->topic);
        $this->assertSame('gemini', $generation->provider);
        $this->assertSame(842, $generation->generation_duration_ms);
        $this->assertNull($generation->best_variation_index);
        $this->assertSame(['ai', 'productivity'], $generation->keywords);
    }

    public function test_user_can_mark_a_variation_as_favorite(): void
    {
        $user = User::factory()->create();
        $generation = ContentGeneration::query()->create([
            'user_id' => $user->id,
            'content_type' => 'Email',
            'topic' => 'Launch update',
            'keywords' => ['launch', 'product'],
            'target_audience' => 'Existing users',
            'tone' => 'Persuasive',
            'template_key' => 'product-launch-email',
            'ui_language' => 'en',
            'content_goal' => 'Conversion',
            'output_format' => 'Headline + Body',
            'cta_style' => 'Direct',
            'custom_instruction' => null,
            'length_control_type' => 'words',
            'length_control_value' => 150,
            'variation_count' => 2,
            'best_variation_index' => null,
            'variations' => [
                ['title' => 'Variation 1', 'content' => 'First content'],
                ['title' => 'Variation 2', 'content' => 'Favorite content'],
            ],
            'prompt' => 'Prompt body',
            'generated_content' => 'First content',
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
        $this->assertSame('Favorite content', $generation->generated_content);
    }

    public function test_user_can_regenerate_an_existing_brief(): void
    {
        $user = User::factory()->create([
            'preferred_ai_provider' => 'groq',
            'preferred_output_language' => 'id',
        ]);

        $existingGeneration = ContentGeneration::query()->create([
            'user_id' => $user->id,
            'content_type' => 'Email',
            'topic' => 'Monthly update',
            'keywords' => ['update', 'office'],
            'target_audience' => 'Internal team',
            'tone' => 'Professional',
            'template_key' => 'blank',
            'ui_language' => 'id',
            'content_goal' => 'Engagement',
            'output_format' => 'Paragraph',
            'cta_style' => 'Consultative',
            'custom_instruction' => 'Use a warm tone.',
            'length_control_type' => 'words',
            'length_control_value' => 180,
            'variation_count' => 2,
            'best_variation_index' => 0,
            'variations' => [
                ['title' => 'Variation 1', 'content' => 'Existing content'],
            ],
            'prompt' => 'Old prompt',
            'generated_content' => 'Existing content',
            'provider' => 'gemini',
            'model' => 'gemini-3-flash-preview',
            'generation_duration_ms' => 500,
        ]);

        $this->mock(AiContentGeneratorService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('generate')
                ->once()
                ->andReturn([
                    'prompt' => 'New prompt',
                    'generated_content' => 'Fresh regenerated content',
                    'variations' => [
                        ['title' => 'Variation 1', 'content' => 'Fresh regenerated content'],
                    ],
                    'provider' => 'groq',
                    'model' => 'llama-3.1-8b-instant',
                    'generation_duration_ms' => 910,
                ]);
        });

        $response = $this->actingAs($user)->post(route('generations.regenerate', $existingGeneration));

        $response->assertRedirect(route('dashboard'));
        $this->assertDatabaseCount('content_generations', 2);

        $newGeneration = ContentGeneration::query()
            ->whereKeyNot($existingGeneration->id)
            ->latest('id')
            ->first();

        $this->assertSame('Monthly update', $newGeneration->topic);
        $this->assertSame('groq', $newGeneration->provider);
        $this->assertSame('Fresh regenerated content', $newGeneration->generated_content);
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
            'content_type' => 'Blog Post',
            'topic' => 'Gemini draft',
            'keywords' => ['gemini'],
            'target_audience' => 'Marketers',
            'tone' => 'Professional',
            'template_key' => 'blank',
            'ui_language' => 'en',
            'content_goal' => 'Awareness',
            'output_format' => 'Paragraph',
            'cta_style' => 'Soft',
            'custom_instruction' => null,
            'length_control_type' => 'words',
            'length_control_value' => 250,
            'variation_count' => 1,
            'best_variation_index' => null,
            'variations' => [
                ['title' => 'Variation 1', 'content' => 'Gemini content'],
            ],
            'prompt' => 'Prompt',
            'generated_content' => 'Gemini content',
            'provider' => 'gemini',
            'model' => 'gemini-3-flash-preview',
            'generation_duration_ms' => 700,
        ]);

        ContentGeneration::query()->create([
            'user_id' => $user->id,
            'content_type' => 'Email',
            'topic' => 'Groq favorite',
            'keywords' => ['groq'],
            'target_audience' => 'Teams',
            'tone' => 'Friendly',
            'template_key' => 'blank',
            'ui_language' => 'en',
            'content_goal' => 'Engagement',
            'output_format' => 'Bullet Points',
            'cta_style' => 'Direct',
            'custom_instruction' => null,
            'length_control_type' => 'words',
            'length_control_value' => 150,
            'variation_count' => 1,
            'best_variation_index' => 0,
            'variations' => [
                ['title' => 'Variation 1', 'content' => 'Groq favorite content'],
            ],
            'prompt' => 'Prompt',
            'generated_content' => 'Groq favorite content',
            'provider' => 'groq',
            'model' => 'llama-3.1-8b-instant',
            'generation_duration_ms' => 620,
        ]);

        $response = $this->actingAs($user)->get(route('history.index', [
            'provider' => 'groq',
            'favorites' => 1,
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('ContentGenerator/History')
            ->where('filters.provider', 'groq')
            ->where('filters.favorites', true)
            ->has('generations.data', 1)
            ->where('generations.data.0.topic', 'Groq favorite'));
    }
}
