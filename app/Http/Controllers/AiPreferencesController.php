<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAiPreferencesRequest;
use Inertia\Inertia;
use Inertia\Response;

class AiPreferencesController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Settings/AiPreferences', [
            'preferences' => [
                'preferred_ai_provider' => auth()->user()->preferred_ai_provider,
                'preferred_output_language' => auth()->user()->preferred_output_language ?? 'en',
            ],
            'providers' => collect([
                config('services.ai_content.provider'),
                config('services.ai_content_fallback.provider'),
            ])->filter()->unique()->values()->all(),
        ]);
    }

    public function update(UpdateAiPreferencesRequest $request)
    {
        $request->user()->update($request->validated());

        return back()->with('flash.success', 'AI preferences updated.');
    }
}
