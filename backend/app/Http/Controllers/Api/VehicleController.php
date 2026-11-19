<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomizationCategory;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    /**
     * List vehicles for the catalogue.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::where('is_active', true)
            ->with(['manufacturer', 'assets']);

        if ($request->filled('manufacturer')) {
            $query->whereHas('manufacturer', function ($q) use ($request) {
                $q->where('slug', $request->query('manufacturer'));
            });
        }

        $vehicles = $query->orderBy('name')->get();

        return response()->json([
            'data' => $vehicles,
        ]);
    }

    /**
     * Show vehicle specifications and details.
     */
    public function show(string $slug): JsonResponse
    {
        $vehicle = Vehicle::where('slug', $slug)
            ->where('is_active', true)
            ->with(['manufacturer', 'assets'])
            ->firstOrFail();

        return response()->json([
            'data' => $vehicle,
        ]);
    }

    /**
     * Return full configurator payload for a vehicle:
     * - Vehicle specs and pricing
     * - 3D assets and camera settings
     * - Categorized customization options (paint, wheels, calipers)
     * - Default configuration state
     */
    public function configurator(string $slug): JsonResponse
    {
        $vehicle = Vehicle::where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'manufacturer',
                'assets',
                'customizationOptions.category',
            ])
            ->firstOrFail();

        $categories = CustomizationCategory::orderBy('sort_order')->get();

        $groupedOptions = [];
        $defaultConfig = [];
        $totalPrice = (float) $vehicle->base_price;

        foreach ($categories as $cat) {
            $options = $vehicle->customizationOptions
                ->where('category_id', $cat->id)
                ->sortBy('sort_order')
                ->values();

            if ($options->isNotEmpty()) {
                $groupedOptions[$cat->code] = [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'code' => $cat->code,
                    'description' => $cat->description,
                    'options' => $options,
                ];

                $defaultOption = $options->firstWhere('is_default', true) ?? $options->first();
                if ($defaultOption) {
                    $defaultConfig[$cat->code] = $defaultOption->code;
                    $totalPrice += (float) $defaultOption->price_delta;
                }
            }
        }

        return response()->json([
            'data' => [
                'vehicle' => [
                    'id' => $vehicle->id,
                    'name' => $vehicle->name,
                    'slug' => $vehicle->slug,
                    'year' => $vehicle->year,
                    'base_price' => (float) $vehicle->base_price,
                    'description' => $vehicle->description,
                    'specifications' => $vehicle->specifications,
                    'manufacturer' => $vehicle->manufacturer,
                ],
                'assets' => $vehicle->assets,
                'customization_categories' => $groupedOptions,
                'default_configuration' => [
                    'selected_options' => $defaultConfig,
                    'total_price' => $totalPrice,
                ],
            ],
        ]);
    }
}
