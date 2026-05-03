<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TurnstileService
{
    public function verify(?string $token, ?string $remoteIp = null): bool
    {
        if (! config('services.turnstile.enabled')) {
            return true;
        }

        $secret = config('services.turnstile.secret_key');

        if (! filled($secret) || ! filled($token)) {
            return false;
        }

        try {
            $response = Http::asForm()
                ->timeout(8)
                ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $secret,
                    'response' => $token,
                    'remoteip' => $remoteIp,
                ])
                ->json();
        } catch (\Throwable $exception) {
            Log::warning('Turnstile validation request failed.', [
                'message' => $exception->getMessage(),
            ]);

            return false;
        }

        if ((bool) ($response['success'] ?? false)) {
            return true;
        }

        Log::notice('Turnstile validation rejected a registration attempt.', [
            'error_codes' => $response['error-codes'] ?? [],
        ]);

        return false;
    }
}
