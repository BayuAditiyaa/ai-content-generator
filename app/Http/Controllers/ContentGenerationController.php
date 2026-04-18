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
                'contentTypes' => [
                    'Blog Post',
                    'Email',
                    'Ad Copy',
                    'Social Media Post',
                    'Product Description',
                    'Educational Content',
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
                'lengthControlTypes' => ['words', 'characters'],
                'lengthControlPresets' => [100, 150, 250, 500, 1000],
                'contentGoals' => ['Awareness', 'Engagement', 'Conversion', 'Education'],
                'outputFormats' => ['Paragraph', 'Bullet Points', 'Headline + Body', 'AIDA', 'PAS'],
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
            ->with('flash.success', "Content generated for \"{$generation->topic}\".");
    }

    public function destroy(Request $request, ContentGeneration $contentGeneration): RedirectResponse
    {
        abort_unless($contentGeneration->user_id === $request->user()->id, 403);

        $contentGeneration->delete();

        return back()->with('flash.success', 'Generation deleted.');
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
            'generated_content' => $variations->get($index)['content'] ?? $contentGeneration->generated_content,
        ]);

        return back()->with('flash.success', 'Favorite variation updated.');
    }

    public function regenerate(Request $request, ContentGeneration $contentGeneration): RedirectResponse
    {
        abort_unless($contentGeneration->user_id === $request->user()->id, 403);

        try {
            $generation = $this->persistGeneration($request->user(), [
                'content_type' => $contentGeneration->content_type,
                'topic' => $contentGeneration->topic,
                'keywords' => collect($contentGeneration->keywords ?? [])->implode(', '),
                'target_audience' => $contentGeneration->target_audience,
                'tone' => $contentGeneration->tone,
                'template_key' => $contentGeneration->template_key,
                'ui_language' => $contentGeneration->ui_language ?? $request->user()->preferred_output_language ?? 'en',
                'content_goal' => $contentGeneration->content_goal,
                'output_format' => $contentGeneration->output_format,
                'cta_style' => $contentGeneration->cta_style,
                'custom_instruction' => $contentGeneration->custom_instruction,
                'variation_count' => $contentGeneration->variation_count,
                'length_control_type' => $contentGeneration->length_control_type,
                'length_control_value' => $contentGeneration->length_control_value,
            ]);
        } catch (RuntimeException $exception) {
            return back()->with('flash.error', $exception->getMessage());
        }

        return redirect()
            ->route('dashboard', ['generation' => $generation->id])
            ->with('flash.success', "Content regenerated for \"{$generation->topic}\".");
    }

    public function export(Request $request, ContentGeneration $contentGeneration)
    {
        abort_unless($contentGeneration->user_id === $request->user()->id, 403);

        $variationIndex = max(0, (int) $request->integer('variation', 0));
        $variation = collect($contentGeneration->variations ?? [])->get($variationIndex);
        $exportedContent = $variation['content'] ?? $contentGeneration->generated_content;
        $variationTitle = $variation['title'] ?? 'Primary Variation';

        $filename = Str::slug($contentGeneration->topic).'-content.txt';
        $body = collect([
            "Content Type: {$contentGeneration->content_type}",
            "Topic: {$contentGeneration->topic}",
            "Audience: {$contentGeneration->target_audience}",
            "Tone: {$contentGeneration->tone}",
            "Template: ".($contentGeneration->template_key ?: self::DEFAULT_TEMPLATE_KEY),
            "Language: ".($contentGeneration->ui_language ?? 'en'),
            "Goal: ".($contentGeneration->content_goal ?? '-'),
            "Output Format: ".($contentGeneration->output_format ?? '-'),
            "CTA Style: ".($contentGeneration->cta_style ?? '-'),
            "Length Target: {$contentGeneration->length_control_value} {$contentGeneration->length_control_type}",
            'Keywords: '.collect($contentGeneration->keywords ?? [])->implode(', '),
            "Variation: {$variationTitle}",
            '',
            $exportedContent,
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
                'content_type' => 'Blog Post',
                'topic' => '',
                'topic_id' => '',
                'keywords' => '',
                'keywords_id' => '',
                'target_audience' => '',
                'target_audience_id' => '',
                'tone' => 'Professional',
                'instruction' => '',
                'instruction_id' => '',
            ],
            'product-launch-email' => [
                'key' => 'product-launch-email',
                'name' => 'Product Launch Email',
                'name_id' => 'Email Peluncuran Produk',
                'description' => 'Announce a new product or feature with a clear CTA.',
                'description_id' => 'Umumkan produk atau fitur baru dengan CTA yang jelas.',
                'content_type' => 'Email',
                'topic' => 'Launch announcement for a new product feature',
                'topic_id' => 'Pengumuman peluncuran untuk fitur produk baru',
                'keywords' => 'launch, new feature, early access',
                'keywords_id' => 'peluncuran, fitur baru, akses awal',
                'target_audience' => 'Existing users and trial users',
                'target_audience_id' => 'Pengguna lama dan pengguna trial',
                'tone' => 'Persuasive',
                'instruction' => 'Structure the content like a launch email with a strong opening hook, benefit-focused body, and a clear call to action.',
                'instruction_id' => 'Susun konten seperti email peluncuran dengan hook pembuka yang kuat, isi yang menonjolkan manfaat, dan call to action yang jelas.',
            ],
            'instagram-promo' => [
                'key' => 'instagram-promo',
                'name' => 'Instagram Promo Caption',
                'name_id' => 'Caption Promo Instagram',
                'description' => 'Create short social captions for promotions or campaigns.',
                'description_id' => 'Buat caption sosial singkat untuk promosi atau campaign.',
                'content_type' => 'Social Media Post',
                'topic' => 'Weekend promo campaign for an online store',
                'topic_id' => 'Kampanye promo akhir pekan untuk toko online',
                'keywords' => 'promo, limited time, weekend sale',
                'keywords_id' => 'promo, waktu terbatas, diskon akhir pekan',
                'target_audience' => 'Online shoppers aged 18-30',
                'target_audience_id' => 'Pembeli online usia 18-30 tahun',
                'tone' => 'Friendly',
                'instruction' => 'Write like a high-performing social caption with an attention-grabbing first line, concise benefit, and a direct promotional CTA.',
                'instruction_id' => 'Tulis seperti caption sosial yang efektif dengan baris pembuka yang menarik perhatian, manfaat yang ringkas, dan CTA promosi yang langsung.',
            ],
            'seo-blog-outline' => [
                'key' => 'seo-blog-outline',
                'name' => 'SEO Blog Draft',
                'name_id' => 'Draft Blog SEO',
                'description' => 'Generate a readable blog-style draft around search keywords.',
                'description_id' => 'Hasilkan draft bergaya blog yang mudah dibaca berdasarkan keyword pencarian.',
                'content_type' => 'Blog Post',
                'topic' => 'How to improve team productivity with AI tools',
                'topic_id' => 'Cara meningkatkan produktivitas tim dengan alat AI',
                'keywords' => 'AI productivity, team workflow, automation',
                'keywords_id' => 'produktivitas AI, alur kerja tim, otomatisasi',
                'target_audience' => 'Startup teams and business owners',
                'target_audience_id' => 'Tim startup dan pemilik bisnis',
                'tone' => 'Educational',
                'instruction' => 'Use a blog-friendly structure with a compelling introduction, informative sub-sections, and a concise closing takeaway.',
                'instruction_id' => 'Gunakan struktur blog yang ramah dibaca dengan pembuka yang menarik, subbagian informatif, dan penutup yang singkat namun kuat.',
            ],
            'product-description' => [
                'key' => 'product-description',
                'name' => 'Product Description',
                'name_id' => 'Deskripsi Produk',
                'description' => 'Write benefit-led ecommerce copy for a product page.',
                'description_id' => 'Tulis copy ecommerce berbasis manfaat untuk halaman produk.',
                'content_type' => 'Product Description',
                'topic' => 'Wireless noise-cancelling headphones',
                'topic_id' => 'Headphone nirkabel dengan peredam bising',
                'keywords' => 'wireless, battery life, immersive sound',
                'keywords_id' => 'nirkabel, daya tahan baterai, suara imersif',
                'target_audience' => 'Busy professionals and music lovers',
                'target_audience_id' => 'Profesional sibuk dan pecinta musik',
                'tone' => 'Confident',
                'instruction' => 'Emphasize benefits first, keep the copy easy to scan, and highlight the strongest selling points naturally.',
                'instruction_id' => 'Utamakan manfaat, buat copy mudah dipindai, dan tonjolkan nilai jual terkuat secara natural.',
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
            'content_type' => $generation->content_type,
            'topic' => $generation->topic,
            'keywords' => $generation->keywords ?? [],
            'target_audience' => $generation->target_audience,
            'tone' => $generation->tone,
            'template_key' => $generation->template_key ?? self::DEFAULT_TEMPLATE_KEY,
            'ui_language' => $generation->ui_language ?? 'en',
            'content_goal' => $generation->content_goal,
            'output_format' => $generation->output_format,
            'cta_style' => $generation->cta_style,
            'custom_instruction' => $generation->custom_instruction,
            'length_control_type' => $generation->length_control_type ?? 'words',
            'length_control_value' => $generation->length_control_value ?? 250,
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
        ]);

        return $user->contentGenerations()->create([
            ...$validated,
            'keywords' => $keywordArray,
            'template_key' => $template['key'],
            'ui_language' => $uiLanguage,
            'content_goal' => $validated['content_goal'] ?? null,
            'output_format' => $validated['output_format'] ?? null,
            'cta_style' => $validated['cta_style'] ?? null,
            'custom_instruction' => $validated['custom_instruction'] ?? null,
            'length_control_type' => $validated['length_control_type'],
            'length_control_value' => $validated['length_control_value'],
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
