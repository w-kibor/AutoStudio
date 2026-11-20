import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { CaliperProperties, PaintProperties, WheelProperties } from '../../types/configurator'

export type MaterialRole = 'auto' | 'paint' | 'wheels' | 'calipers' | 'ignore'

interface GlbCarModelProps {
  url: string
  paint: PaintProperties
  wheel: WheelProperties
  caliper: CaliperProperties
  wireframe?: boolean
  isSpinning?: boolean
  materialRoles?: Record<string, MaterialRole>
  onMaterialsDetected?: (materials: string[]) => void
}

function detectAutoRole(meshName: string, matName: string): 'paint' | 'wheels' | 'calipers' | 'ignore' {
  const combined = `${meshName} ${matName}`.toLowerCase()

  if (combined.includes('caliper') || combined.includes('brembo')) {
    return 'calipers'
  }

  if (
    (combined.includes('rim') ||
      combined.includes('alloy') ||
      combined.includes('spoke') ||
      combined.includes('wheel')) &&
    !combined.includes('tire') &&
    !combined.includes('tyre') &&
    !combined.includes('rubber')
  ) {
    return 'wheels'
  }

  if (
    combined.includes('paint') ||
    combined.includes('body') ||
    combined.includes('carpaint') ||
    combined.includes('chassis') ||
    combined.includes('hood') ||
    combined.includes('door') ||
    combined.includes('fender') ||
    combined.includes('roof') ||
    combined.includes('spoiler') ||
    combined.includes('shell') ||
    combined.includes('exterior')
  ) {
    return 'paint'
  }

  return 'ignore'
}

export const GlbCarModel: React.FC<GlbCarModelProps> = ({
  url,
  paint,
  wheel,
  caliper,
  wireframe = false,
  isSpinning = false,
  materialRoles = {},
  onMaterialsDetected,
}) => {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)

  // Deep-clone scene and clone materials so original GLTF cache stays intact
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    const detectedNames = new Set<string>()

    clone.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => {
          const clonedMat = m.clone()
          if (clonedMat.name) detectedNames.add(clonedMat.name)
          return clonedMat
        })
      } else if (mesh.material) {
        mesh.material = mesh.material.clone()
        if (mesh.material.name) detectedNames.add(mesh.material.name)
      }
    })

    if (onMaterialsDetected) {
      onMaterialsDetected(Array.from(detectedNames))
    }

    return clone
  }, [scene])

  // Auto-normalize scale & center on showroom floor (y = 0)
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const targetScale = 4.4 / maxDim
    const scaledMinY = box.min.y * targetScale

    return {
      scale: targetScale,
      offset: new THREE.Vector3(-center.x * targetScale, -scaledMinY, -center.z * targetScale),
    }
  }, [clonedScene])

  // Apply crisp PBR paint, wheel, caliper, and wireframe updates
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true

      const meshName = mesh.name || ''
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

      materials.forEach((mat) => {
        if (!mat) return
        const matName = mat.name || ''

        if ('wireframe' in mat) {
          ;(mat as THREE.MeshStandardMaterial).wireframe = wireframe
        }

        const override = materialRoles[matName]
        const role =
          override && override !== 'auto' ? override : detectAutoRole(meshName, matName)

        if (role === 'calipers') {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.map = null // Remove baked color texture so caliper color is pure
            mat.vertexColors = false
            mat.emissive.setHex(0x000000)
            mat.color.set(caliper.hex)
            mat.metalness = caliper.metallic ?? 0.75
            mat.roughness = caliper.roughness ?? 0.25
            mat.needsUpdate = true
          }
          return
        }

        if (role === 'wheels') {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.map = null // Remove baked rim tint
            mat.vertexColors = false
            mat.emissive.setHex(0x000000)
            mat.color.set(wheel.color_hex || '#d4d4d8')
            mat.metalness = 0.9
            mat.roughness = wheel.finish === 'satin_black' ? 0.35 : 0.18
            mat.needsUpdate = true
          }
          return
        }

        if (role === 'paint') {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            // Strip any baked base-color texture (e.g. green tint) so paint color is 100% pure
            mat.map = null
            mat.vertexColors = false
            mat.emissive.setHex(0x000000)
            mat.color.set(paint.hex)
            mat.metalness = paint.metallic ?? 0.55
            mat.roughness = paint.roughness ?? 0.18
            mat.envMapIntensity = 1.4
            if (mat instanceof THREE.MeshPhysicalMaterial) {
              mat.clearcoat = paint.clearcoat ?? 1.0
              mat.clearcoatRoughness = paint.clearcoatRoughness ?? 0.05
            }
            mat.needsUpdate = true
          }
        }
      })
    })
  }, [clonedScene, paint, wheel, caliper, wireframe, materialRoles])

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
