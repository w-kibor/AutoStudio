<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'asset_type',
        'file_path',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}
