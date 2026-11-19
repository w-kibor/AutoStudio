import {
  Activity,
  Check,
  Disc,
  Info,
  Palette,
  RotateCcw,
  Share2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CaliperSelector } from './components/customizer/CaliperSelector'
import { PaintSelector } from './components/customizer/PaintSelector'
import { SaveModal } from './components/customizer/SaveModal'
import { VehicleSpecsPanel } from './components/customizer/VehicleSpecsPanel'
import { WheelSelector } from './components/customizer/WheelSelector'
import { Navbar } from './components/Navbar'
import { VehicleViewer } from './components/viewer/VehicleViewer'
import {
  fallbackPorscheData,
  fetchConfiguratorData,
  saveVehicleConfiguration,
} from './services/api'
import type {
  CaliperProperties,
  ConfiguratorData,
  CustomizationOption,
  PaintProperties,
  SelectedConfiguration,
  WheelProperties,
} from './types/configurator'

export function App() {
  const [data, setData] = useState<ConfiguratorData>(fallbackPorscheData)
  const [selectedOptions, setSelectedOptions] = useState<SelectedConfiguration>(
    fallbackPorscheData.default_configuration.selected_options
  )
  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'calipers' | 'specs'>('paint')
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [resetNotification, setResetNotification] = useState(false)

  // Fetch configurator payload from Laravel backend
  useEffect(() => {
    fetchConfiguratorData('porsche-911-carrera').then((res) => {
      setData(res)
      if (res.default_configuration?.selected_options) {
        setSelectedOptions(res.default_configuration.selected_options)
      }
    })
  }, [])

  // Resolve active paint, wheel, and caliper properties
  const activePaintOption = useMemo(() => {
    const code = selectedOptions.paint
    return (
      data.customization_categories.paint.options.find((o) => o.code === code) ||
      data.customization_categories.paint.options[0]
    )
  }, [data, selectedOptions.paint])

  const activeWheelOption = useMemo(() => {
    const code = selectedOptions.wheels
    return (
      data.customization_categories.wheels.options.find((o) => o.code === code) ||
      data.customization_categories.wheels.options[0]
    )
  }, [data, selectedOptions.wheels])

  const activeCaliperOption = useMemo(() => {
    const code = selectedOptions.calipers
    return (
      data.customization_categories.calipers.options.find((o) => o.code === code) ||
      data.customization_categories.calipers.options[0]
    )
  }, [data, selectedOptions.calipers])

  // Calculate dynamic total price
  const totalPrice = useMemo(() => {
    let price = data.vehicle.base_price
    price += activePaintOption.price_delta
    price += activeWheelOption.price_delta
    price += activeCaliperOption.price_delta
    return price
  }, [data.vehicle.base_price, activePaintOption, activeWheelOption, activeCaliperOption])

  // Handle option selection
  const handleSelectOption = (categoryCode: string, option: CustomizationOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [categoryCode]: option.code,
    }))
  }

  // Reset to original factory defaults
  const handleReset = () => {
    setSelectedOptions(data.default_configuration.selected_options)
    setResetNotification(true)
    setTimeout(() => setResetNotification(false), 2000)
  }

  // Save build handler
  const handleSaveBuild = async (name: string) => {
    const result = await saveVehicleConfiguration(data.vehicle.id, selectedOptions, name)
    return result
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans">
      <Navbar
        currentVehicleName={data.vehicle.name}
        manufacturerName={data.vehicle.manufacturer.name}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Main Configurator Row: 3D Viewport + Studio Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Interactive 3D Canvas */}
          <div className="lg:col-span-8 flex flex-col">
            <VehicleViewer
              paint={activePaintOption.properties as PaintProperties}
              wheel={activeWheelOption.properties as WheelProperties}
              caliper={activeCaliperOption.properties as CaliperProperties}
            />
          </div>

          {/* Right Column: Customization Studio Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 shadow-2xl">
            <div className="space-y-5">
              {/* Vehicle Title & Dynamic Price */}
              <div className="border-b border-zinc-800/80 pb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  <span>{data.vehicle.manufacturer.name} • {data.vehicle.year}</span>
                  <span className="text-emerald-400">Custom Spec</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white m-0">
                  {data.vehicle.name}
                </h1>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-zinc-400">Total Vehicle MSRP</span>
                  <span className="text-xl font-extrabold text-white">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Category Selector Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
                <button
                  onClick={() => setActiveTab('paint')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'paint'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Palette className="w-4 h-4 mb-1" />
                  <span>Paint</span>
                </button>

                <button
                  onClick={() => setActiveTab('wheels')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'wheels'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Disc className="w-4 h-4 mb-1" />
                  <span>Wheels</span>
                </button>

                <button
                  onClick={() => setActiveTab('calipers')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'calipers'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Activity className="w-4 h-4 mb-1" />
                  <span>Brakes</span>
                </button>

                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'specs'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Info className="w-4 h-4 mb-1" />
                  <span>Specs</span>
                </button>
              </div>

              {/* Active Tab Panel Content */}
              <div className="min-h-[220px]">
                {activeTab === 'paint' && (
                  <PaintSelector
                    options={data.customization_categories.paint.options}
                    selectedCode={selectedOptions.paint}
                    onSelect={(opt) => handleSelectOption('paint', opt)}
                  />
                )}

                {activeTab === 'wheels' && (
                  <WheelSelector
                    options={data.customization_categories.wheels.options}
                    selectedCode={selectedOptions.wheels}
                    onSelect={(opt) => handleSelectOption('wheels', opt)}
                  />
                )}

                {activeTab === 'calipers' && (
                  <CaliperSelector
                    options={data.customization_categories.calipers.options}
                    selectedCode={selectedOptions.calipers}
                    onSelect={(opt) => handleSelectOption('calipers', opt)}
                  />
                )}

                {activeTab === 'specs' && (
                  <VehicleSpecsPanel specs={data.vehicle.specifications} />
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-3">
              {resetNotification && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" /> Restored factory baseline
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-all"
                  title="Reset to initial factory baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-500/25 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Catalogue Section */}
        <section id="catalogue" className="mt-8 pt-8 border-t border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight m-0">
                Explore Vehicle Lineup
              </h2>
              <p className="text-xs text-zinc-400">
                Select a high-performance machine to configure in the 3D studio.
              </p>
            </div>
            <span className="text-xs text-blue-400 font-medium">AutoStudio 2026 Fleet</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Active Carrera Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border-2 border-blue-500/80 shadow-lg shadow-blue-500/10 relative overflow-hidden">
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                Active in Studio
              </span>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Porsche • 2026
              </p>
              <h3 className="text-lg font-bold text-white mt-1">911 Carrera</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                Twin-turbo boxer 6 engine, rear-engine architecture, precision sports coupe.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-zinc-800">
                <span className="text-zinc-400">From $120,100</span>
                <span className="font-semibold text-emerald-400">388 HP • 3.9s 0-60</span>
              </div>
            </div>

            {/* Mercedes-Benz C-Class (Next Model in Catalogue) */}
            <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 opacity-75 hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Mercedes-Benz • 2026
              </span>
              <h3 className="text-lg font-bold text-white mt-1">C-Class Sedan</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                Executive styling, mild hybrid powertrain, and cutting-edge digital luxury.
              </p>
              <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-zinc-800">
                <span className="text-zinc-400">From $46,950</span>
                <span className="text-zinc-400">Coming Soon</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Save / Share Configuration Modal */}
      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveBuild}
        totalPrice={totalPrice}
        vehicleName={data.vehicle.name}
      />
    </div>
  )
}

export default App
