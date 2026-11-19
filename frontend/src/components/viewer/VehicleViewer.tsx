import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Box, Eye, Lightbulb, Moon, RotateCw, Sun, Upload, X } from 'lucide-react'
import React, { Suspense, useRef, useState } from 'react'
import type { CaliperProperties, PaintProperties, WheelProperties } from '../../types/configurator'
import { CarMesh } from './CarMesh'
import { GlbCarModel } from './GlbCarModel'
import { SupraMesh } from './SupraMesh'

interface VehicleViewerProps {
  paint: PaintProperties
  wheel: WheelProperties
  caliper: CaliperProperties
  bodyStyle?: 'coupe' | 'gt' | 'sedan' | 'supra'
  manufacturerName: string
  vehicleName: string
  year: number
}

export type CameraPresetKey = 'threeQuarter' | 'side' | 'rear' | 'wheel' | 'top'

export const VehicleViewer: React.FC<VehicleViewerProps> = ({
  paint,
  wheel,
  caliper,
  bodyStyle = 'supra',
  manufacturerName,
  vehicleName,
  year,
}) => {
  const [autoRotate, setAutoRotate] = useState(true)
  const [studioLight, setStudioLight] = useState<'atelier' | 'daylight'>('atelier')
  const [headlightsOn, setHeadlightsOn] = useState(true)
  const [wireframe, setWireframe] = useState(false)
  const [customGlbUrl, setCustomGlbUrl] = useState<string | null>(null)
  const [customGlbName, setCustomGlbName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const controlsRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cameraPresets: Record<
    CameraPresetKey,
    { position: [number, number, number]; target: [number, number, number] }
  > = {
    threeQuarter: { position: [4.6, 1.7, 5.0], target: [0, 0.6, 0] },
    side: { position: [5.2, 0.78, 0], target: [0, 0.55, 0] },
    rear: { position: [-3.8, 1.45, -4.6], target: [0, 0.55, 0] },
    wheel: { position: [2.2, 0.55, 2.0], target: [0.84, 0.34, 1.32] },
    top: { position: [0.1, 6.2, 0.1], target: [0, 0.2, 0] },
  }

  const handleApplyPreset = (key: CameraPresetKey) => {
    if (!controlsRef.current) return
    const preset = cameraPresets[key]
    controlsRef.current.object.position.set(...preset.position)
    controlsRef.current.target.set(...preset.target)
    controlsRef.current.update()
  }

  const handleFileLoad = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      return
    }
    if (customGlbUrl) {
      URL.revokeObjectURL(customGlbUrl)
    }
    const objectUrl = URL.createObjectURL(file)
    setCustomGlbUrl(objectUrl)
    setCustomGlbName(file.name)
  }

  const handleClearGlb = () => {
    if (customGlbUrl) {
      URL.revokeObjectURL(customGlbUrl)
    }
    setCustomGlbUrl(null)
    setCustomGlbName(null)
  }

  const isDaylight = studioLight === 'daylight'

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFileLoad(file)
      }}
      className={`relative w-full h-full min-h-[520px] lg:min-h-[680px] select-none overflow-hidden transition-colors duration-700 ${
        isDaylight
          ? 'bg-[radial-gradient(circle_at_50%_45%,#27272a_0%,#111113_55%,#000000_100%)]'
          : 'bg-[radial-gradient(circle_at_50%_45%,#18181b_0%,#09090b_55%,#000000_100%)]'
      } border ${isDragging ? 'border-white ring-2 ring-white/40' : 'border-white/10'}`}
    >
      {/* Hidden File Input for .GLB/.GLTF */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileLoad(file)
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [4.6, 1.7, 5.0], fov: 40 }}
        gl={{ antialias: true, toneMappingExposure: isDaylight ? 1.35 : 1.12 }}
      >
        <ambientLight intensity={isDaylight ? 1.05 : 0.7} />

        <directionalLight
          position={[5, 8, 6]}
          intensity={isDaylight ? 2.6 : 2.1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0005}
        />

        <directionalLight position={[-6, 4, -5]} color="#93c5fd" intensity={isDaylight ? 1.4 : 1.1} />
        <directionalLight position={[0, 8, 0]} intensity={isDaylight ? 0.95 : 0.65} />
        <hemisphereLight args={[isDaylight ? '#ffffff' : '#e4e4e7', '#181b20', isDaylight ? 0.9 : 0.65]} />

        <Suspense fallback={null}>
          {customGlbUrl ? (
            <GlbCarModel
              url={customGlbUrl}
              paint={paint}
              wheel={wheel}
              caliper={caliper}
              wireframe={wireframe}
              isSpinning={autoRotate}
            />
          ) : bodyStyle === 'supra' ? (
            <SupraMesh
              paint={paint}
              wheel={wheel}
              caliper={caliper}
              headlightsOn={headlightsOn}
              wireframe={wireframe}
              isSpinning={autoRotate}
            />
          ) : (
            <CarMesh paint={paint} wheel={wheel} caliper={caliper} bodyStyle={bodyStyle} />
          )}
        </Suspense>

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.9}
          scale={11}
          blur={1.7}
          far={3.5}
          resolution={1024}
          color="#000000"
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.06}
          minDistance={2.8}
          maxDistance={10.5}
          maxPolarAngle={Math.PI / 2 - 0.02}
          autoRotate={customGlbUrl ? false : autoRotate}
          autoRotateSpeed={0.85}
        />
      </Canvas>

      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none">
          <Upload className="w-10 h-10 text-white mb-3 animate-bounce" />
          <p className="font-serif text-2xl text-white">Drop .GLB / .GLTF Vehicle Model</p>
          <p className="text-xs text-zinc-400 mt-1">AutoStudio will auto-scale and bind paint & wheel shaders</p>
        </div>
      )}

      {/* Top-Left Editorial Vehicle Title Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 font-medium">
          {year} • {manufacturerName}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-white mt-1">
          {vehicleName}
        </h2>
        {customGlbName && (
          <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/20 text-[10px] uppercase tracking-wider text-zinc-200 pointer-events-auto">
            <span>Loaded: {customGlbName}</span>
            <button onClick={handleClearGlb} className="hover:text-white" title="Revert to procedural mesh">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Top-Right Studio Controls */}
      <div className="absolute top-6 right-6 z-10 flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-zinc-200 border border-white text-[11px] uppercase tracking-wider font-semibold transition-all"
          title="Load a real .GLB or .GLTF 3D vehicle model (e.g. A90 Supra from Sketchfab)"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Load .GLB</span>
        </button>

        {!customGlbUrl && (
          <button
            onClick={() => setHeadlightsOn(!headlightsOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md border text-[11px] uppercase tracking-wider font-medium transition-all ${
              headlightsOn
                ? 'bg-white text-black border-white'
                : 'bg-black/60 text-zinc-300 border-white/15 hover:bg-black/90 hover:text-white'
            }`}
            title="Toggle LED Headlights & Taillights"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lights</span>
          </button>
        )}

        <button
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md border text-[11px] uppercase tracking-wider font-medium transition-all ${
            wireframe
              ? 'bg-white text-black border-white'
              : 'bg-black/60 text-zinc-300 border-white/15 hover:bg-black/90 hover:text-white'
          }`}
          title="Toggle Wireframe Mesh"
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wireframe</span>
        </button>

        <button
          onClick={() => setStudioLight(isDaylight ? 'atelier' : 'daylight')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/15 backdrop-blur-md text-[11px] uppercase tracking-wider font-medium transition-all"
          title="Toggle Studio Lighting"
        >
          {isDaylight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isDaylight ? 'Night' : 'Daylight'}</span>
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-md border text-[11px] uppercase tracking-wider font-medium transition-all ${
            autoRotate
              ? 'bg-white text-black border-white'
              : 'bg-black/60 text-zinc-300 border-white/15 hover:bg-black/90 hover:text-white'
          }`}
          title="Toggle 360° Turntable"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{autoRotate ? '360° ON' : '360°'}</span>
        </button>
      </div>

      {/* Bottom-Center Camera Angle Presets */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 bg-black/75 backdrop-blur-xl border border-white/15 shadow-2xl">
        <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 px-2.5 hidden sm:flex items-center gap-1.5">
          <Eye className="w-3 h-3" /> View
        </span>
        {(
          [
            { key: 'threeQuarter', label: 'Exterior 3/4' },
            { key: 'side', label: 'Profile' },
            { key: 'rear', label: 'Rear' },
            { key: 'wheel', label: 'Wheels' },
            { key: 'top', label: 'Top' },
          ] as const
        ).map((preset) => (
          <button
            key={preset.key}
            onClick={() => handleApplyPreset(preset.key)}
            className="px-3 py-1.5 text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Subtle Bottom-Right Interaction Hint */}
      <div className="absolute bottom-5 right-6 z-10 hidden xl:block text-[10px] uppercase tracking-[0.15em] text-zinc-500 pointer-events-none">
        Drag .GLB to load • Scroll to Zoom
      </div>
    </div>
  )
}
