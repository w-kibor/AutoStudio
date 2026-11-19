<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomizationOption;
use App\Models\SavedDesign;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SavedDesignController extends Controller
{
    /**
     * Store a customized vehicle design.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'name' => 'nullable|string|max:120',
            'configuration' => 'required|array',
            'configuration.selected_options' => 'required|array',
        ]);

        $vehicle = Vehicle::findOrFail($validated['vehicle_id']);

        // Calculate dynamic total price from selected option codes
        $selectedCodes = array_values($validated['configuration']['selected_options']);
        $options = CustomizationOption::where('vehicle_id', $vehicle->id)
            ->whereIn('code', $selectedCodes)
            ->get();

        $priceDelta = $options->sum('price_delta');
        $totalPrice = (float) $vehicle->base_price + (float) $priceDelta;

        $savedDesign = SavedDesign::create([
            'vehicle_id' => $vehicle->id,
            'user_id' => $request->user()?->id,
            'name' => $validated['name'] ?? "{$vehicle->name} Custom Build",
            'share_token' => Str::random(12),
            'configuration' => [
                'selected_options' => $validated['configuration']['selected_options'],
                'option_details' => $options->map(fn ($opt) => [
                    'code' => $opt->code,
                    'name' => $opt->name,
                    'price_delta' => (float) $opt->price_delta,
                    'properties' => $opt->properties,
                ]),
            ],
            'total_price' => $totalPrice,
        ]);

        return response()->json([
            'message' => 'Vehicle configuration saved successfully.',
            'data' => $savedDesign->load('vehicle.manufacturer'),
        ], 201);
    }

    /**
     * Retrieve a saved design by share token.
     */
    public function show(string $shareToken): JsonResponse
    {
        $savedDesign = SavedDesign::where('share_token', $shareToken)
            ->with(['vehicle.manufacturer', 'vehicle.assets'])
            ->firstOrFail();

        return response()->json([
            'data' => $savedDesign,
        ]);
    }
}
