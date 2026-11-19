import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Eye, RotateCw } from 'lucide-react'
import React, { useRef, useState } from 'react'
import type { CaliperProperties, PaintProperties, WheelProperties } from '../../types/configurator'
import { CarMesh } from './CarMesh'

interface VehicleViewerProps {
  paint: PaintProperties
  wheel: WheelProperties
  caliper: CaliperProperties
  cameraPreset?: string
}

export type CameraPresetKey = 'threeQuarter' | 'side' | 'rear' | 'wheel' | 'top'

export const VehicleViewer: React.FC<VehicleViewerProps> = ({ paint, wheel, caliper }) => {
  const [autoRotate, setAutoRotate] = useState(false)
  const controlsRef = useRef<any>(null)

  const cameraPresets: Record<CameraPresetKey, { position: [number, number, number]; target: [number, number, number] }> = {
    threeQuarter: { position: [3.8, 1.4, 3.8], target: [0, 0.4, 0] },
    side: { position: [4.6, 0.7, 0], target: [0, 0.4, 0] },
    rear: { position: [-3.2, 1.3, -3.8], target: [0, 0.4, 0] },
    wheel: { position: [2.1, 0.5, 1.8], target: [0.94, 0.36, 1.22] },
    top: { position: [0.1, 5.8, 0.1], target: [0, 0.2, 0] },
  }

  const handleApplyPreset = (key: CameraPresetKey) => {
    if (!controlsRef.current) return
    const preset = cameraPresets[key]
    controlsRef.current.object.position.set(...preset.position)
    controlsRef.current.target.set(...preset.target)
    controlsRef.current.update()
  }

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[640px] bg-gradient-to-b from-[#12141a] via-[#0b0c10] to-[#07080a] select-none overflow-hidden rounded-2xl border border-zinc-800/80 shadow-2xl">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [3.8, 1.4, 3.8], fov: 42 }}
        gl={{ antialias: true, toneMappingExposure: 1.1 }}
      >
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.7} />
        
        {/* Main Key Sun Light */}
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Soft Fill Light */}
        <directionalLight position={[-6, 4, -4]} intensity={0.8} />

        {/* Top Rim Light */}
        <directionalLight position={[0, 7, 0]} intensity={0.6} />

        {/* Floor Horizon & Ground Light */}
        <hemisphereLight args={['#ffffff', '#1e293b', 0.6]} />

        {/* The 3D Sports Car Assembly */}
        <CarMesh paint={paint} wheel={wheel} caliper={caliper} />

        {/* Soft Realistic Contact Shadow underneath */}
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.85}
          scale={9}
          blur={1.8}
          far={3}
          resolution={1024}
          color="#000000"
        />

        {/* Smooth Orbit Controls with floor limit */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.06}
          minDistance={2.4}
          maxDistance={8.5}
          maxPolarAngle={Math.PI / 2 - 0.04} // Prevents camera from dipping beneath the studio floor
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
        />
      </Canvas>

      {/* Floating Viewport Controls Header / Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 text-xs font-medium text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Interactive 3D Engine
        </span>
      </div>

      {/* Viewport Control Actions */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md border transition-all ${
            autoRotate
              ? 'bg-blue-600/90 text-white border-blue-500 shadow-lg shadow-blue-500/20'
              : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60 hover:bg-zinc-800'
          }`}
          title="Toggle 360 Turntable Auto-Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          {autoRotate ? 'Rotating' : 'Turntable'}
        </button>
      </div>

      {/* Camera Preset Quick Angles */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-zinc-900/85 backdrop-blur-md border border-zinc-700/60 shadow-xl">
        <span className="text-[11px] font-semibold text-zinc-400 px-2 flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> Angles
        </span>
        <button
          onClick={() => handleApplyPreset('threeQuarter')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Front 3/4
        </button>
        <button
          onClick={() => handleApplyPreset('side')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Profile
        </button>
        <button
          onClick={() => handleApplyPreset('rear')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Rear 3/4
        </button>
        <button
          onClick={() => handleApplyPreset('wheel')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Wheels
        </button>
        <button
          onClick={() => handleApplyPreset('top')}
          className="px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Top Aero
        </button>
      </div>

      {/* Hint overlay */}
      <div className="absolute bottom-4 right-4 z-10 hidden md:block text-[11px] text-zinc-400/80 bg-zinc-900/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-zinc-800/60 pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}
