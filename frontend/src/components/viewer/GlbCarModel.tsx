import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { CaliperProperties, PaintProperties, WheelProperties } from '../../types/configurator'

interface GlbCarModelProps {
  url: string
  paint: PaintProperties
  wheel: WheelProperties
  caliper: CaliperProperties
  wireframe?: boolean
  isSpinning?: boolean
}

export const GlbCarModel: React.FC<GlbCarModelProps> = ({
  url,
  paint,
  wheel,
  caliper,
  wireframe = false,
  isSpinning = false,
}) => {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  // Clone scene so we never mutate cached GLTF across renders/reloads
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  // Auto-normalize scale & center on showroom floor (y = 0)
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z) || 1
    // Target ~4.4 meters (standard sports car length)
    const targetScale = 4.4 / maxDim

    const scaledMinY = box.min.y * targetScale
    return {
      scale: targetScale,
      offset: new THREE.Vector3(
        -center.x * targetScale,
        -scaledMinY,
        -center.z * targetScale
      ),
    }
  }, [clonedScene])

  // Apply dynamic paint, wheel, caliper, and wireframe materials
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true

      const meshName = (mesh.name || '').toLowerCase()
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

      materials.forEach((mat) => {
        if (!mat) return
        const matName = (mat.name || '').toLowerCase()
        const combined = `${meshName} ${matName}`

        if ('wireframe' in mat) {
          ;(mat as THREE.MeshStandardMaterial).wireframe = wireframe
        }

        // Match Brake Calipers
        if (combined.includes('caliper') || combined.includes('brembo')) {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.color.set(caliper.hex)
            mat.metalness = caliper.metallic ?? 0.7
            mat.roughness = caliper.roughness ?? 0.25
            mat.needsUpdate = true
          }
          return
        }

        // Match Rims / Alloy Wheels (exclude rubber tires)
        if (
          (combined.includes('rim') || combined.includes('alloy') || combined.includes('spoke') || combined.includes('wheel')) &&
          !combined.includes('tire') &&
          !combined.includes('tyre') &&
          !combined.includes('rubber')
        ) {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.color.set(wheel.color_hex || '#d4d4d8')
            mat.metalness = 0.9
            mat.roughness = wheel.finish === 'satin_black' ? 0.35 : 0.2
            mat.needsUpdate = true
          }
          return
        }

        // Match Car Body Paint
        if (
          combined.includes('paint') ||
          combined.includes('body') ||
          combined.includes('carpaint') ||
          combined.includes('chassis') ||
          combined.includes('hood') ||
          combined.includes('door') ||
          combined.includes('fender') ||
          combined.includes('roof') ||
          combined.includes('spoiler')
        ) {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.color.set(paint.hex)
            mat.metalness = paint.metallic ?? 0.5
            mat.roughness = paint.roughness ?? 0.2
            if (mat instanceof THREE.MeshPhysicalMaterial) {
              mat.clearcoat = paint.clearcoat ?? 1.0
              mat.clearcoatRoughness = paint.clearcoatRoughness ?? 0.05
            }
            mat.needsUpdate = true
          }
        }
      })
    })
  }, [clonedScene, paint, wheel, caliper, wireframe])

  useFrame((_, delta) => {
    if (isSpinning && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        scale={[scale, scale, scale]}
        position={[offset.x, offset.y, offset.z]}
      />
    </group>
  )
}
