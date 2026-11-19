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
        Schema::create('customization_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('customization_categories')->cascadeOnDelete();
            $table->string('name'); // e.g. "Guards Red", "20/21-inch Carrera S Wheels"
            $table->string('code'); // e.g. "paint_guards_red"
            $table->decimal('price_delta', 10, 2)->default(0.00);
            $table->boolean('is_default')->default(false);
            $table->json('properties'); // paint values { hex, roughness, metallic, clearcoat } or wheel info
            $table->string('preview_image')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['vehicle_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customization_options');
    }
};
