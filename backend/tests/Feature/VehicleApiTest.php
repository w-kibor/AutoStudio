<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehicleApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_can_list_manufacturers(): void
    {
        $response = $this->getJson('/api/v1/manufacturers');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'country', 'vehicles_count'],
                ],
            ]);
    }

    public function test_can_list_vehicles_catalogue(): void
    {
        $response = $this->getJson('/api/v1/vehicles');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'year',
                        'base_price',
                        'specifications',
                        'manufacturer',
                        'assets',
                    ],
                ],
            ]);
    }

    public function test_can_retrieve_vehicle_configurator_payload(): void
    {
        $response = $this->getJson('/api/v1/vehicles/porsche-911-carrera/configurator');

        $response->assertStatus(200)
            ->assertJsonPath('data.vehicle.slug', 'porsche-911-carrera')
            ->assertJsonStructure([
                'data' => [
                    'vehicle' => ['id', 'name', 'slug', 'year', 'base_price', 'specifications'],
                    'assets' => [
                        '*' => ['id', 'asset_type', 'file_path', 'metadata'],
                    ],
                    'customization_categories' => [
                        'paint' => ['name', 'code', 'options'],
                        'wheels' => ['name', 'code', 'options'],
                        'calipers' => ['name', 'code', 'options'],
                    ],
                    'default_configuration' => [
                        'selected_options',
                        'total_price',
                    ],
                ],
            ]);
    }

    public function test_can_save_and_retrieve_vehicle_design(): void
    {
        $postResponse = $this->postJson('/api/v1/saved-designs', [
            'vehicle_id' => 1,
            'name' => 'My Carrera Test Build',
            'configuration' => [
                'selected_options' => [
                    'paint' => 'paint_gentian_blue',
                    'wheels' => 'wheel_rs_spyder',
                    'calipers' => 'caliper_red',
                ],
            ],
        ]);

        $postResponse->assertStatus(201)
            ->assertJsonPath('data.name', 'My Carrera Test Build');

        $shareToken = $postResponse->json('data.share_token');
        $this->assertNotEmpty($shareToken);

        $getResponse = $this->getJson("/api/v1/saved-designs/{$shareToken}");
        $getResponse->assertStatus(200)
            ->assertJsonPath('data.share_token', $shareToken)
            ->assertJsonPath('data.vehicle.slug', 'porsche-911-carrera');
    }
}
