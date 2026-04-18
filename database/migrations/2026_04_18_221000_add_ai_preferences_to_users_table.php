<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('preferred_ai_provider')->nullable()->after('password');
            $table->string('preferred_output_language', 5)->default('en')->after('preferred_ai_provider');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'preferred_ai_provider',
                'preferred_output_language',
            ]);
        });
    }
};
