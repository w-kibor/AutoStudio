<?php

namespace Database\Seeders;

use App\Models\CustomizationCategory;
use App\Models\CustomizationOption;
use App\Models\Manufacturer;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleAsset;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Categories
        $paintCategory = CustomizationCategory::firstOrCreate(
            ['code' => 'paint'],
            [
                'name' => 'Exterior Paint',
                'description' => 'Select a premium paint finish for your vehicle.',
                'sort_order' => 1,
            ]
        );

        $wheelsCategory = CustomizationCategory::firstOrCreate(
            ['code' => 'wheels'],
            [
                'name' => 'Wheel Design',
                'description' => 'Choose wheel design and rim dimensions.',
                'sort_order' => 2,
            ]
        );

        $calipersCategory = CustomizationCategory::firstOrCreate(
            ['code' => 'calipers'],
            [
                'name' => 'Brake Calipers',
                'description' => 'Select caliper finish and color accent.',
                'sort_order' => 3,
            ]
        );

        // 2. Seed Manufacturers
        $porsche = Manufacturer::firstOrCreate(
            ['slug' => 'porsche'],
            [
                'name' => 'Porsche',
                'country' => 'Germany',
                'logo_url' => '/logos/porsche.svg',
                'description' => 'Precision German sports cars and high-performance engineering.',
            ]
        );

        $mercedes = Manufacturer::firstOrCreate(
            ['slug' => 'mercedes-benz'],
            [
                'name' => 'Mercedes-Benz',
                'country' => 'Germany',
                'logo_url' => '/logos/mercedes.svg',
                'description' => 'Luxury, innovation, and pinnacle automotive refinement.',
            ]
        );

        // 3. Seed MVP Vehicle: Porsche 911 Carrera
        $carrera = Vehicle::firstOrCreate(
            ['slug' => 'porsche-911-carrera'],
            [
                'manufacturer_id' => $porsche->id,
                'name' => '911 Carrera',
                'year' => 2026,
                'base_price' => 120100.00,
                'description' => 'The timeless sports car icon. Rear-engine layout, twin-turbo boxer engine, and unrivaled balance.',
                'specifications' => [
                    'power_hp' => 388,
                    'torque_lb_ft' => 331,
                    'acceleration_0_60_mph' => 3.9,
                    'top_speed_mph' => 182,
                    'engine' => '3.0L Twin-Turbo Boxer 6',
                    'drivetrain' => 'Rear-Wheel Drive (RWD)',
                    'transmission' => '8-Speed Porsche Doppelkupplung (PDK)',
                ],
                'is_active' => true,
            ]
        );

        // 4. Vehicle Assets
        VehicleAsset::updateOrCreate(
            [
                'vehicle_id' => $carrera->id,
                'asset_type' => 'model_glb',
            ],
            [
                'file_path' => '/models/porsche_911.glb',
                'metadata' => [
                    'body_mesh_name' => 'Car_Body',
                    'wheel_front_left' => 'Wheel_FL',
                    'wheel_front_right' => 'Wheel_FR',
                    'wheel_rear_left' => 'Wheel_RL',
                    'wheel_rear_right' => 'Wheel_RR',
                    'brake_caliper_mesh' => 'Brake_Caliper',
                    'camera_defaults' => [
                        'position' => [4.2, 1.6, 3.8],
                        'target' => [0, 0.4, 0],
                        'fov' => 45,
                    ],
                ],
            ]
        );

        // 5. Paint Options
        $paintOptions = [
            [
                'name' => 'Guards Red',
                'code' => 'paint_guards_red',
                'price_delta' => 0.00,
                'is_default' => true,
                'sort_order' => 1,
                'properties' => [
                    'hex' => '#b91c1c',
                    'finish' => 'solid',
                    'roughness' => 0.2,
                    'metallic' => 0.05,
                    'clearcoat' => 1.0,
                    'clearcoatRoughness' => 0.05,
                ],
            ],
            [
                'name' => 'Racing Yellow',
                'code' => 'paint_racing_yellow',
                'price_delta' => 0.00,
                'is_default' => false,
                'sort_order' => 2,
                'properties' => [
                    'hex' => '#eab308',
                    'finish' => 'solid',
                    'roughness' => 0.22,
                    'metallic' => 0.05,
                    'clearcoat' => 1.0,
                    'clearcoatRoughness' => 0.05,
                ],
            ],
            [
                'name' => 'Gentian Blue Metallic',
                'code' => 'paint_gentian_blue',
                'price_delta' => 840.00,
                'is_default' => false,
                'sort_order' => 3,
                'properties' => [
                    'hex' => '#173f7a',
                    'finish' => 'metallic',
                    'roughness' => 0.22,
                    'metallic' => 0.85,
                    'clearcoat' => 1.0,
                    'clearcoatRoughness' => 0.08,
                ],
            ],
            [
                'name' => 'GT Silver Metallic',
                'code' => 'paint_gt_silver',
                'price_delta' => 840.00,
                'is_default' => false,
                'sort_order' => 4,
                'properties' => [
                    'hex' => '#949ba3',
                    'finish' => 'metallic',
                    'roughness' => 0.25,
                    'metallic' => 0.9,
                    'clearcoat' => 1.0,
                    'clearcoatRoughness' => 0.05,
                ],
            ],
            [
                'name' => 'Jet Black Metallic',
                'code' => 'paint_jet_black',
                'price_delta' => 840.00,
                'is_default' => false,
                'sort_order' => 5,
                'properties' => [
                    'hex' => '#121214',
                    'finish' => 'metallic',
                    'roughness' => 0.2,
                    'metallic' => 0.6,
                    'clearcoat' => 1.0,
                    'clearcoatRoughness' => 0.05,
                ],
            ],
            [
                'name' => 'Carrara White Metallic',
                'code' => 'paint_carrara_white',
                'price_delta' => 840.00,
                'is_default' => false,
                'sort_order' => 6,
                'properties' => [
                    'hex' => '#f1f5f9',
                    'finish' => 'metallic',
                    'roughness' => 0.25,
                    'metallic' => 0.35,
                    'clearcoat' => 1.0,
                    'clearcoatRoughness' => 0.05,
                ],
            ],
        ];

        foreach ($paintOptions as $opt) {
            CustomizationOption::updateOrCreate(
                [
                    'vehicle_id' => $carrera->id,
                    'code' => $opt['code'],
                ],
                array_merge($opt, ['category_id' => $paintCategory->id])
            );
        }

        // 6. Wheel Options
        $wheelOptions = [
            [
                'name' => '19/20-inch Carrera Wheels',
                'code' => 'wheel_carrera_classic',
                'price_delta' => 0.00,
                'is_default' => true,
                'sort_order' => 1,
                'properties' => [
                    'style' => 'classic_spoke',
                    'color_hex' => '#d1d5db',
                    'finish' => 'silver',
                    'spoke_count' => 10,
                ],
            ],
            [
                'name' => '20/21-inch Carrera S Wheels',
                'code' => 'wheel_carrera_s',
                'price_delta' => 1790.00,
                'is_default' => false,
                'sort_order' => 2,
                'properties' => [
                    'style' => 'twin_spoke',
                    'color_hex' => '#9ca3af',
                    'finish' => 'titanium',
                    'spoke_count' => 5,
                ],
            ],
            [
                'name' => '20/21-inch RS Spyder Design Wheels',
                'code' => 'wheel_rs_spyder',
                'price_delta' => 2540.00,
                'is_default' => false,
                'sort_order' => 3,
                'properties' => [
                    'style' => 'mesh_spyder',
                    'color_hex' => '#1f2937',
                    'finish' => 'satin_platinum',
                    'spoke_count' => 16,
                ],
            ],
        ];

        foreach ($wheelOptions as $opt) {
            CustomizationOption::updateOrCreate(
                [
                    'vehicle_id' => $carrera->id,
                    'code' => $opt['code'],
                ],
                array_merge($opt, ['category_id' => $wheelsCategory->id])
            );
        }

        // 7. Caliper Options
        $caliperOptions = [
            [
                'name' => 'Standard Black Calipers',
                'code' => 'caliper_black',
                'price_delta' => 0.00,
                'is_default' => true,
                'sort_order' => 1,
                'properties' => [
                    'hex' => '#18181b',
                    'metallic' => 0.8,
                    'roughness' => 0.3,
                ],
            ],
            [
                'name' => 'High-Gloss Red Calipers',
                'code' => 'caliper_red',
                'price_delta' => 900.00,
                'is_default' => false,
                'sort_order' => 2,
                'properties' => [
                    'hex' => '#dc2626',
                    'metallic' => 0.7,
                    'roughness' => 0.2,
                ],
            ],
            [
                'name' => 'Acid Green Calipers',
                'code' => 'caliper_acid_green',
                'price_delta' => 900.00,
                'is_default' => false,
                'sort_order' => 3,
                'properties' => [
                    'hex' => '#84cc16',
                    'metallic' => 0.7,
                    'roughness' => 0.2,
                ],
            ],
        ];

        foreach ($caliperOptions as $opt) {
            CustomizationOption::updateOrCreate(
                [
                    'vehicle_id' => $carrera->id,
                    'code' => $opt['code'],
                ],
                array_merge($opt, ['category_id' => $calipersCategory->id])
            );
        }
    }
}
