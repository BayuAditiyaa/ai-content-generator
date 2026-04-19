<?php

namespace Tests;

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\File;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $compiledPath = storage_path('framework/views/testing/'.md5(static::class.'::'.$this->name()));

        if (! File::exists($compiledPath)) {
            File::makeDirectory($compiledPath, 0755, true);
        }

        config(['view.compiled' => $compiledPath]);
        $inertiaVersion = app(HandleInertiaRequests::class)->version(request());

        $this->withHeaders([
            'X-Inertia' => 'true',
            'X-Requested-With' => 'XMLHttpRequest',
            'X-Inertia-Version' => (string) $inertiaVersion,
        ]);
    }
}
