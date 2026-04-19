<?php

namespace Tests\Unit;

use App\Services\AiContentGeneratorService;
use Tests\TestCase;

class AiContentGeneratorServiceTest extends TestCase
{
    public function test_it_extracts_variations_from_json_like_text_with_multiline_content(): void
    {
        $service = new class extends AiContentGeneratorService
        {
            public function extractForTest(string $rawText, int $expectedCount, string $uiLanguage = 'en'): array
            {
                return $this->extractVariations($rawText, $expectedCount, $uiLanguage);
            }
        };

        $rawText = <<<'JSON'
{
  "variations": [
    {
      "title": "Tuner Suara yang Mendalam",
      "content": "Produk headphone nirkabel kami dirancang untuk memenuhi kebutuhan musisi dan profesional yang sibuk.

Dengan peredam bising canggih, Anda dapat menikmati suara imersif yang mendalam."
    },
    {
      "title": "Suara yang Jernih dan Nyaman",
      "content": "Jika Anda mencari headphone nirkabel yang dapat memenuhi kebutuhan Anda, maka Anda berada di tempat yang tepat."
    }
  ]
}
JSON;

        $variations = $service->extractForTest($rawText, 2, 'id');

        $this->assertCount(2, $variations);
        $this->assertSame('Tuner Suara yang Mendalam', $variations[0]['title']);
        $this->assertStringContainsString('Produk headphone nirkabel kami dirancang', $variations[0]['content']);
        $this->assertSame('Suara yang Jernih dan Nyaman', $variations[1]['title']);
    }
}
