<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class AiContentGeneratorService
{
    public function generate(array $payload): array
    {
        $prompt = $this->buildPrompt($payload);
        $lastException = null;
        $startedAt = microtime(true);

        foreach ($this->resolveProviderConfigs($payload['preferred_ai_provider'] ?? null) as $config) {
            try {
                $response = $this->sendRequest($config, $prompt)->throw()->json();
                $rawText = trim((string) ($this->extractText($response, $config['api_style'])));

                if ($rawText === '') {
                    throw new RuntimeException("{$config['provider']} responded, but no content was returned.");
                }

                $variations = $this->extractVariations(
                    $rawText,
                    (int) ($payload['variation_count'] ?? 1),
                    $payload['ui_language'] ?? 'en',
                );
                $primaryVariation = $variations[0]['script'] ?? $variations[0]['content'] ?? '';

                return [
                    'prompt' => $prompt,
                    'generated_content' => $primaryVariation,
                    'variations' => $variations,
                    'provider' => $config['provider'],
                    'model' => $config['model'],
                    'generation_duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                ];
            } catch (ConnectionException $exception) {
                $lastException = new RuntimeException(
                    "Unable to reach {$config['provider']}.",
                    previous: $exception,
                );
                $this->logProviderFailure($config['provider'], $prompt, $exception);
            } catch (RequestException $exception) {
                $lastException = new RuntimeException(
                    $this->buildApiErrorMessage($config['provider'], $exception),
                    previous: $exception,
                );
                $this->logProviderFailure($config['provider'], $prompt, $exception);
            } catch (Throwable $exception) {
                $lastException = $exception instanceof RuntimeException
                    ? $exception
                    : new RuntimeException(
                        "{$config['provider']} returned an unexpected error.",
                        previous: $exception,
                    );
                $this->logProviderFailure($config['provider'], $prompt, $exception);
            }
        }

        throw new RuntimeException(
            'All configured AI providers failed. Check Gemini first, then confirm the Groq fallback is configured correctly.',
            previous: $lastException,
        );
    }

    public function buildPrompt(array $payload): string
    {
        $keywords = collect($payload['keywords'] ?? [])
            ->filter()
            ->implode(', ');

        $variationCount = max(1, min(3, (int) ($payload['variation_count'] ?? 1)));
        $durationSeconds = max(15, min(180, (int) ($payload['duration_seconds'] ?? 30)));
        $templateInstruction = trim((string) ($payload['template_instruction'] ?? ''));
        $templateName = trim((string) ($payload['template_name'] ?? ''));
        $uiLanguage = ($payload['ui_language'] ?? 'en') === 'id' ? 'id' : 'en';
        $languageInstruction = $uiLanguage === 'id'
            ? 'Write the output in natural Bahasa Indonesia unless the brief clearly requests another language.'
            : 'Write the output in natural English unless the brief clearly requests another language.';
        $titleInstruction = $uiLanguage === 'id'
            ? 'Write every variation title in concise natural Bahasa Indonesia.'
            : 'Write every variation title in concise natural English.';
        $templateSection = $templateInstruction !== ''
            ? "- Template: {$templateName}\n- Template guidance: {$templateInstruction}\n"
            : '';
        $goal = trim((string) ($payload['video_goal'] ?? ''));
        $outputFormat = trim((string) ($payload['video_format'] ?? ''));
        $ctaStyle = trim((string) ($payload['cta_style'] ?? ''));
        $customInstruction = trim((string) ($payload['custom_instruction'] ?? ''));
        $strategySection = collect([
            $goal !== '' ? "- Video goal: {$goal}" : null,
            $outputFormat !== '' ? "- Video format: {$outputFormat}" : null,
            $ctaStyle !== '' ? "- CTA style: {$ctaStyle}" : null,
            $customInstruction !== '' ? "- Additional instruction: {$customInstruction}" : null,
        ])->filter()->implode("\n");
        $strategyBlock = $strategySection !== '' ? $strategySection."\n" : '';

        return <<<PROMPT
You are an expert video strategist and storyboard writer.

Write {$variationCount} distinct polished video concept variation(s) using the following brief:
- Video type: {$payload['video_type']}
- Topic: {$payload['topic']}
- Keywords to include: {$keywords}
- Target audience: {$payload['target_audience']}
- Tone: {$payload['tone']}
{$templateSection}- Preferred duration: approximately {$durationSeconds} seconds per variation
{$strategyBlock}

Requirements:
- Keep the concept clear, useful, and natural.
- Match the requested tone consistently.
- {$languageInstruction}
- {$titleInstruction}
- Design each variation like a short video plan with a compelling hook, script, and scene breakdown.
- Include the listed keywords naturally, without keyword stuffing.
- Stay reasonably close to the requested duration for each variation.
- Do not mention that you are an AI.
- Return valid JSON only with this shape:
{
  "variations": [
    {
      "title": "Short descriptive title",
      "summary": "One sentence video concept summary",
      "hook": "Opening hook line",
      "estimated_duration_seconds": 30,
      "script": "Full narration or spoken script",
      "cta": "Closing call to action",
      "scenes": [
        {
          "scene_number": 1,
          "duration_seconds": 5,
          "visual": "What appears on screen",
          "voiceover": "Narration or spoken text",
          "onscreen_text": "Text overlay shown in the scene",
          "transition": "Cut / Fade / Zoom"
        }
      ]
    }
  ]
}
PROMPT;
    }

    protected function extractOutputText(array $response): string
    {
        $texts = collect(Arr::get($response, 'output', []))
            ->flatMap(fn (array $item) => Arr::get($item, 'content', []))
            ->pluck('text')
            ->filter()
            ->implode("\n\n");

        return $texts;
    }

    protected function sendRequest(array $config, string $prompt)
    {
        $client = Http::withToken($config['api_key'])
            ->acceptJson()
            ->timeout(60);

        $baseUrl = rtrim($config['base_url'], '/');

        if ($config['api_style'] === 'chat_completions') {
            return $client->post($baseUrl.'/chat/completions', [
                'model' => $config['model'],
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert video strategist and storyboard writer who always follows the requested JSON output shape exactly.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.9,
            ]);
        }

        return $client->post($baseUrl.'/responses', [
            'model' => $config['model'],
            'input' => $prompt,
        ]);
    }

    protected function extractText(array $response, string $apiStyle): string
    {
        if ($apiStyle === 'chat_completions') {
            return (string) Arr::get($response, 'choices.0.message.content', '');
        }

        return (string) ($response['output_text'] ?? $this->extractOutputText($response));
    }

    protected function extractVariations(string $rawText, int $expectedCount, string $uiLanguage = 'en'): array
    {
        $normalizedText = $this->normalizeJsonPayload($rawText);
        $decoded = json_decode($normalizedText, true);
        $fallbackTitle = $uiLanguage === 'id' ? 'Variasi 1' : 'Variation 1';

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $variations = $this->mapVariations(
                Arr::get($decoded, 'variations', []),
                $fallbackTitle,
                $expectedCount,
            );

            if ($variations !== []) {
                return $variations;
            }
        }

        $regexVariations = $this->extractVariationsWithRegex(
            $normalizedText,
            $fallbackTitle,
            $expectedCount,
        );

        if ($regexVariations !== []) {
            return $regexVariations;
        }

        return [[
            'title' => $fallbackTitle,
            'summary' => '',
            'hook' => '',
            'estimated_duration_seconds' => 0,
            'script' => trim($normalizedText),
            'cta' => '',
            'scenes' => [],
            'content' => trim($normalizedText),
        ]];
    }

    protected function normalizeJsonPayload(string $rawText): string
    {
        $trimmed = trim($rawText);

        if (str_starts_with($trimmed, '```')) {
            $trimmed = preg_replace('/^```[a-zA-Z0-9_-]*\s*/', '', $trimmed) ?? $trimmed;
            $trimmed = preg_replace('/\s*```$/', '', $trimmed) ?? $trimmed;
        }

        return trim($trimmed);
    }

    protected function mapVariations(array $items, string $fallbackTitle, int $expectedCount): array
    {
        return collect($items)
            ->filter(fn ($item) => is_array($item) && (filled($item['script'] ?? null) || filled($item['content'] ?? null)))
            ->map(function (array $item, int $index) use ($fallbackTitle) {
                $script = trim((string) ($item['script'] ?? $item['content'] ?? ''));

                return [
                    'title' => trim((string) ($item['title'] ?? str_replace('1', (string) ($index + 1), $fallbackTitle))),
                    'summary' => trim((string) ($item['summary'] ?? '')),
                    'hook' => trim((string) ($item['hook'] ?? '')),
                    'estimated_duration_seconds' => max(0, (int) ($item['estimated_duration_seconds'] ?? 0)),
                    'script' => $script,
                    'cta' => trim((string) ($item['cta'] ?? '')),
                    'scenes' => $this->normalizeScenes($item['scenes'] ?? []),
                    'content' => $script,
                ];
            })
            ->values()
            ->take($expectedCount)
            ->all();
    }

    protected function extractVariationsWithRegex(string $rawText, string $fallbackTitle, int $expectedCount): array
    {
        preg_match_all(
            '/"title"\s*:\s*"((?:\\\\.|[^"\\\\])*)".*?"(?:script|content)"\s*:\s*"((?:\\\\.|[^"\\\\])*)"/su',
            $rawText,
            $matches,
            PREG_SET_ORDER,
        );

        if ($matches === []) {
            return [];
        }

        return collect($matches)
            ->map(function (array $match, int $index) use ($fallbackTitle) {
                $script = $this->decodeLooseJsonString($match[2], '');

                return [
                    'title' => $this->decodeLooseJsonString($match[1], str_replace('1', (string) ($index + 1), $fallbackTitle)),
                    'summary' => '',
                    'hook' => '',
                    'estimated_duration_seconds' => 0,
                    'script' => $script,
                    'cta' => '',
                    'scenes' => [],
                    'content' => $script,
                ];
            })
            ->filter(fn (array $item) => filled($item['script']))
            ->values()
            ->take($expectedCount)
            ->all();
    }

    protected function normalizeScenes(mixed $scenes): array
    {
        if (! is_array($scenes)) {
            return [];
        }

        return collect($scenes)
            ->filter(fn ($scene) => is_array($scene))
            ->map(function (array $scene, int $index) {
                return [
                    'scene_number' => max(1, (int) ($scene['scene_number'] ?? $index + 1)),
                    'duration_seconds' => max(0, (int) ($scene['duration_seconds'] ?? 0)),
                    'visual' => trim((string) ($scene['visual'] ?? '')),
                    'voiceover' => trim((string) ($scene['voiceover'] ?? '')),
                    'onscreen_text' => trim((string) ($scene['onscreen_text'] ?? '')),
                    'transition' => trim((string) ($scene['transition'] ?? '')),
                ];
            })
            ->values()
            ->all();
    }

    protected function decodeLooseJsonString(string $value, string $fallback = ''): string
    {
        $decoded = json_decode('"'.addcslashes($value, "\"\\").'"');

        if (is_string($decoded) && $decoded !== '') {
            return trim($decoded);
        }

        $normalized = str_replace(['\\"', '\\n', '\\r', '\\t', '\\/'], ['"', "\n", "\r", "\t", '/'], $value);

        return trim($normalized) !== '' ? trim($normalized) : $fallback;
    }

    protected function resolveProviderConfigs(?string $preferredProvider = null): array
    {
        $primary = config('services.ai_content');
        $fallback = config('services.ai_content_fallback');
        $configs = [];

        if (filled($primary['api_key'] ?? null)) {
            $configs[] = $primary;
        }

        if (($fallback['enabled'] ?? false) && filled($fallback['api_key'] ?? null)) {
            $configs[] = $fallback;
        }

        if ($configs === []) {
            throw new RuntimeException(
                'No AI provider is configured. Add AI_CONTENT_API_KEY or enable Groq fallback with AI_CONTENT_FALLBACK_API_KEY.',
            );
        }

        if ($preferredProvider && collect($configs)->contains(fn ($config) => $config['provider'] === $preferredProvider)) {
            usort($configs, fn (array $left, array $right) => ($left['provider'] === $preferredProvider ? -1 : 1));
        }

        return $configs;
    }

    protected function buildApiErrorMessage(string $provider, RequestException $exception): string
    {
        $message = "{$provider} returned an API error.";
        $responseBody = $exception->response?->json();

        $apiMessage = Arr::get($responseBody, 'error.message')
            ?? Arr::get($responseBody, 'message')
            ?? Arr::get($responseBody, 'error');

        if (is_string($apiMessage) && $apiMessage !== '') {
            return "{$provider} returned an API error: {$apiMessage}";
        }

        return $message;
    }

    protected function logProviderFailure(string $provider, string $prompt, Throwable $exception): void
    {
        Log::warning('AI provider generation failed.', [
            'provider' => $provider,
            'message' => $exception->getMessage(),
            'prompt_length' => mb_strlen($prompt),
        ]);
    }
}
