<?php

use App\Http\Controllers\AiPreferencesController;
use App\Http\Controllers\ContentGenerationController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [ContentGenerationController::class, 'index'])->name('dashboard');
    Route::get('/history', [ContentGenerationController::class, 'history'])->name('history.index');
    Route::post('/generations', [ContentGenerationController::class, 'store'])->middleware('throttle:8,1')->name('generations.store');
    Route::post('/generations/{contentGeneration}/favorite', [ContentGenerationController::class, 'favorite'])->name('generations.favorite');
    Route::post('/generations/{contentGeneration}/regenerate', [ContentGenerationController::class, 'regenerate'])->middleware('throttle:8,1')->name('generations.regenerate');
    Route::delete('/generations/{contentGeneration}', [ContentGenerationController::class, 'destroy'])->name('generations.destroy');
    Route::get('/generations/{contentGeneration}/export', [ContentGenerationController::class, 'export'])->name('generations.export');
    Route::get('/settings/ai', [AiPreferencesController::class, 'edit'])->name('settings.ai.edit');
    Route::patch('/settings/ai', [AiPreferencesController::class, 'update'])->name('settings.ai.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
