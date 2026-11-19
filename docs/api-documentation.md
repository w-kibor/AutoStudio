# AutoStudio — REST API Documentation

Base URL: `/api/v1`

---

### 1. Manufacturers

#### `GET /api/v1/manufacturers`
List all active vehicle manufacturers with their vehicle counts.

**Response `200 OK`**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Porsche",
      "slug": "porsche",
      "country": "Germany",
      "logo_url": "/logos/porsche.svg",
      "vehicles_count": 1
    }
  ]
}
```

#### `GET /api/v1/manufacturers/{slug}`
Retrieve a specific manufacturer with all its active models.

---

### 2. Vehicle Catalogue

#### `GET /api/v1/vehicles`
List all active vehicles with their specifications, manufacturer, and assets.

Query parameters:
- `manufacturer` (optional): Filter by manufacturer slug (e.g. `?manufacturer=porsche`).

#### `GET /api/v1/vehicles/{slug}`
Retrieve specific vehicle specifications and metadata.

---

### 3. Configurator Payload

#### `GET /api/v1/vehicles/{slug}/configurator`
Fetches complete configurator data including 3D model path, camera calibration, available customization categories and options, and the default initial build.

**Response `200 OK`**:
```json
{
  "data": {
    "vehicle": {
      "id": 1,
      "name": "911 Carrera",
      "slug": "porsche-911-carrera",
      "year": 2026,
      "base_price": 120100,
      "specifications": {
        "power_hp": 388,
        "acceleration_0_60_mph": 3.9,
        "top_speed_mph": 182,
        "engine": "3.0L Twin-Turbo Boxer 6"
      },
      "manufacturer": { "name": "Porsche", "slug": "porsche" }
    },
    "assets": [
      {
        "asset_type": "model_glb",
        "file_path": "/models/porsche_911.glb",
        "metadata": {
          "body_mesh_name": "Car_Body",
          "wheel_front_left": "Wheel_FL",
          "wheel_front_right": "Wheel_FR",
          "camera_defaults": {
            "position": [4.2, 1.6, 3.8],
            "target": [0, 0.4, 0],
            "fov": 45
          }
        }
      }
    ],
    "customization_categories": {
      "paint": {
        "name": "Exterior Paint",
        "code": "paint",
        "options": [
          {
            "name": "Guards Red",
            "code": "paint_guards_red",
            "price_delta": 0,
            "is_default": true,
            "properties": {
              "hex": "#b91c1c",
              "metallic": 0.05,
              "roughness": 0.2,
              "clearcoat": 1.0
            }
          }
        ]
      },
      "wheels": { ... },
      "calipers": { ... }
    },
    "default_configuration": {
      "selected_options": {
        "paint": "paint_guards_red",
        "wheels": "wheel_carrera_classic",
        "calipers": "caliper_black"
      },
      "total_price": 120100
    }
  }
}
```

---

### 4. Saved Configurations

#### `POST /api/v1/saved-designs`
Persist a configured vehicle design and obtain a shareable token.

**Request Body**:
```json
{
  "vehicle_id": 1,
  "name": "My Dream Carrera",
  "configuration": {
    "selected_options": {
      "paint": "paint_gentian_blue",
      "wheels": "wheel_rs_spyder",
      "calipers": "caliper_red"
    }
  }
}
```

**Response `201 Created`**:
```json
{
  "message": "Vehicle configuration saved successfully.",
  "data": {
    "id": 1,
    "share_token": "uY48pLa0VbQw",
    "name": "My Dream Carrera",
    "total_price": 123480,
    "configuration": { ... }
  }
}
```

#### `GET /api/v1/saved-designs/{shareToken}`
Retrieve a previously configured vehicle design by its unique token.
