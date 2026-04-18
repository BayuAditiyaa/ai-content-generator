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

        DB::table('content_generations')
            ->select(['id', 'generated_content'])
            ->orderBy('id')
            ->chunkById(100, function ($generations): void {
                foreach ($generations as $generation) {
                    DB::table('content_generations')
                        ->where('id', $generation->id)
                        ->update([
                            'variation_count' => 1,
                            'variations' => json_encode([
                                [
                                    'title' => 'Variation 1',
                                    'content' => $generation->generated_content,
                                ],
                            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                        ]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('content_generations', function (Blueprint $table) {
            $table->dropColumn(['variation_count', 'variations']);
        });
    }
};
