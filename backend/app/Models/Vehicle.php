<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'manufacturer_id',
        'name',
        'slug',
        'year',
        'base_price',
        'description',
        'specifications',
        'is_active',
    ];

    protected $casts = [
        'year' => 'integer',
        'base_price' => 'decimal:2',
        'specifications' => 'array',
        'is_active' => 'boolean',
    ];

    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function assets(): HasMany
    {
        return $this->hasMany(VehicleAsset::class);
    }

    public function customizationOptions(): HasMany
    {
        return $this->hasMany(CustomizationOption::class);
    }

    public function savedDesigns(): HasMany
    {
        return $this->hasMany(SavedDesign::class);
    }
}
