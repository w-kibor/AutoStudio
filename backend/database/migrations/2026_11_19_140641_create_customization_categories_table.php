<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customization_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "Exterior Paint", "Wheels", "Brake Calipers"
            $table->string('code')->unique(); // e.g. "paint", "wheels", "calipers"
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customization_categories');
    }
};
