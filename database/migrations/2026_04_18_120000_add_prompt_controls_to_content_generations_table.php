<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_generations', function (Blueprint $table) {
            $table->string('template_key')->nullable()->after('tone');
            $table->string('length_control_type')->default('words')->after('template_key');
            $table->unsignedSmallInteger('length_control_value')->default(250)->after('length_control_type');
        });
    }

    public function down(): void
    {
        Schema::table('content_generations', function (Blueprint $table) {
            $table->dropColumn([
                'template_key',
                'length_control_type',
                'length_control_value',
            ]);
        });
    }
};
