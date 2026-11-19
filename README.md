# AutoStudio — 3D Vehicle Configurator

AutoStudio is an interactive 3D vehicle configurator platform that allows users to explore realistic production vehicles and customize exterior paint colors, wheel designs, brake calipers, and specifications in real time.

---

## Architecture Overview

- **Frontend (`frontend/`)**: React, TypeScript, Vite, Three.js, React Three Fiber, Tailwind CSS.
- **Backend (`backend/`)**: Laravel REST API, Eloquent ORM.
- **Database**: PostgreSQL (with SQLite configured for local zero-dependency development and automated test suites).
- **Documentation (`docs/`)**:
  - [Database Schema](file:///home/chem/Desktop/projects/AutoStudio/docs/database-schema.md)
  - [REST API Documentation](file:///home/chem/Desktop/projects/AutoStudio/docs/api-documentation.md)

---

## Backend Quick Start

### 1. Requirements
- PHP 8.2+
- Composer
- SQLite3 or PostgreSQL

### 2. Running Migrations & Seeding Initial Data
```bash
cd backend
php artisan migrate --seed
```

This seeds:
- Manufacturers: **Porsche**, **Mercedes-Benz**
- Vehicles: **Porsche 911 Carrera (2026)** with full mechanical specs and 3D asset metadata
- Customization Categories: **Exterior Paint**, **Wheel Design**, **Brake Calipers**
- Customization Options: 6 realistic paint finishes, 3 wheel designs, and 3 caliper options

### 3. Starting the Backend API Server
```bash
cd backend
php artisan serve
```
The API is available at `http://127.0.0.1:8000/api/v1/`.

### 4. Running Backend Tests
```bash
cd backend
php artisan test
```

---

## API Endpoints

- `GET /api/v1/manufacturers` — List all manufacturers
- `GET /api/v1/vehicles` — Vehicle catalogue
- `GET /api/v1/vehicles/{slug}/configurator` — Complete vehicle configurator payload
- `POST /api/v1/saved-designs` — Save a customized vehicle configuration
- `GET /api/v1/saved-designs/{shareToken}` — Retrieve a saved configuration
