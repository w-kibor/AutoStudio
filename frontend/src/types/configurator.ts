export interface Manufacturer {
  id: number
  name: string
  slug: string
  country?: string
  logo_url?: string
}

export interface VehicleAsset {
  id: number
  asset_type: 'model_glb' | 'thumbnail' | 'badge'
  file_path: string
  metadata?: {
    body_mesh_name?: string
    wheel_front_left?: string
    wheel_front_right?: string
    wheel_rear_left?: string
    wheel_rear_right?: string
    brake_caliper_mesh?: string
    camera_defaults?: {
      position: [number, number, number]
      target: [number, number, number]
      fov: number
    }
  }
}

export interface PaintProperties {
  hex: string
  finish: 'solid' | 'metallic' | 'matte'
  roughness: number
  metallic: number
  clearcoat: number
  clearcoatRoughness: number
}

export interface WheelProperties {
  style: string
  color_hex: string
  finish: string
  spoke_count: number
}

export interface CaliperProperties {
  hex: string
  metallic: number
  roughness: number
}

export interface CustomizationOption {
  id: number
  category_id: number
  name: string
  code: string
  price_delta: number
  is_default: boolean
  properties: PaintProperties | WheelProperties | CaliperProperties | Record<string, any>
  preview_image?: string
  sort_order: number
}

export interface CustomizationCategoryGroup {
  id: number
  name: string
  code: string
  description?: string
  options: CustomizationOption[]
}

export interface VehicleSpecifications {
  power_hp: number
  torque_lb_ft?: number
  acceleration_0_60_mph: number
  top_speed_mph: number
  engine: string
  drivetrain: string
  transmission: string
}

export interface Vehicle {
  id: number
  name: string
  slug: string
  year: number
  base_price: number
  description: string
  body_style?: 'coupe' | 'gt' | 'sedan' | 'supra'
  specifications: VehicleSpecifications
  manufacturer: Manufacturer
}

export interface ConfiguratorData {
  vehicle: Vehicle
  assets: VehicleAsset[]
  customization_categories: {
    paint: CustomizationCategoryGroup
    wheels: CustomizationCategoryGroup
    calipers: CustomizationCategoryGroup
    [key: string]: CustomizationCategoryGroup
  }
  default_configuration: {
    selected_options: {
      paint: string
      wheels: string
      calipers: string
      [categoryCode: string]: string
    }
    total_price: number
  }
}

export interface SelectedConfiguration {
  paint: string
  wheels: string
  calipers: string
  [key: string]: string
}

export interface SavedDesignResponse {
  message: string
  data: {
    id: number
    share_token: string
    name: string
    total_price: number
    configuration: {
      selected_options: SelectedConfiguration
      option_details: Array<{
        code: string
        name: string
        price_delta: number
        properties: any
      }>
    }
    vehicle: Vehicle
  }
}
