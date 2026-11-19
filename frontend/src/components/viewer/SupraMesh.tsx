import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { CaliperProperties, PaintProperties, WheelProperties } from '../../types/configurator'

interface SupraMeshProps {
  paint: PaintProperties
  wheel: WheelProperties
  caliper: CaliperProperties
  headlightsOn?: boolean
  wireframe?: boolean
  isSpinning?: boolean
}

export const SupraMesh: React.FC<SupraMeshProps> = ({
  paint,
  wheel,
  caliper,
  headlightsOn = true,
  wireframe = false,
  isSpinning = false,
}) => {
  const spokeRefs = useRef<Array<THREE.Group | null>>([])

  // Spin wheels gently when turntable is active
  useFrame((_, delta) => {
    if (isSpinning) {
      spokeRefs.current.forEach((group) => {
        if (group) {
          group.rotation.x += delta * 1.4
        }
      })
    }
  })

  // Shared Materials
  const paintMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(paint.hex),
        metalness: paint.metallic ?? 0.45,
        roughness: paint.roughness ?? 0.22,
        clearcoat: paint.clearcoat ?? 0.9,
        clearcoatRoughness: paint.clearcoatRoughness ?? 0.1,
        wireframe,
      }),
    [paint, wireframe]
  )

  const carbonTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x16181d,
        roughness: 0.45,
        metalness: 0.3,
        wireframe,
      }),
    [wireframe]
  )

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x090d14,
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.35,
        transparent: true,
        opacity: 0.92,
        wireframe,
      }),
    [wireframe]
  )

  const headlightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xdbeafe,
        emissiveIntensity: headlightsOn ? 2.2 : 0.0,
        roughness: 0.1,
        wireframe,
      }),
    [headlightsOn, wireframe]
  )

  const taillightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xff1e27,
        emissive: 0xef4444,
        emissiveIntensity: headlightsOn ? 2.0 : 0.15,
        roughness: 0.2,
        wireframe,
      }),
    [headlightsOn, wireframe]
  )

  const wheelSpokeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(wheel.color_hex || '#1e2229'),
        metalness: 0.85,
        roughness: wheel.finish === 'satin_black' ? 0.35 : 0.22,
        wireframe,
      }),
    [wheel, wireframe]
  )

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xe5e7eb,
        metalness: 0.95,
        roughness: 0.15,
        wireframe,
      }),
    [wireframe]
  )

  const tireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x141416,
        roughness: 0.82,
        metalness: 0.05,
        wireframe,
      }),
    [wireframe]
  )

  const caliperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(caliper.hex || '#dc2626'),
        roughness: caliper.roughness ?? 0.3,
        metalness: caliper.metallic ?? 0.4,
        wireframe,
      }),
    [caliper, wireframe]
  )

  // A. Main Lower Fuselage Core (Extruded A90 Side Profile)
  const coreExtrude = useMemo(() => {
    const sideProfile = new THREE.Shape()
    sideProfile.moveTo(-2.12, 0.28)
    sideProfile.lineTo(2.14, 0.24)
    sideProfile.lineTo(2.18, 0.46)
    sideProfile.lineTo(1.85, 0.68)
    sideProfile.lineTo(0.85, 0.82)
    sideProfile.lineTo(-0.35, 0.86)
    sideProfile.lineTo(-1.45, 0.94)
    sideProfile.lineTo(-2.05, 0.98)
    sideProfile.lineTo(-2.15, 0.72)
    sideProfile.closePath()

    const geo = new THREE.ExtrudeGeometry(sideProfile, {
      depth: 1.56,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.08,
      bevelSegments: 3,
    })
    geo.center()
    return geo
  }, [])

  // B. Sculpted Long Hood Bulge
  const hoodGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(1.38, 0.16, 1.35)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      if (z > 0) {
        pos.setX(i, x * 0.84)
        if (y > 0) pos.setY(i, y - 0.07)
      }
      if (y > 0) {
        pos.setY(i, pos.getY(i) - Math.pow(x, 2) * 0.08)
      }
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // C. Cabin Greenhouse
  const cabinGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(1.26, 0.44, 1.65)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      if (y > 0) {
        pos.setX(i, x * 0.82)
        if (z < 0) {
          pos.setY(i, y - 0.14)
          pos.setZ(i, z - 0.15)
        } else {
          pos.setZ(i, z - 0.35)
        }
      }
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // Double-Bubble Roof Panel
  const roofGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(1.04, 0.06, 1.15, 16, 2, 8)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      if (y > 0) {
        const bubble = Math.sin(Math.abs(x) * Math.PI * 1.9) * 0.028
        const slope = z < 0 ? z * 0.11 : 0
        pos.setY(i, y + bubble + slope)
      }
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // D. Muscular Flared Fenders
  const rearFlareGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.55, 20, 14)
    geo.scale(0.36, 0.48, 1.15)
    return geo
  }, [])

  const frontFlareGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.55, 20, 14)
    geo.scale(0.3, 0.42, 1.05)
    return geo
  }, [])

  // Wheel Positions
  const wheelPositions = [
    { x: 0.84, y: 0.34, z: 1.32, right: true },
    { x: -0.84, y: 0.34, z: 1.32, right: false },
    { x: 0.87, y: 0.34, z: -1.26, right: true },
    { x: -0.87, y: 0.34, z: -1.26, right: false },
  ]

  const spokeCount = wheel.spoke_count || 10
  const spokeAngles = useMemo(
    () => Array.from({ length: spokeCount }, (_, i) => (i / spokeCount) * Math.PI * 2),
    [spokeCount]
  )

  return (
    <group>
      {/* Main Fuselage Core */}
      <mesh
        geometry={coreExtrude}
        material={paintMat}
        rotation={[0, Math.PI / 2, 0]}
        position={[0, 0.61, 0]}
        castShadow
        receiveShadow
      />

      {/* Sculpted Hood */}
      <mesh
        geometry={hoodGeo}
        material={paintMat}
        position={[0, 0.78, 1.32]}
        rotation={[0.06, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Cabin Greenhouse & Double-Bubble Roof */}
      <mesh
        geometry={cabinGeo}
        material={glassMat}
        position={[0, 1.04, -0.18]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={roofGeo}
        material={paintMat}
        position={[0, 1.25, -0.32]}
        castShadow
        receiveShadow
      />

      {/* Flared Rear Haunches & Front Arches */}
      <mesh geometry={rearFlareGeo} material={paintMat} position={[0.76, 0.64, -1.26]} castShadow receiveShadow />
      <mesh geometry={rearFlareGeo} material={paintMat} position={[-0.76, 0.64, -1.26]} castShadow receiveShadow />
      <mesh geometry={frontFlareGeo} material={paintMat} position={[0.74, 0.58, 1.32]} castShadow receiveShadow />
      <mesh geometry={frontFlareGeo} material={paintMat} position={[-0.74, 0.58, 1.32]} castShadow receiveShadow />

      {/* Front Splitter & Center Grille */}
      <mesh material={carbonTrimMat} position={[0, 0.21, 2.02]} castShadow receiveShadow>
        <boxGeometry args={[1.82, 0.05, 0.45]} />
      </mesh>
      <mesh material={carbonTrimMat} position={[0, 0.36, 2.15]} castShadow receiveShadow>
        <boxGeometry args={[0.84, 0.22, 0.12]} />
      </mesh>

      {/* Side Intakes, Door Scoops, Side Skirts */}
      {[-0.64, 0.64].map((xPos, idx) => (
        <React.Fragment key={idx}>
          <mesh
            material={carbonTrimMat}
            position={[xPos, 0.37, 2.08]}
            rotation={[0, xPos > 0 ? 0.25 : -0.25, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.38, 0.2, 0.14]} />
          </mesh>
          <mesh
            material={carbonTrimMat}
            position={[xPos > 0 ? 0.87 : -0.87, 0.62, -0.68]}
            rotation={[-0.2, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.06, 0.34, 0.42]} />
          </mesh>
          <mesh
            material={carbonTrimMat}
            position={[xPos > 0 ? 0.86 : -0.86, 0.22, 0.02]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.12, 0.06, 1.85]} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Rear Diffuser, F1 Rain Light, Dual Exhausts & Ducktail */}
      <mesh material={carbonTrimMat} position={[0, 0.3, -2.06]} castShadow receiveShadow>
        <boxGeometry args={[1.66, 0.24, 0.32]} />
      </mesh>
      <mesh material={taillightMat} position={[0, 0.28, -2.22]}>
        <boxGeometry args={[0.14, 0.08, 0.04]} />
      </mesh>
      {[-0.54, 0.54].map((xPos, idx) => (
        <mesh
          key={idx}
          material={chromeMat}
          position={[xPos, 0.28, -2.18]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.075, 0.075, 0.18, 20]} />
        </mesh>
      ))}
      <mesh
        material={paintMat}
        position={[0, 0.99, -2.02]}
        rotation={[0.28, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.42, 0.08, 0.22]} />
      </mesh>

      {/* 6-Lens LED Headlights, Swooping Taillights & Mirrors */}
      {[-0.62, 0.62].map((xPos, idx) => (
        <React.Fragment key={idx}>
          <group
            position={[xPos, 0.58, 1.98]}
            rotation={[0.15, xPos > 0 ? 0.34 : -0.34, 0]}
          >
            <mesh material={carbonTrimMat} castShadow receiveShadow>
              <boxGeometry args={[0.42, 0.11, 0.14]} />
            </mesh>
            <mesh material={headlightMat} position={[0, -0.035, 0.065]}>
              <boxGeometry args={[0.4, 0.025, 0.03]} />
            </mesh>
            {[-0.11, 0, 0.11].map((lx, lIdx) => (
              <mesh key={lIdx} material={headlightMat} position={[lx, 0.015, 0.065]}>
                <boxGeometry args={[0.07, 0.045, 0.03]} />
              </mesh>
            ))}
          </group>

          <group
            position={[xPos * 0.96, 0.76, -2.11]}
            rotation={[0, xPos > 0 ? -0.22 : 0.22, 0]}
          >
            <mesh material={carbonTrimMat} castShadow receiveShadow>
              <boxGeometry args={[0.46, 0.12, 0.08]} />
            </mesh>
            <mesh material={taillightMat} position={[0, 0, -0.035]}>
              <boxGeometry args={[0.42, 0.055, 0.03]} />
            </mesh>
          </group>

          <mesh
            material={carbonTrimMat}
            position={[xPos > 0 ? 0.85 : -0.85, 0.92, 0.42]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.14, 0.04, 0.06]} />
          </mesh>
          <mesh
            material={carbonTrimMat}
            position={[xPos > 0 ? 0.92 : -0.92, 0.94, 0.4]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.16, 0.09, 0.14]} />
          </mesh>
        </React.Fragment>
      ))}

      {/* 19-inch Forged Multi-Spoke Wheels + Brake Calipers */}
      {wheelPositions.map((wp, idx) => (
        <group key={idx} position={[wp.x, wp.y, wp.z]}>
          <mesh material={tireMat} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.26, 32]} />
          </mesh>
          <mesh material={chromeMat} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.265, 24]} />
          </mesh>
          <mesh material={chromeMat} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.19, 0.19, 0.04, 24]} />
          </mesh>

          <group
            ref={(el) => {
              spokeRefs.current[idx] = el
            }}
          >
            {spokeAngles.map((angle, sIdx) => (
              <mesh
                key={sIdx}
                material={wheelSpokeMat}
                position={[wp.right ? 0.125 : -0.125, 0, 0]}
                rotation={[angle, 0, 0]}
              >
                <boxGeometry args={[0.03, 0.47, 0.022]} />
              </mesh>
            ))}
            <mesh material={carbonTrimMat} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.055, 0.055, 0.28, 16]} />
            </mesh>
          </group>

          <mesh
            material={caliperMat}
            position={[wp.right ? 0.08 : -0.08, 0.08, -0.11]}
          >
            <boxGeometry args={[0.08, 0.14, 0.09]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
