<?php

namespace Tests\Feature\Auth;

use App\Services\TurnstileService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_new_users_can_register_when_turnstile_token_is_valid(): void
    {
        config([
            'services.turnstile.enabled' => true,
            'services.turnstile.site_key' => 'site-key',
            'services.turnstile.secret_key' => 'secret-key',
        ]);

        $this->mock(TurnstileService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('verify')
                ->once()
                ->with('valid-token', '127.0.0.1')
                ->andReturnTrue();
        });

        $response = $this->post('/register', [
            'name' => 'Verified User',
            'email' => 'verified@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'turnstile_token' => 'valid-token',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }
}
