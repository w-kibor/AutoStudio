import type { ConfiguratorData, SavedDesignResponse, SelectedConfiguration } from '../types/configurator'

const API_BASE = '/api/v1'

export const fallbackPorscheData: ConfiguratorData = {
  vehicle: {
    id: 1,
    name: '911 Carrera',
    slug: 'porsche-911-carrera',
    year: 2026,
    base_price: 120100,
    description: 'The timeless sports car icon. Rear-engine layout, twin-turbo boxer engine, and unrivaled balance.',
    specifications: {
      power_hp: 388,
      torque_lb_ft: 331,
      acceleration_0_60_mph: 3.9,
      top_speed_mph: 182,
      engine: '3.0L Twin-Turbo Boxer 6',
      drivetrain: 'Rear-Wheel Drive (RWD)',
      transmission: '8-Speed Porsche Doppelkupplung (PDK)',
    },
    manufacturer: {
      id: 1,
      name: 'Porsche',
      slug: 'porsche',
      country: 'Germany',
      logo_url: '/logos/porsche.svg',
    },
  },
  assets: [
    {
      id: 1,
      asset_type: 'model_glb',
      file_path: '/models/porsche_911.glb',
      metadata: {
        body_mesh_name: 'Car_Body',
        wheel_front_left: 'Wheel_FL',
        wheel_front_right: 'Wheel_FR',
        wheel_rear_left: 'Wheel_RL',
        wheel_rear_right: 'Wheel_RR',
        brake_caliper_mesh: 'Brake_Caliper',
        camera_defaults: {
          position: [4.2, 1.6, 3.8],
          target: [0, 0.4, 0],
          fov: 45,
        },
      },
    },
  ],
  customization_categories: {
    paint: {
      id: 1,
      name: 'Exterior Paint',
      code: 'paint',
      description: 'Select a premium paint finish for your vehicle.',
      options: [
        {
          id: 1,
          category_id: 1,
          name: 'Guards Red',
          code: 'paint_guards_red',
          price_delta: 0,
          is_default: true,
          sort_order: 1,
          properties: {
            hex: '#b91c1c',
            finish: 'solid',
            roughness: 0.2,
            metallic: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
          },
        },
        {
          id: 2,
          category_id: 1,
          name: 'Racing Yellow',
          code: 'paint_racing_yellow',
          price_delta: 0,
          is_default: false,
          sort_order: 2,
          properties: {
            hex: '#eab308',
            finish: 'solid',
            roughness: 0.22,
            metallic: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
          },
        },
        {
          id: 3,
          category_id: 1,
          name: 'Gentian Blue Metallic',
          code: 'paint_gentian_blue',
          price_delta: 840,
          is_default: false,
          sort_order: 3,
          properties: {
            hex: '#173f7a',
            finish: 'metallic',
            roughness: 0.22,
            metallic: 0.85,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
          },
        },
        {
          id: 4,
          category_id: 1,
          name: 'GT Silver Metallic',
          code: 'paint_gt_silver',
          price_delta: 840,
          is_default: false,
          sort_order: 4,
          properties: {
            hex: '#949ba3',
            finish: 'metallic',
            roughness: 0.25,
            metallic: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
          },
        },
        {
          id: 5,
          category_id: 1,
          name: 'Jet Black Metallic',
          code: 'paint_jet_black',
          price_delta: 840,
          is_default: false,
          sort_order: 5,
          properties: {
            hex: '#121214',
            finish: 'metallic',
            roughness: 0.2,
            metallic: 0.6,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
          },
        },
        {
          id: 6,
          category_id: 1,
          name: 'Carrara White Metallic',
          code: 'paint_carrara_white',
          price_delta: 840,
          is_default: false,
          sort_order: 6,
          properties: {
            hex: '#f1f5f9',
            finish: 'metallic',
            roughness: 0.25,
            metallic: 0.35,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
          },
        },
      ],
    },
    wheels: {
      id: 2,
      name: 'Wheel Design',
      code: 'wheels',
      description: 'Choose wheel design and rim dimensions.',
      options: [
        {
          id: 7,
          category_id: 2,
          name: '19/20-inch Carrera Wheels',
          code: 'wheel_carrera_classic',
          price_delta: 0,
          is_default: true,
          sort_order: 1,
          properties: {
            style: 'classic_spoke',
            color_hex: '#d1d5db',
            finish: 'silver',
            spoke_count: 10,
          },
        },
        {
          id: 8,
          category_id: 2,
          name: '20/21-inch Carrera S Wheels',
          code: 'wheel_carrera_s',
          price_delta: 1790,
          is_default: false,
          sort_order: 2,
          properties: {
            style: 'twin_spoke',
            color_hex: '#9ca3af',
            finish: 'titanium',
            spoke_count: 5,
          },
        },
        {
          id: 9,
          category_id: 2,
          name: '20/21-inch RS Spyder Design Wheels',
          code: 'wheel_rs_spyder',
          price_delta: 2540,
          is_default: false,
          sort_order: 3,
          properties: {
            style: 'mesh_spyder',
            color_hex: '#1f2937',
            finish: 'satin_platinum',
            spoke_count: 16,
          },
        },
      ],
    },
    calipers: {
      id: 3,
      name: 'Brake Calipers',
      code: 'calipers',
      description: 'Select caliper finish and color accent.',
      options: [
        {
          id: 10,
          category_id: 3,
          name: 'Standard Black Calipers',
          code: 'caliper_black',
          price_delta: 0,
          is_default: true,
          sort_order: 1,
          properties: {
            hex: '#18181b',
            metallic: 0.8,
            roughness: 0.3,
          },
        },
        {
          id: 11,
          category_id: 3,
          name: 'High-Gloss Red Calipers',
          code: 'caliper_red',
          price_delta: 900,
          is_default: false,
          sort_order: 2,
          properties: {
            hex: '#dc2626',
            metallic: 0.7,
            roughness: 0.2,
          },
        },
        {
          id: 12,
          category_id: 3,
          name: 'Acid Green Calipers',
          code: 'caliper_acid_green',
          price_delta: 900,
          is_default: false,
          sort_order: 3,
          properties: {
            hex: '#84cc16',
            metallic: 0.7,
            roughness: 0.2,
          },
        },
      ],
    },
  },
  default_configuration: {
    selected_options: {
      paint: 'paint_guards_red',
      wheels: 'wheel_carrera_classic',
      calipers: 'caliper_black',
    },
    total_price: 120100,
  },
}

export async function fetchConfiguratorData(slug = 'porsche-911-carrera'): Promise<ConfiguratorData> {
  try {
    const res = await fetch(`${API_BASE}/vehicles/${slug}/configurator`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`)
    }
    const json = await res.json()
    return json.data
  } catch (error) {
    console.warn('Backend API unavailable, utilizing fallback configuration data:', error)
    return fallbackPorscheData
  }
}

export async function saveVehicleConfiguration(
  vehicleId: number,
  selectedOptions: SelectedConfiguration,
  name?: string
): Promise<SavedDesignResponse['data']> {
  try {
    const res = await fetch(`${API_BASE}/saved-designs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        vehicle_id: vehicleId,
        name: name || 'Custom Build',
        configuration: {
          selected_options: selectedOptions,
        },
      }),
    })

    if (!res.ok) {
      throw new Error(`Failed to save configuration: ${res.status}`)
    }

    const json: SavedDesignResponse = await res.json()
    return json.data
  } catch (error) {
    console.warn('Saving to backend failed, returning client-generated token:', error)
    const mockToken = Math.random().toString(36).substring(2, 10).toUpperCase()
    return {
      id: Math.floor(Math.random() * 1000),
      share_token: mockToken,
      name: name || 'Custom Build',
      total_price: 120100,
      configuration: {
        selected_options: selectedOptions,
        option_details: [],
      },
      vehicle: fallbackPorscheData.vehicle,
    }
  }
}
