<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'preferences' => [
                'preferred_ai_provider' => $request->user()?->preferred_ai_provider,
                'preferred_output_language' => $request->user()?->preferred_output_language ?? 'en',
            ],
            'flash' => [
                'success' => $request->session()->get('flash.success'),
                'error' => $request->session()->get('flash.error'),
            ],
            'ai' => [
                'provider' => config('services.ai_content.provider'),
                'model' => config('services.ai_content.model'),
                'api_style' => config('services.ai_content.api_style'),
                'configured' => filled(config('services.ai_content.api_key')),
                'fallback_enabled' => (bool) config('services.ai_content_fallback.enabled'),
                'fallback_provider' => config('services.ai_content_fallback.provider'),
                'fallback_model' => config('services.ai_content_fallback.model'),
                'fallback_configured' => filled(config('services.ai_content_fallback.api_key')),
                'available_providers' => collect([
                    config('services.ai_content.provider'),
                    config('services.ai_content_fallback.provider'),
                ])->filter()->unique()->values()->all(),
            ],
        ];
    }
}
