<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContentGenerationRequest;
use App\Models\ContentGeneration;
use App\Services\AiContentGeneratorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class ContentGenerationController extends Controller
{
    protected const DEFAULT_TEMPLATE_KEY = 'blank';

    public function __construct(
        protected AiContentGeneratorService $generator,
    ) {
    }

    public function index(Request $request): Response
    {
        $templates = $this->templates();
        $selectedGenerationId = $request->integer('generation');
        $prefillGenerationId = $request->integer('prefill');
        $selectedGeneration = $selectedGenerationId
            ? $request->user()
                ->contentGenerations()
                ->whereKey($selectedGenerationId)
                ->first()
            : null;

        $generations = $request->user()
            ->contentGenerations()
            ->latest()
            ->paginate(8)
            ->withQueryString()
            ->through(fn (ContentGeneration $generation) => $this->transformGeneration($generation));

        $latestGeneration = $request->user()
            ->contentGenerations()
            ->latest()
            ->first();

        return Inertia::render('ContentGenerator/Index', [
            'formOptions' => [
                'videoTypes' => [
                    'Marketing Video',
                    'Educational Clip',
                    'Social Media Reel',
                    'Product Explainer',
                    'Testimonial Video',
                    'Brand Story Video',
                ],
                'tones' => [
                    'Professional',
                    'Casual',
                    'Persuasive',
                    'Friendly',
                    'Educational',
                    'Confident',
                ],
                'variationCounts' => [1, 2, 3],
                'durationPresets' => [15, 30, 45, 60, 90],
                'videoGoals' => ['Awareness', 'Engagement', 'Conversion', 'Education'],
                'videoFormats' => ['Talking Head', 'Storyboard', 'Slideshow', 'UGC Style', 'Voiceover Ad'],
                'ctaStyles' => ['Soft', 'Direct', 'Urgent', 'Consultative'],
                'templates' => array_values($templates),
                'providers' => $this->availableProviders(),
            ],
            'generations' => $generations,
            'selectedGenerationId' => $selectedGenerationId ?: null,
            'selectedGeneration' => $selectedGeneration
                ? $this->transformGeneration($selectedGeneration)
                : null,
            'prefillGeneration' => $prefillGenerationId
                ? optional(
                    $request->user()
                        ->contentGenerations()
                        ->whereKey($prefillGenerationId)
                        ->first(),
                    fn (ContentGeneration $generation) => $this->transformGeneration($generation),
                )
                : null,
            'latestStats' => [
                'total_generations' => $request->user()->contentGenerations()->count(),
                'latest_topic' => $latestGeneration?->topic,
                'latest_created_at' => $latestGeneration?->created_at?->diffForHumans(),
                'favorite_count' => $request->user()->contentGenerations()->whereNotNull('best_variation_index')->count(),
            ],
        ]);
    }

    public function history(Request $request): Response
    {
        $search = trim((string) $request->string('search'));
        $provider = trim((string) $request->string('provider'));
        $favoritesOnly = $request->boolean('favorites');

        $query = $request->user()
            ->contentGenerations()
            ->latest()
            ->search($search);

        if ($provider !== '') {
            $query->where('provider', $provider);
        }

        if ($favoritesOnly) {
            $query->whereNotNull('best_variation_index');
        }

        $generations = $query
            ->paginate(10)
            ->withQueryString()
            ->through(fn (ContentGeneration $generation) => $this->transformGeneration($generation));

        return Inertia::render('ContentGenerator/History', [
            'filters' => [
                'search' => $search,
                'provider' => $provider,
                'favorites' => $favoritesOnly,
            ],
            'generations' => $generations,
            'providers' => $this->availableProviders(),
        ]);
    }

    public function store(StoreContentGenerationRequest $request): RedirectResponse
    {
        try {
            $generation = $this->persistGeneration($request->user(), $request->validated());
        } catch (RuntimeException $exception) {
            return back()
                ->withInput()
                ->withErrors([
                    'generation' => $exception->getMessage(),
                ]);
        }

        return redirect()
            ->route('dashboard', ['generation' => $generation->id])
            ->with('flash.success', "Video plan generated for \"{$generation->topic}\".");
    }

    public function destroy(Request $request, ContentGeneration $contentGeneration): RedirectResponse
    {
        abort_unless($contentGeneration->user_id === $request->user()->id, 403);

        $contentGeneration->delete();

        return back()->with('flash.success', 'Video plan deleted.');
    }

    public function favorite(Request $request, ContentGeneration $contentGeneration): RedirectResponse
    {
        abort_unless($contentGeneration->user_id === $request->user()->id, 403);

        $index = $request->integer('variation_index');
        $variations = collect($contentGeneration->variations ?? []);

        if (! $variations->has($index)) {
            return back()->with('flash.error', 'Selected variation could not be found.');
        }

        $contentGeneration->update([
            'best_variation_index' => $index,
            'generated_content' => $variations->get($index)['script']
                ?? $variations->get($index)['content']
                ?? $contentGeneration->generated_content,
        ]);

        return back()->with('flash.success', 'Best variation updated.');
    }

    public function regenerate(Request $request, ContentGeneration $contentGeneration): RedirectResponse
    {
        abort_unless($contentGeneration->user_id === $request->user()->id, 403);

        try {
            $generation = $this->persistGeneration($request->user(), [
                'video_type' => $contentGeneration->content_type,
                'topic' => $contentGeneration->topic,
                'keywords' => collect($contentGeneration->keywords ?? [])->implode(', '),
                'target_audience' => $contentGeneration->target_audience,
                'tone' => $contentGeneration->tone,
                'template_key' => $contentGeneration->template_key,
                'ui_language' => $contentGeneration->ui_language ?? $request->user()->preferred_output_language ?? 'en',
                'video_goal' => $contentGeneration->content_goal,
                'video_format' => $contentGeneration->output_format,
                'cta_style' => $contentGeneration->cta_style,
                'custom_instruction' => $contentGeneration->custom_instruction,
                'variation_count' => $contentGeneration->variation_count,
                'duration_seconds' => $contentGeneration->duration_seconds ?? $contentGeneration->length_control_value ?? 30,
            ]);
        } catch (RuntimeException $exception) {
            return back()->with('flash.error', $exception->getMessage());
        }

        return redirect()
            ->route('dashboard', ['generation' => $generation->id])
            ->with('flash.success', "Video plan regenerated for \"{$generation->topic}\".");
    }

    public function export(Request $request, ContentGeneration $contentGeneration)
    {
        abort_unless($contentGeneration->user_id === $request->user()->id, 403);

        $variationIndex = max(0, (int) $request->integer('variation', 0));
        $variation = collect($contentGeneration->variations ?? [])->get($variationIndex);
        $exportedContent = $variation['script'] ?? $variation['content'] ?? $contentGeneration->generated_content;
        $variationTitle = $variation['title'] ?? 'Primary Variation';
        $sceneLines = collect($variation['scenes'] ?? [])
            ->map(function (array $scene, int $index) {
                $sceneNumber = $scene['scene_number'] ?? $index + 1;
                $sceneDuration = $scene['duration_seconds'] ?? null;

                return collect([
                    "Scene {$sceneNumber}".($sceneDuration ? " ({$sceneDuration}s)" : ''),
                    'Visual: '.($scene['visual'] ?? '-'),
                    'Voiceover: '.($scene['voiceover'] ?? '-'),
                    'On-screen text: '.($scene['onscreen_text'] ?? '-'),
                    'Transition: '.($scene['transition'] ?? '-'),
                ])->implode(PHP_EOL);
            })
            ->implode(PHP_EOL.PHP_EOL);

        $filename = Str::slug($contentGeneration->topic).'-video-plan.txt';
        $body = collect([
            "Video Type: {$contentGeneration->content_type}",
            "Topic: {$contentGeneration->topic}",
            "Audience: {$contentGeneration->target_audience}",
            "Tone: {$contentGeneration->tone}",
            "Template: ".($contentGeneration->template_key ?: self::DEFAULT_TEMPLATE_KEY),
            "Language: ".($contentGeneration->ui_language ?? 'en'),
            "Goal: ".($contentGeneration->content_goal ?? '-'),
            "Video Format: ".($contentGeneration->output_format ?? '-'),
            "CTA Style: ".($contentGeneration->cta_style ?? '-'),
            'Duration: '.(($variation['estimated_duration_seconds'] ?? $contentGeneration->duration_seconds ?? null) ? (($variation['estimated_duration_seconds'] ?? $contentGeneration->duration_seconds).' seconds') : '-'),
            'Keywords: '.collect($contentGeneration->keywords ?? [])->implode(', '),
            "Variation: {$variationTitle}",
            'Summary: '.($variation['summary'] ?? '-'),
            'Hook: '.($variation['hook'] ?? '-'),
            'CTA: '.($variation['cta'] ?? '-'),
            '',
            'Script:',
            $exportedContent,
            '',
            'Scene Breakdown:',
            $sceneLines !== '' ? $sceneLines : '-',
        ])->implode(PHP_EOL);

        return response()->streamDownload(
            static function () use ($body): void {
                echo $body;
            },
            $filename,
            [
                'Content-Type' => 'text/plain; charset=UTF-8',
            ],
        );
    }

    protected function templates(): array
    {
        return [
            'blank' => [
                'key' => 'blank',
                'name' => 'Blank Brief',
                'name_id' => 'Brief Kosong',
                'description' => 'Start from scratch with your own topic and audience.',
                'description_id' => 'Mulai dari nol dengan topik dan audiensmu sendiri.',
                'video_type' => 'Marketing Video',
                'topic' => '',
                'topic_id' => '',
                'keywords' => '',
                'keywords_id' => '',
                'target_audience' => '',
                'target_audience_id' => '',
                'tone' => 'Professional',
                'duration_seconds' => 30,
                'instruction' => '',
                'instruction_id' => '',
            ],
            'product-launch-video' => [
                'key' => 'product-launch-video',
                'name' => 'Product Launch Video',
                'name_id' => 'Video Peluncuran Produk',
                'description' => 'Pitch a new product or feature with a clear visual flow and CTA.',
                'description_id' => 'Promosikan produk atau fitur baru dengan alur visual dan CTA yang jelas.',
                'video_type' => 'Marketing Video',
                'topic' => 'Launch video for a new productivity app feature',
                'topic_id' => 'Video peluncuran untuk fitur baru aplikasi produktivitas',
                'keywords' => 'launch, productivity, app, new feature',
                'keywords_id' => 'peluncuran, produktivitas, aplikasi, fitur baru',
                'target_audience' => 'Busy professionals and startup teams',
                'target_audience_id' => 'Profesional sibuk dan tim startup',
                'tone' => 'Persuasive',
                'duration_seconds' => 30,
                'instruction' => 'Create a short launch video script with a strong hook, scene-by-scene benefits, clear visuals, and a direct CTA.',
                'instruction_id' => 'Buat skrip video peluncuran singkat dengan hook kuat, manfaat per adegan, visual yang jelas, dan CTA langsung.',
            ],
            'social-media-reel' => [
                'key' => 'social-media-reel',
                'name' => 'Social Media Reel',
                'name_id' => 'Reel Media Sosial',
                'description' => 'Build a short, hook-driven social reel with fast scenes.',
                'description_id' => 'Buat reel sosial singkat dengan hook kuat dan adegan cepat.',
                'video_type' => 'Social Media Reel',
                'topic' => 'Weekend sale promotion for an online store',
                'topic_id' => 'Promosi diskon akhir pekan untuk toko online',
                'keywords' => 'weekend sale, promo, limited time',
                'keywords_id' => 'diskon akhir pekan, promo, waktu terbatas',
                'target_audience' => 'Online shoppers aged 18-30',
                'target_audience_id' => 'Pembeli online usia 18-30 tahun',
                'tone' => 'Friendly',
                'duration_seconds' => 15,
                'instruction' => 'Create a fast-paced reel concept with quick visual cuts, punchy on-screen text, and a strong promotional CTA.',
                'instruction_id' => 'Buat konsep reel yang cepat dengan potongan visual singkat, teks layar yang punchy, dan CTA promosi yang kuat.',
            ],
            'educational-clip' => [
                'key' => 'educational-clip',
                'name' => 'Educational Clip',
                'name_id' => 'Klip Edukasi',
                'description' => 'Explain a topic clearly with structured learning scenes.',
                'description_id' => 'Jelaskan topik dengan jelas melalui adegan pembelajaran yang terstruktur.',
                'video_type' => 'Educational Clip',
                'topic' => 'How AI tools improve team productivity',
                'topic_id' => 'Cara alat AI meningkatkan produktivitas tim',
                'keywords' => 'AI productivity, workflow, automation',
                'keywords_id' => 'produktivitas AI, alur kerja, otomatisasi',
                'target_audience' => 'Startup teams and business owners',
                'target_audience_id' => 'Tim startup dan pemilik bisnis',
                'tone' => 'Educational',
                'duration_seconds' => 60,
                'instruction' => 'Create an educational clip with a clear intro, structured teaching scenes, and a concise takeaway at the end.',
                'instruction_id' => 'Buat klip edukasi dengan pembuka yang jelas, adegan pembelajaran terstruktur, dan penutup ringkas di akhir.',
            ],
            'product-explainer' => [
                'key' => 'product-explainer',
                'name' => 'Product Explainer',
                'name_id' => 'Video Penjelasan Produk',
                'description' => 'Show product benefits scene by scene in a short explainer format.',
                'description_id' => 'Tampilkan manfaat produk per adegan dalam format explainer singkat.',
                'video_type' => 'Product Explainer',
                'topic' => 'Wireless noise-cancelling headphones',
                'topic_id' => 'Headphone nirkabel dengan peredam bising',
                'keywords' => 'wireless, battery life, immersive sound',
                'keywords_id' => 'nirkabel, daya tahan baterai, suara imersif',
                'target_audience' => 'Busy professionals and music lovers',
                'target_audience_id' => 'Profesional sibuk dan pecinta musik',
                'tone' => 'Confident',
                'duration_seconds' => 45,
                'instruction' => 'Create a product explainer with strong benefit-led scenes, clear visuals, a persuasive script, and a clean CTA.',
                'instruction_id' => 'Buat video penjelasan produk dengan adegan berbasis manfaat, visual yang jelas, skrip persuasif, dan CTA yang rapi.',
            ],
        ];
    }

    protected function resolveTemplate(?string $key): array
    {
        $templates = $this->templates();
        $resolvedKey = filled($key) ? $key : self::DEFAULT_TEMPLATE_KEY;

        return $templates[$resolvedKey] ?? $templates[self::DEFAULT_TEMPLATE_KEY];
    }

    protected function localizedTemplateValue(array $template, string $field, string $uiLanguage): string
    {
        if ($uiLanguage === 'id') {
            return (string) ($template[$field.'_id'] ?? $template[$field] ?? '');
        }

        return (string) ($template[$field] ?? '');
    }

    protected function availableProviders(): array
    {
        return collect([
            config('services.ai_content.provider'),
            config('services.ai_content_fallback.provider'),
        ])->filter()->unique()->values()->all();
    }

    protected function transformGeneration(ContentGeneration $generation): array
    {
        return [
            'id' => $generation->id,
            'video_type' => $generation->content_type,
            'topic' => $generation->topic,
            'keywords' => $generation->keywords ?? [],
            'target_audience' => $generation->target_audience,
            'tone' => $generation->tone,
            'template_key' => $generation->template_key ?? self::DEFAULT_TEMPLATE_KEY,
            'ui_language' => $generation->ui_language ?? 'en',
            'video_goal' => $generation->content_goal,
            'video_format' => $generation->output_format,
            'cta_style' => $generation->cta_style,
            'custom_instruction' => $generation->custom_instruction,
            'duration_seconds' => $generation->duration_seconds ?? 30,
            'variation_count' => $generation->variation_count,
            'best_variation_index' => $generation->best_variation_index,
            'variations' => $generation->variations ?? [],
            'generated_content' => $generation->generated_content,
            'prompt' => $generation->prompt,
            'provider' => $generation->provider,
            'model' => $generation->model,
            'generation_duration_ms' => $generation->generation_duration_ms,
            'created_at' => $generation->created_at?->toIso8601String(),
            'created_at_human' => $generation->created_at?->diffForHumans(),
        ];
    }

    protected function persistGeneration($user, array $validated): ContentGeneration
    {
        $uiLanguage = $validated['ui_language'] ?? $user->preferred_output_language ?? 'en';
        $template = $this->resolveTemplate($validated['template_key'] ?? null);
        $keywordArray = collect(explode(',', (string) ($validated['keywords'] ?? '')))
            ->map(fn (string $keyword) => trim($keyword))
            ->filter()
            ->values()
            ->all();

        $result = $this->generator->generate([
            ...$validated,
            'keywords' => $keywordArray,
            'preferred_ai_provider' => $user->preferred_ai_provider,
            'template_key' => $template['key'],
            'template_name' => $this->localizedTemplateValue($template, 'name', $uiLanguage),
            'template_instruction' => $this->localizedTemplateValue($template, 'instruction', $uiLanguage),
            'ui_language' => $uiLanguage,
            'duration_seconds' => (int) ($validated['duration_seconds'] ?? $template['duration_seconds'] ?? 30),
        ]);

        return $user->contentGenerations()->create([
            'keywords' => $keywordArray,
            'content_type' => $validated['video_type'],
            'topic' => $validated['topic'],
            'target_audience' => $validated['target_audience'],
            'tone' => $validated['tone'],
            'template_key' => $template['key'],
            'ui_language' => $uiLanguage,
            'content_goal' => $validated['video_goal'] ?? null,
            'output_format' => $validated['video_format'] ?? null,
            'cta_style' => $validated['cta_style'] ?? null,
            'custom_instruction' => $validated['custom_instruction'] ?? null,
            'duration_seconds' => (int) ($validated['duration_seconds'] ?? $template['duration_seconds'] ?? 30),
            'length_control_type' => 'seconds',
            'length_control_value' => (int) ($validated['duration_seconds'] ?? $template['duration_seconds'] ?? 30),
            'prompt' => $result['prompt'],
            'generated_content' => $result['generated_content'],
            'variation_count' => $validated['variation_count'],
            'best_variation_index' => null,
            'variations' => $result['variations'],
            'provider' => $result['provider'],
            'model' => $result['model'],
            'generation_duration_ms' => $result['generation_duration_ms'] ?? null,
        ]);
    }
}
