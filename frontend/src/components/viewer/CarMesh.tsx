import React, { useMemo } from 'react'
import * as THREE from 'three'
import type { CaliperProperties, PaintProperties, WheelProperties } from '../../types/configurator'

interface CarMeshProps {
  paint: PaintProperties
  wheel: WheelProperties
  caliper: CaliperProperties
  bodyStyle?: 'coupe' | 'gt' | 'sedan'
}

export const CarMesh: React.FC<CarMeshProps> = ({
  paint,
  wheel,
  caliper,
  bodyStyle = 'gt',
}) => {
  // Proportions adapted to vehicle silhouette
  const dimensions = useMemo(() => {
    if (bodyStyle === 'sedan') {
      return {
        bodyLength: 4.85,
        cabinLength: 2.55,
        cabinZ: -0.05,
        hoodZ: 1.55,
        wheelBaseFront: 1.45,
        wheelBaseRear: -1.45,
      }
    }
    if (bodyStyle === 'gt') {
      return {
        bodyLength: 4.55,
        cabinLength: 1.95,
        cabinZ: -0.35,
        hoodZ: 1.48,
        wheelBaseFront: 1.38,
        wheelBaseRear: -1.32,
      }
    }
    // coupe (911)
    return {
      bodyLength: 4.3,
      cabinLength: 2.1,
      cabinZ: -0.15,
      hoodZ: 1.4,
      wheelBaseFront: 1.22,
      wheelBaseRear: -1.18,
    }
  }, [bodyStyle])

  const bodyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paint.hex),
      metalness: paint.metallic ?? 0.5,
      roughness: paint.roughness ?? 0.2,
      clearcoat: paint.clearcoat ?? 1.0,
      clearcoatRoughness: paint.clearcoatRoughness ?? 0.05,
      reflectivity: 0.95,
    })
  }, [paint])

  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#06090f'),
      metalness: 0.15,
      roughness: 0.04,
      transmission: 0.55,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.95,
      ior: 1.52,
    })
  }, [])

  const rimMaterial = useMemo(() => {
    const isDark = wheel.finish === 'satin_black' || wheel.finish === 'satin_platinum'
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(wheel.color_hex || (isDark ? '#18181b' : '#d4d4d8')),
      metalness: 0.92,
      roughness: isDark ? 0.35 : 0.18,
    })
  }, [wheel])

  const caliperMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(caliper.hex || '#b91c1c'),
      metalness: caliper.metallic ?? 0.75,
      roughness: caliper.roughness ?? 0.22,
    })
  }, [caliper])

  const tireMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#111113'),
      roughness: 0.88,
      metalness: 0.05,
    })
  }, [])

  const rotorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a1a1aa'),
      metalness: 0.88,
      roughness: 0.28,
    })
  }, [])

  const trimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#121215'),
      metalness: 0.4,
      roughness: 0.5,
    })
  }, [])

  const chromeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e4e4e7'),
      metalness: 0.95,
      roughness: 0.12,
    })
  }, [])

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
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={tireMaterial}>
          <cylinderGeometry args={[0.36, 0.36, 0.26, 36]} />
        </mesh>

        <mesh rotation={[0, 0, Math.PI / 2]} position={[flip ? 0.02 : -0.02, 0, 0]} material={rimMaterial}>
          <cylinderGeometry args={[0.265, 0.265, 0.24, 36]} />
        </mesh>

        <mesh rotation={[0, 0, Math.PI / 2]} position={[flip ? 0.12 : -0.12, 0, 0]} material={rimMaterial}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 24]} />
        </mesh>

        <group position={[flip ? 0.11 : -0.11, 0, 0]}>
          {spokes.map((angle, idx) => (
            <mesh key={idx} rotation={[angle, 0, 0]} material={rimMaterial}>
              <boxGeometry args={[0.02, 0.036, 0.24]} />
            </mesh>
          ))}
        </group>

        <mesh rotation={[0, 0, Math.PI / 2]} position={[flip ? 0.05 : -0.05, 0, 0]} material={rotorMaterial}>
          <cylinderGeometry args={[0.205, 0.205, 0.02, 32]} />
        </mesh>

        <mesh position={[flip ? 0.06 : -0.06, 0.13, 0.08]} rotation={[0, 0, Math.PI / 4]} material={caliperMaterial}>
          <boxGeometry args={[0.05, 0.09, 0.06]} />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Main Lower Car Body */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[1.94, 0.38, dimensions.bodyLength]} />
      </mesh>

      {/* Sculpted Hood */}
      <mesh
        position={[0, 0.48, dimensions.hoodZ]}
        rotation={[-0.12, 0, 0]}
        castShadow
        receiveShadow
        material={bodyMaterial}
      >
        <boxGeometry args={[1.86, 0.26, 1.5]} />
      </mesh>

      {/* Front Grille & Chrome / Trim Accent */}
      <mesh position={[0, 0.32, dimensions.bodyLength / 2 + 0.02]} material={trimMaterial}>
        <boxGeometry args={[1.45, 0.2, 0.06]} />
      </mesh>
      <mesh position={[0, 0.34, dimensions.bodyLength / 2 + 0.05]} material={chromeMaterial}>
        <boxGeometry args={[1.38, 0.025, 0.02]} />
      </mesh>

      {/* Front Bumper Splitter */}
      <mesh position={[0, 0.24, dimensions.bodyLength / 2 - 0.1]} castShadow receiveShadow material={trimMaterial}>
        <boxGeometry args={[1.9, 0.18, 0.35]} />
      </mesh>

      {/* Cabin / Greenhouse */}
      <mesh
        position={[0, 0.88, dimensions.cabinZ]}
        rotation={[bodyStyle === 'sedan' ? 0 : 0.04, 0, 0]}
        castShadow
        receiveShadow
        material={bodyMaterial}
      >
        <boxGeometry args={[1.52, 0.52, dimensions.cabinLength]} />
      </mesh>

      {/* Windshield Glass */}
      <mesh
        position={[0, 0.88, dimensions.cabinZ + dimensions.cabinLength / 2 - 0.18]}
        rotation={[-0.58, 0, 0]}
        material={glassMaterial}
      >
        <boxGeometry args={[1.46, 0.04, 0.92]} />
      </mesh>

      {/* Rear Glass */}
      <mesh
        position={[0, 0.83, dimensions.cabinZ - dimensions.cabinLength / 2 + 0.12]}
        rotation={[0.52, 0, 0]}
        material={glassMaterial}
      >
        <boxGeometry args={[1.44, 0.04, 1.1]} />
      </mesh>

      {/* Side Windows */}
      <mesh position={[-0.75, 0.86, dimensions.cabinZ]} material={glassMaterial}>
        <boxGeometry args={[0.04, 0.4, dimensions.cabinLength * 0.78]} />
      </mesh>
      <mesh position={[0.75, 0.86, dimensions.cabinZ]} material={glassMaterial}>
        <boxGeometry args={[0.04, 0.4, dimensions.cabinLength * 0.78]} />
      </mesh>

      {/* Rear Fenders */}
      <mesh position={[-0.95, 0.48, dimensions.wheelBaseRear + 0.2]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[0.22, 0.38, 1.45]} />
      </mesh>
      <mesh position={[0.95, 0.48, dimensions.wheelBaseRear + 0.2]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[0.22, 0.38, 1.45]} />
      </mesh>

      {/* Front Fenders */}
      <mesh position={[-0.93, 0.46, dimensions.wheelBaseFront - 0.1]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[0.18, 0.34, 1.25]} />
      </mesh>
      <mesh position={[0.93, 0.46, dimensions.wheelBaseFront - 0.1]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[0.18, 0.34, 1.25]} />
      </mesh>

      {/* Rear Deck & Diffuser */}
      <mesh position={[0, 0.5, -dimensions.bodyLength / 2 + 0.22]} castShadow receiveShadow material={bodyMaterial}>
        <boxGeometry args={[1.88, 0.32, 0.65]} />
      </mesh>
      <mesh position={[0, 0.24, -dimensions.bodyLength / 2 + 0.12]} castShadow receiveShadow material={trimMaterial}>
        <boxGeometry args={[1.86, 0.18, 0.3]} />
      </mesh>

      {/* LED Headlights */}
      <mesh position={[-0.68, 0.56, dimensions.bodyLength / 2 - 0.08]} rotation={[0.35, -0.1, 0]}>
        <boxGeometry args={[0.32, 0.07, 0.08]} />
        <meshStandardMaterial color="#f8fafc" emissive="#ffffff" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[0.68, 0.56, dimensions.bodyLength / 2 - 0.08]} rotation={[0.35, 0.1, 0]}>
        <boxGeometry args={[0.32, 0.07, 0.08]} />
        <meshStandardMaterial color="#f8fafc" emissive="#ffffff" emissiveIntensity={2.0} />
      </mesh>

      {/* Continuous Rear LED Light Bar */}
      <mesh position={[0, 0.58, -dimensions.bodyLength / 2 - 0.02]}>
        <boxGeometry args={[1.76, 0.04, 0.04]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={3.2} />
      </mesh>

      {/* Quad Exhaust Tips */}
      <mesh position={[-0.55, 0.22, -dimensions.bodyLength / 2 - 0.02]} rotation={[Math.PI / 2, 0, 0]} material={chromeMaterial}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
      </mesh>
      <mesh position={[-0.42, 0.22, -dimensions.bodyLength / 2 - 0.02]} rotation={[Math.PI / 2, 0, 0]} material={chromeMaterial}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
      </mesh>
      <mesh position={[0.42, 0.22, -dimensions.bodyLength / 2 - 0.02]} rotation={[Math.PI / 2, 0, 0]} material={chromeMaterial}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
      </mesh>
      <mesh position={[0.55, 0.22, -dimensions.bodyLength / 2 - 0.02]} rotation={[Math.PI / 2, 0, 0]} material={chromeMaterial}>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
      </mesh>

      {/* Side Mirrors */}
      <mesh position={[-0.92, 0.82, dimensions.cabinZ + 0.65]} material={bodyMaterial}>
        <boxGeometry args={[0.16, 0.08, 0.18]} />
      </mesh>
      <mesh position={[0.92, 0.82, dimensions.cabinZ + 0.65]} material={bodyMaterial}>
        <boxGeometry args={[0.16, 0.08, 0.18]} />
      </mesh>

      {/* Wheels */}
      <WheelAssembly x={-0.95} z={dimensions.wheelBaseFront} flip={false} />
      <WheelAssembly x={0.95} z={dimensions.wheelBaseFront} flip={true} />
      <WheelAssembly x={-0.97} z={dimensions.wheelBaseRear} flip={false} />
      <WheelAssembly x={0.97} z={dimensions.wheelBaseRear} flip={true} />
    </group>
  )
}
