<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_generations', function (Blueprint $table) {
            $table->string('ui_language', 5)->default('en')->after('template_key');
            $table->string('content_goal')->nullable()->after('tone');
            $table->string('output_format')->nullable()->after('content_goal');
            $table->string('cta_style')->nullable()->after('output_format');
            $table->text('custom_instruction')->nullable()->after('cta_style');
            $table->unsignedTinyInteger('best_variation_index')->nullable()->after('variation_count');
            $table->unsignedInteger('generation_duration_ms')->nullable()->after('model');
        });
    }

    public function down(): void
    {
        Schema::table('content_generations', function (Blueprint $table) {
            $table->dropColumn([
                'ui_language',
                'content_goal',
                'output_format',
                'cta_style',
                'custom_instruction',
                'best_variation_index',
                'generation_duration_ms',
            ]);
        });
    }
};
