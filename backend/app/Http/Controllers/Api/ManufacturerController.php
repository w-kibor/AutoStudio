<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Manufacturer;
use Illuminate\Http\JsonResponse;

class ManufacturerController extends Controller
{
    /**
     * List all manufacturers with their vehicle count.
     */
    public function index(): JsonResponse
    {
        $manufacturers = Manufacturer::withCount([
            'vehicles' => fn ($query) => $query->where('is_active', true),
        ])->get();

        return response()->json([
            'data' => $manufacturers,
        ]);
    }

    /**
     * Show a manufacturer with its vehicles.
     */
    public function show(string $slug): JsonResponse
    {
        $manufacturer = Manufacturer::where('slug', $slug)
            ->with(['vehicles' => fn ($query) => $query->where('is_active', true)->with('assets')])
            ->firstOrFail();

        return response()->json([
            'data' => $manufacturer,
        ]);
    }
}
