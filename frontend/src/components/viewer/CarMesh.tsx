import React, { useMemo } from 'react'
import * as THREE from 'three'
import type { CaliperProperties, PaintProperties, WheelProperties } from '../../types/configurator'

interface CarMeshProps {
  paint: PaintProperties
  wheel: WheelProperties
  caliper: CaliperProperties
}

export const CarMesh: React.FC<CarMeshProps> = ({ paint, wheel, caliper }) => {
  // Body paint material
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paint.hex),
      metalness: paint.metallic ?? 0.5,
      roughness: paint.roughness ?? 0.2,
      clearcoat: paint.clearcoat ?? 1.0,
      clearcoatRoughness: paint.clearcoatRoughness ?? 0.05,
      reflectivity: 0.9,
    })
  }, [paint])

  // Glass material
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a101d'),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
      reflectivity: 0.95,
      ior: 1.5,
    })
  }, [])

  // Wheel rim material
  const rimMaterial = useMemo(() => {
    const isDark = wheel.finish === 'satin_platinum'
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(wheel.color_hex || (isDark ? '#1f2937' : '#d1d5db')),
      metalness: 0.9,
      roughness: isDark ? 0.35 : 0.2,
    })
  }, [wheel])

  // Brake Caliper material
  const caliperMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(caliper.hex || '#dc2626'),
      metalness: caliper.metallic ?? 0.7,
      roughness: caliper.roughness ?? 0.25,
    })
  }, [caliper])

  // Tire rubber material
  const tireMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141416'),
      roughness: 0.85,
      metalness: 0.05,
    })
  }, [])

  // Brake rotor disc material
  const rotorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a1a1aa'),
      metalness: 0.85,
      roughness: 0.3,
    })
  }, [])

  // Underbody chassis & trim material
  const trimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#18181b'),
      metalness: 0.3,
      roughness: 0.6,
    })
  }, [])

  // Helper component for wheel assembly
  const WheelAssembly = ({ x, z, flip = false }: { x: number; z: number; flip?: boolean }) => {
    const spokeCount = wheel.spoke_count || 10
    const spokes = useMemo(() => {
      const arr = []
      for (let i = 0; i < spokeCount; i++) {
        arr.push((i * (Math.PI * 2)) / spokeCount)
      }
      return arr
    }, [spokeCount])

    return (
      <group position={[x, 0.36, z]} rotation={[0, flip ? Math.PI : 0, 0]}>
        {/* Outer Tire */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={tireMaterial}>
          <cylinderGeometry args={[0.36, 0.36, 0.26, 32]} />
        </mesh>

        {/* Rim Barrel */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[flip ? 0.02 : -0.02, 0, 0]} material={rimMaterial}>
          <cylinderGeometry args={[0.26, 0.26, 0.24, 32]} />
        </mesh>

        {/* Center Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[flip ? 0.12 : -0.12, 0, 0]} material={rimMaterial}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 24]} />
        </mesh>

        {/* Dynamic Spokes */}
        <group position={[flip ? 0.11 : -0.11, 0, 0]}>
          {spokes.map((angle, idx) => (
            <mesh
              key={idx}
              rotation={[angle, 0, 0]}
              position={[0, 0, 0]}
              material={rimMaterial}
            >
              <boxGeometry args={[0.02, 0.04, 0.24]} />
            </mesh>
          ))}
        </group>

        {/* Brake Disc Rotor */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[flip ? 0.05 : -0.05, 0, 0]} material={rotorMaterial}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 32]} />
        </mesh>

        {/* Brake Caliper Accent */}
        <mesh position={[flip ? 0.06 : -0.06, 0.13, 0.08]} rotation={[0, 0, Math.PI / 4]} material={caliperMaterial}>
          <boxGeometry args={[0.05, 0.09, 0.06]} />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Lower Car Body */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[1.92, 0.38, 4.3]} />
      </mesh>

      {/* 2. Hood / Front Nose (Sculpted slope) */}
      <mesh position={[0, 0.48, 1.4]} rotation={[-0.14, 0, 0]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[1.86, 0.26, 1.45]} />
      </mesh>

      {/* 3. Front Bumper & Air Dam */}
      <mesh position={[0, 0.28, 2.12]} castShadow receiveShadow material={trimMaterial}>
        <boxGeometry args={[1.88, 0.22, 0.35]} />
      </mesh>
      {/* Front Radiator Grille intake */}
      <mesh position={[0, 0.25, 2.29]} material={trimMaterial}>
        <boxGeometry args={[1.4, 0.14, 0.05]} />
      </mesh>

      {/* 4. Iconic 911 Cabin / Greenhouse (Curved coupe roofline) */}
      <mesh position={[0, 0.88, -0.15]} rotation={[0.05, 0, 0]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[1.5, 0.52, 2.1]} />
      </mesh>

      {/* 5. Windshield Glass (Front) */}
      <mesh position={[0, 0.88, 0.72]} rotation={[-0.6, 0, 0]} material={glassMaterial}>
        <boxGeometry args={[1.44, 0.04, 0.9]} />
      </mesh>

      {/* 6. Rear Fastback Glass (Iconic 911 rear engine slope) */}
      <mesh position={[0, 0.82, -1.05]} rotation={[0.55, 0, 0]} material={glassMaterial}>
        <boxGeometry args={[1.42, 0.04, 1.15]} />
      </mesh>

      {/* 7. Side Windows (Left & Right) */}
      <mesh position={[-0.74, 0.86, -0.12]} material={glassMaterial}>
        <boxGeometry args={[0.04, 0.4, 1.55]} />
      </mesh>
      <mesh position={[0.74, 0.86, -0.12]} material={glassMaterial}>
        <boxGeometry args={[0.04, 0.4, 1.55]} />
      </mesh>

      {/* 8. Rear Arches / Wide Fenders (Muscular hips) */}
      <mesh position={[-0.94, 0.48, -0.9]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[0.22, 0.38, 1.4]} />
      </mesh>
      <mesh position={[0.94, 0.48, -0.9]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[0.22, 0.38, 1.4]} />
      </mesh>

      {/* 9. Front Fenders */}
      <mesh position={[-0.92, 0.46, 1.1]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[0.18, 0.34, 1.25]} />
      </mesh>
      <mesh position={[0.92, 0.46, 1.1]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[0.18, 0.34, 1.25]} />
      </mesh>

      {/* 10. Rear Engine Deck & Diffuser */}
      <mesh position={[0, 0.5, -1.95]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[1.86, 0.32, 0.6]} />
      </mesh>
      <mesh position={[0, 0.24, -2.05]} castShadow receiveShadow material={trimMaterial}>
        <boxGeometry args={[1.84, 0.18, 0.3]} />
      </mesh>

      {/* 11. Lighting Elements */}
      {/* Headlights (Projector Oval LEDs) */}
      <mesh position={[-0.68, 0.58, 2.05]} rotation={[0.4, -0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 24]} />
        <meshStandardMaterial color="#f8fafc" emissive="#ffffff" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[0.68, 0.58, 2.05]} rotation={[0.4, 0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 24]} />
        <meshStandardMaterial color="#f8fafc" emissive="#ffffff" emissiveIntensity={1.8} />
      </mesh>

      {/* Iconic Continuous Rear LED Light Bar */}
      <mesh position={[0, 0.6, -2.18]}>
        <boxGeometry args={[1.72, 0.04, 0.04]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={3.0} />
      </mesh>

      {/* Dual Sports Exhaust Pipes */}
      <mesh position={[-0.45, 0.22, -2.19]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.45, 0.22, -2.19]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Side Mirrors */}
      <mesh position={[-0.92, 0.82, 0.52]} material={bodyMaterial}>
        <boxGeometry args={[0.16, 0.08, 0.18]} />
      </mesh>
      <mesh position={[0.92, 0.82, 0.52]} material={bodyMaterial}>
        <boxGeometry args={[0.16, 0.08, 0.18]} />
      </mesh>

      {/* 12. Four Wheels with Active Calipers and Spoke Geometry */}
      {/* Front-Left */}
      <WheelAssembly x={-0.94} z={1.22} flip={false} />
      {/* Front-Right */}
      <WheelAssembly x={0.94} z={1.22} flip={true} />
      {/* Rear-Left */}
      <WheelAssembly x={-0.96} z={-1.18} flip={false} />
      {/* Rear-Right */}
      <WheelAssembly x={0.96} z={-1.18} flip={true} />
    </group>
  )
}
