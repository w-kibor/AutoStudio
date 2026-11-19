import type {
  ConfiguratorData,
  SavedDesignResponse,
  SelectedConfiguration,
  Vehicle,
} from '../types/configurator'

const API_BASE = '/api/v1'

const sharedWheels = {
  id: 2,
  name: 'Wheel Design',
  code: 'wheels',
  description: 'Forged light-alloy wheels engineered for precision handling.',
  options: [
    {
      id: 7,
      category_id: 2,
      name: '20" Multi-Spoke Forged',
      code: 'wheel_multi_spoke',
      price_delta: 0,
      is_default: true,
      sort_order: 1,
      properties: {
        style: 'classic_spoke',
        color_hex: '#d4d4d8',
        finish: 'high_sheen_silver',
        spoke_count: 10,
      },
    },
    {
      id: 8,
      category_id: 2,
      name: '21" Twin 5-Spoke Titanium',
      code: 'wheel_twin_5_spoke',
      price_delta: 1950,
      is_default: false,
      sort_order: 2,
      properties: {
        style: 'twin_spoke',
        color_hex: '#71717a',
        finish: 'titanium_grey',
        spoke_count: 5,
      },
    },
    {
      id: 9,
      category_id: 2,
      name: '21" Cross-Spoke Satin Black',
      code: 'wheel_cross_spoke_black',
      price_delta: 2850,
      is_default: false,
      sort_order: 3,
      properties: {
        style: 'mesh_spyder',
        color_hex: '#18181b',
        finish: 'satin_black',
        spoke_count: 16,
      },
    },
  ],
}

const sharedCalipers = {
  id: 3,
  name: 'Brake Calipers',
  code: 'calipers',
  description: 'High-performance composite braking system.',
  options: [
    {
      id: 10,
      category_id: 3,
      name: 'Anodized Obsidian Black',
      code: 'caliper_black',
      price_delta: 0,
      is_default: true,
      sort_order: 1,
      properties: { hex: '#18181b', metallic: 0.85, roughness: 0.25 },
    },
    {
      id: 11,
      category_id: 3,
      name: 'AMG / Performance Red',
      code: 'caliper_red',
      price_delta: 950,
      is_default: false,
      sort_order: 2,
      properties: { hex: '#b91c1c', metallic: 0.7, roughness: 0.2 },
    },
    {
      id: 12,
      category_id: 3,
      name: 'Ceramic Gold Bronze',
      code: 'caliper_gold',
      price_delta: 1450,
      is_default: false,
      sort_order: 3,
      properties: { hex: '#ca8a04', metallic: 0.85, roughness: 0.2 },
    },
  ],
}

export const vehicleCatalogMap: Record<string, ConfiguratorData> = {
  'toyota-gr-supra-a90': {
    vehicle: {
      id: 4,
      name: 'GR Supra 3.0 (A90)',
      slug: 'toyota-gr-supra-a90',
      year: 2024,
      base_price: 55400,
      body_style: 'supra',
      description:
        'Pure sports car proportions engineered by TOYOTA GAZOO Racing. Double-bubble roof, 3.0L turbocharged inline-6, and rear-wheel-drive precision.',
      specifications: {
        power_hp: 382,
        torque_lb_ft: 368,
        acceleration_0_60_mph: 3.9,
        top_speed_mph: 155,
        engine: '3.0L Turbocharged Inline-6',
        drivetrain: 'Rear-Wheel Drive (RWD)',
        transmission: '8-Speed Paddle-Shift Automatic / 6MT',
      },
      manufacturer: {
        id: 3,
        name: 'Toyota Gazoo Racing',
        slug: 'toyota',
        country: 'Japan',
      },
    },
    assets: [],
    customization_categories: {
      paint: {
        id: 1,
        name: 'Factory Paint Finishes',
        code: 'paint',
        options: [
          {
            id: 301,
            category_id: 1,
            name: 'Renaissance Red 2.0',
            code: 'paint_renaissance_red',
            price_delta: 0,
            is_default: true,
            sort_order: 1,
            properties: {
              hex: '#d91623',
              finish: 'solid',
              roughness: 0.22,
              metallic: 0.45,
              clearcoat: 0.9,
              clearcoatRoughness: 0.1,
            },
          },
          {
            id: 302,
            category_id: 1,
            name: 'Nitro Yellow',
            code: 'paint_nitro_yellow',
            price_delta: 425,
            is_default: false,
            sort_order: 2,
            properties: {
              hex: '#eab308',
              finish: 'solid',
              roughness: 0.22,
              metallic: 0.35,
              clearcoat: 0.9,
              clearcoatRoughness: 0.08,
            },
          },
          {
            id: 303,
            category_id: 1,
            name: 'Stratosphere Blue',
            code: 'paint_stratosphere_blue',
            price_delta: 425,
            is_default: false,
            sort_order: 3,
            properties: {
              hex: '#1d4ed8',
              finish: 'metallic',
              roughness: 0.2,
              metallic: 0.75,
              clearcoat: 0.95,
              clearcoatRoughness: 0.06,
            },
          },
          {
            id: 304,
            category_id: 1,
            name: 'Absolute Zero',
            code: 'paint_absolute_zero',
            price_delta: 0,
            is_default: false,
            sort_order: 4,
            properties: {
              hex: '#f8fafc',
              finish: 'solid',
              roughness: 0.25,
              metallic: 0.15,
              clearcoat: 0.85,
              clearcoatRoughness: 0.08,
            },
          },
          {
            id: 305,
            category_id: 1,
            name: 'CU Later / Matte Storm Gray',
            code: 'paint_matte_storm_gray',
            price_delta: 1250,
            is_default: false,
            sort_order: 5,
            properties: {
              hex: '#4b5563',
              finish: 'matte',
              roughness: 0.55,
              metallic: 0.5,
              clearcoat: 0.15,
              clearcoatRoughness: 0.35,
            },
          },
        ],
      },
      wheels: sharedWheels,
      calipers: sharedCalipers,
    },
    default_configuration: {
      selected_options: {
        paint: 'paint_renaissance_red',
        wheels: 'wheel_multi_spoke',
        calipers: 'caliper_red',
      },
      total_price: 56350,
    },
  },

  'mercedes-amg-gt-63': {
    vehicle: {
      id: 2,
      name: 'AMG GT 63 Coupé',
      slug: 'mercedes-amg-gt-63',
      year: 2026,
      base_price: 175900,
      body_style: 'gt',
      description:
        'Handcrafted 4.0L V8 biturbo power meets sculpted grand touring elegance. Active aerodynamics and 4MATIC+ all-wheel drive.',
      specifications: {
        power_hp: 577,
        torque_lb_ft: 590,
        acceleration_0_60_mph: 3.1,
        top_speed_mph: 196,
        engine: '4.0L Handcrafted V8 Biturbo',
        drivetrain: 'AMG Performance 4MATIC+ AWD',
        transmission: 'AMG SPEEDSHIFT MCT 9G',
      },
      manufacturer: {
        id: 2,
        name: 'Mercedes-Benz',
        slug: 'mercedes-benz',
        country: 'Germany',
      },
    },
    assets: [],
    customization_categories: {
      paint: {
        id: 1,
        name: 'MANUFAKTUR & Metallic Paints',
        code: 'paint',
        options: [
          {
            id: 101,
            category_id: 1,
            name: 'Selenite Grey Magno',
            code: 'paint_selenite_magno',
            price_delta: 0,
            is_default: true,
            sort_order: 1,
            properties: {
              hex: '#52525b',
              finish: 'matte',
              roughness: 0.45,
              metallic: 0.75,
              clearcoat: 0.35,
              clearcoatRoughness: 0.3,
            },
          },
          {
            id: 102,
            category_id: 1,
            name: 'Obsidian Black Metallic',
            code: 'paint_obsidian_black',
            price_delta: 0,
            is_default: false,
            sort_order: 2,
            properties: {
              hex: '#09090b',
              finish: 'metallic',
              roughness: 0.18,
              metallic: 0.7,
              clearcoat: 1.0,
              clearcoatRoughness: 0.04,
            },
          },
          {
            id: 103,
            category_id: 1,
            name: 'High-Tech Silver Metallic',
            code: 'paint_hightech_silver',
            price_delta: 750,
            is_default: false,
            sort_order: 3,
            properties: {
              hex: '#cbd5e1',
              finish: 'metallic',
              roughness: 0.2,
              metallic: 0.92,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
            },
          },
          {
            id: 104,
            category_id: 1,
            name: 'Spectral Blue Metallic',
            code: 'paint_spectral_blue',
            price_delta: 1250,
            is_default: false,
            sort_order: 4,
            properties: {
              hex: '#1e3a5f',
              finish: 'metallic',
              roughness: 0.2,
              metallic: 0.85,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
            },
          },
          {
            id: 105,
            category_id: 1,
            name: 'MANUFAKTUR Patagonia Red',
            code: 'paint_patagonia_red',
            price_delta: 1750,
            is_default: false,
            sort_order: 5,
            properties: {
              hex: '#7f1d1d',
              finish: 'metallic',
              roughness: 0.18,
              metallic: 0.75,
              clearcoat: 1.0,
              clearcoatRoughness: 0.04,
            },
          },
          {
            id: 106,
            category_id: 1,
            name: 'MANUFAKTUR Moonlight White',
            code: 'paint_moonlight_white',
            price_delta: 1750,
            is_default: false,
            sort_order: 6,
            properties: {
              hex: '#f8fafc',
              finish: 'metallic',
              roughness: 0.22,
              metallic: 0.3,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
            },
          },
        ],
      },
      wheels: sharedWheels,
      calipers: sharedCalipers,
    },
    default_configuration: {
      selected_options: {
        paint: 'paint_selenite_magno',
        wheels: 'wheel_multi_spoke',
        calipers: 'caliper_black',
      },
      total_price: 175900,
    },
  },

  'mercedes-benz-s-580': {
    vehicle: {
      id: 3,
      name: 'S 580 4MATIC Sedan',
      slug: 'mercedes-benz-s-580',
      year: 2026,
      base_price: 128150,
      body_style: 'sedan',
      description:
        'The pinnacle of executive luxury. Whisper-quiet V8 mild-hybrid refinement, AIRMATIC suspension, and timeless three-box proportions.',
      specifications: {
        power_hp: 496,
        torque_lb_ft: 516,
        acceleration_0_60_mph: 4.4,
        top_speed_mph: 155,
        engine: '4.0L V8 Biturbo + 48V EQ Boost',
        drivetrain: '4MATIC All-Wheel Drive',
        transmission: '9G-TRONIC 9-Speed Automatic',
      },
      manufacturer: {
        id: 2,
        name: 'Mercedes-Benz',
        slug: 'mercedes-benz',
        country: 'Germany',
      },
    },
    assets: [],
    customization_categories: {
      paint: {
        id: 1,
        name: 'Exterior Paint',
        code: 'paint',
        options: [
          {
            id: 201,
            category_id: 1,
            name: 'Obsidian Black Metallic',
            code: 'paint_obsidian_black',
            price_delta: 0,
            is_default: true,
            sort_order: 1,
            properties: {
              hex: '#09090b',
              finish: 'metallic',
              roughness: 0.16,
              metallic: 0.72,
              clearcoat: 1.0,
              clearcoatRoughness: 0.04,
            },
          },
          {
            id: 202,
            category_id: 1,
            name: 'Nautical Blue Metallic',
            code: 'paint_nautical_blue',
            price_delta: 0,
            is_default: false,
            sort_order: 2,
            properties: {
              hex: '#0f2942',
              finish: 'metallic',
              roughness: 0.2,
              metallic: 0.85,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
            },
          },
          {
            id: 203,
            category_id: 1,
            name: 'Cirrus Silver Metallic',
            code: 'paint_cirrus_silver',
            price_delta: 0,
            is_default: false,
            sort_order: 3,
            properties: {
              hex: '#d4d4d8',
              finish: 'metallic',
              roughness: 0.22,
              metallic: 0.9,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
            },
          },
          {
            id: 204,
            category_id: 1,
            name: 'Emerald Green Metallic',
            code: 'paint_emerald_green',
            price_delta: 950,
            is_default: false,
            sort_order: 4,
            properties: {
              hex: '#064e3b',
              finish: 'metallic',
              roughness: 0.2,
              metallic: 0.82,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
            },
          },
          {
            id: 205,
            category_id: 1,
            name: 'MANUFAKTUR Diamond White',
            code: 'paint_diamond_white',
            price_delta: 1750,
            is_default: false,
            sort_order: 5,
            properties: {
              hex: '#f8fafc',
              finish: 'metallic',
              roughness: 0.22,
              metallic: 0.35,
              clearcoat: 1.0,
              clearcoatRoughness: 0.04,
            },
          },
        ],
      },
      wheels: sharedWheels,
      calipers: sharedCalipers,
    },
    default_configuration: {
      selected_options: {
        paint: 'paint_obsidian_black',
        wheels: 'wheel_multi_spoke',
        calipers: 'caliper_black',
      },
      total_price: 128150,
    },
  },

  'porsche-911-carrera': {
    vehicle: {
      id: 1,
      name: '911 Carrera',
      slug: 'porsche-911-carrera',
      year: 2026,
      base_price: 120100,
      body_style: 'coupe',
      description:
        'The timeless sports car icon. Rear-engine layout, twin-turbo boxer engine, and unrivaled balance.',
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
      },
    },
    assets: [],
    customization_categories: {
      paint: {
        id: 1,
        name: 'Exterior Paint',
        code: 'paint',
        options: [
          {
            id: 1,
            category_id: 1,
            name: 'GT Silver Metallic',
            code: 'paint_gt_silver',
            price_delta: 840,
            is_default: true,
            sort_order: 1,
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
            id: 2,
            category_id: 1,
            name: 'Guards Red',
            code: 'paint_guards_red',
            price_delta: 0,
            is_default: false,
            sort_order: 2,
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
            name: 'Jet Black Metallic',
            code: 'paint_jet_black',
            price_delta: 840,
            is_default: false,
            sort_order: 4,
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
            id: 5,
            category_id: 1,
            name: 'Carrara White Metallic',
            code: 'paint_carrara_white',
            price_delta: 840,
            is_default: false,
            sort_order: 5,
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
      wheels: sharedWheels,
      calipers: sharedCalipers,
    },
    default_configuration: {
      selected_options: {
        paint: 'paint_gt_silver',
        wheels: 'wheel_multi_spoke',
        calipers: 'caliper_black',
      },
      total_price: 120940,
    },
  },
}

export const fallbackPorscheData = vehicleCatalogMap['toyota-gr-supra-a90']

export function getLocalCatalogVehicles(): Vehicle[] {
  return Object.values(vehicleCatalogMap).map((item) => item.vehicle)
}

export async function fetchConfiguratorData(slug = 'toyota-gr-supra-a90'): Promise<ConfiguratorData> {
  if (vehicleCatalogMap[slug] && slug !== 'porsche-911-carrera') {
    return vehicleCatalogMap[slug]
  }

  try {
    const res = await fetch(`${API_BASE}/vehicles/${slug}/configurator`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`)
    }
    const json = await res.json()
    return json.data
  } catch {
    return vehicleCatalogMap[slug] || vehicleCatalogMap['mercedes-amg-gt-63']
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
  } catch {
    const mockToken = Math.random().toString(36).substring(2, 10).toUpperCase()
    return {
      id: Math.floor(Math.random() * 1000),
      share_token: mockToken,
      name: name || 'Custom Build',
      total_price: 175900,
      configuration: {
        selected_options: selectedOptions,
        option_details: [],
      },
      vehicle: fallbackPorscheData.vehicle,
    }
  }
}
