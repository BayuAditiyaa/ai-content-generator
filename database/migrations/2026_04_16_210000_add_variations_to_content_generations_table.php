<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_generations', function (Blueprint $table) {
            $table->unsignedTinyInteger('variation_count')->default(1)->after('tone');
            $table->json('variations')->nullable()->after('generated_content');
        });

        DB::table('content_generations')->update([
            'variation_count' => 1,
            'variations' => DB::raw("json_array(json_object('title', 'Variation 1', 'content', generated_content))"),
        ]);
    }

    public function down(): void
    {
        Schema::table('content_generations', function (Blueprint $table) {
            $table->dropColumn(['variation_count', 'variations']);
        });
    }
};
