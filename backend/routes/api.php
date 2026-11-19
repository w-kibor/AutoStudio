<?php

use App\Http\Controllers\Api\ManufacturerController;
use App\Http\Controllers\Api\SavedDesignController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Manufacturers
    Route::get('/manufacturers', [ManufacturerController::class, 'index']);
    Route::get('/manufacturers/{slug}', [ManufacturerController::class, 'show']);

    // Vehicles & Configurator
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{slug}', [VehicleController::class, 'show']);
    Route::get('/vehicles/{slug}/configurator', [VehicleController::class, 'configurator']);

    // Saved Designs
    Route::post('/saved-designs', [SavedDesignController::class, 'store']);
    Route::get('/saved-designs/{shareToken}', [SavedDesignController::class, 'show']);
});
