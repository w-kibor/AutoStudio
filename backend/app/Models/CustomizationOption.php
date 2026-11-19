<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomizationOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'category_id',
        'name',
        'code',
        'price_delta',
        'is_default',
        'properties',
        'preview_image',
        'sort_order',
    ];

    protected $casts = [
        'price_delta' => 'decimal:2',
        'is_default' => 'boolean',
        'properties' => 'array',
        'sort_order' => 'integer',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(CustomizationCategory::class, 'category_id');
    }
}
