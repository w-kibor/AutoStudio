import {
  Activity,
  ArrowUpRight,
  Check,
  Disc,
  Info,
  Palette,
  RotateCcw,
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
  getLocalCatalogVehicles,
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
  const [activeSlug, setActiveSlug] = useState<string>('toyota-gr-supra-a90')
  const [data, setData] = useState<ConfiguratorData>(fallbackPorscheData)
  const [selectedOptions, setSelectedOptions] = useState<SelectedConfiguration>(
    fallbackPorscheData.default_configuration.selected_options
  )
  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'calipers' | 'specs'>('paint')
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [resetNotification, setResetNotification] = useState(false)

  const catalogVehicles = useMemo(() => getLocalCatalogVehicles(), [])

  useEffect(() => {
    fetchConfiguratorData(activeSlug).then((res) => {
      setData(res)
      if (res.default_configuration?.selected_options) {
        setSelectedOptions(res.default_configuration.selected_options)
      }
    })
  }, [activeSlug])

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

  const totalPrice = useMemo(() => {
    let price = data.vehicle.base_price
    price += activePaintOption.price_delta
    price += activeWheelOption.price_delta
    price += activeCaliperOption.price_delta
    return price
  }, [data.vehicle.base_price, activePaintOption, activeWheelOption, activeCaliperOption])

  const handleSelectOption = (categoryCode: string, option: CustomizationOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [categoryCode]: option.code,
    }))
  }

  const handleReset = () => {
    setSelectedOptions(data.default_configuration.selected_options)
    setResetNotification(true)
    setTimeout(() => setResetNotification(false), 2000)
  }

  const handleSelectVehicle = (slug: string) => {
    setActiveSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveBuild = async (name: string) => {
    return saveVehicleConfiguration(data.vehicle.id, selectedOptions, name)
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
      <Navbar
        currentVehicleName={data.vehicle.name}
        manufacturerName={data.vehicle.manufacturer.name}
        onOpenSave={() => setIsSaveModalOpen(true)}
      />

      {/* Primary Configurator Showroom */}
      <main id="studio" className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-6 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 3D Viewport */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
            <VehicleViewer
              paint={activePaintOption.properties as PaintProperties}
              wheel={activeWheelOption.properties as WheelProperties}
              caliper={activeCaliperOption.properties as CaliperProperties}
              bodyStyle={data.vehicle.body_style}
              manufacturerName={data.vehicle.manufacturer.name}
              vehicleName={data.vehicle.name}
              year={data.vehicle.year}
            />
          </div>

          {/* Right-hand Atelier Panel */}
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between p-6 bg-zinc-950 border border-white/10">
            <div className="space-y-6">
              {/* Header & Dynamic MSRP */}
              <div className="border-b border-white/10 pb-5">
                <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-medium">
                  Configuration Summary
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-zinc-400">Configured MSRP</span>
                  <span className="font-serif text-3xl font-medium text-white tracking-tight">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
                  {data.vehicle.description}
                </p>
              </div>

              {/* Minimalist Category Tabs */}
              <div className="grid grid-cols-4 border border-white/10 bg-black">
                {(
                  [
                    { id: 'paint', label: 'Paint', icon: Palette },
                    { id: 'wheels', label: 'Wheels', icon: Disc },
                    { id: 'calipers', label: 'Brakes', icon: Activity },
                    { id: 'specs', label: 'Specs', icon: Info },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center py-2.5 px-1 text-[10px] uppercase tracking-[0.14em] font-medium transition-colors border-r last:border-r-0 border-white/10 ${
                        isActive
                          ? 'bg-white text-black'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mb-1" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Active Option Selector */}
              <div className="min-h-[250px]">
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

            {/* Bottom Action Bar */}
            <div className="pt-5 border-t border-white/10 space-y-3 mt-6">
              {resetNotification && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-white py-1.5 bg-zinc-900 border border-white/20">
                  <Check className="w-3.5 h-3.5" /> Restored Factory Baseline
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 bg-black hover:bg-zinc-900 text-zinc-300 hover:text-white border border-white/15 text-[11px] uppercase tracking-[0.15em] font-medium transition-colors"
                  title="Reset to factory standard"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="flex-1 py-3 px-4 bg-white text-black hover:bg-zinc-200 font-semibold text-[11px] uppercase tracking-[0.16em] transition-colors text-center"
                >
                  Save & Share Build
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Performance Highlights Strip */}
        <section
          id="engineering"
          className="border-y border-white/10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Engine Architecture
            </span>
            <p className="font-serif text-xl sm:text-2xl text-white mt-1.5">
              {data.vehicle.specifications.engine}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Peak Output
            </span>
            <p className="font-serif text-xl sm:text-2xl text-white mt-1.5">
              {data.vehicle.specifications.power_hp} hp
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Acceleration (0–60 mph)
            </span>
            <p className="font-serif text-xl sm:text-2xl text-white mt-1.5">
              {data.vehicle.specifications.acceleration_0_60_mph} seconds
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Top Track Speed
            </span>
            <p className="font-serif text-xl sm:text-2xl text-white mt-1.5">
              {data.vehicle.specifications.top_speed_mph} mph
            </p>
          </div>
        </section>

        {/* Editorial Fleet / Model Lineup */}
        <section id="fleet" className="space-y-8 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-medium">
                The 2026 Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white mt-1">
                Select Your Vehicle
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-md">
              Choose a model below to load its bespoke proportions, factory paint palette, and
              performance specifications into the 3D Atelier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {catalogVehicles.map((vehicle) => {
              const isCurrent = vehicle.slug === activeSlug
              return (
                <div
                  key={vehicle.slug}
                  onClick={() => handleSelectVehicle(vehicle.slug)}
                  className={`group cursor-pointer p-7 border transition-all flex flex-col justify-between min-h-[240px] ${
                    isCurrent
                      ? 'bg-zinc-950 border-white'
                      : 'bg-zinc-950/50 border-white/10 hover:border-white/40 hover:bg-zinc-950'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
                        {vehicle.manufacturer.name} • {vehicle.year}
                      </span>
                      {isCurrent ? (
                        <span className="text-[10px] uppercase tracking-[0.18em] px-2.5 py-0.5 bg-white text-black font-semibold">
                          In Studio
                        </span>
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                      )}
                    </div>

                    <h3 className="font-serif text-2xl font-medium text-white mt-3">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-2">
                      {vehicle.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      From{' '}
                      <strong className="text-white font-medium">
                        ${vehicle.base_price.toLocaleString()}
                      </strong>
                    </span>
                    <span className="text-zinc-400">
                      {vehicle.specifications.power_hp} hp •{' '}
                      {vehicle.specifications.acceleration_0_60_mph}s
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      {/* Luxury Minimalist Footer */}
      <footer className="border-t border-white/10 bg-black py-8 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 tracking-wider uppercase">
          <span>© 2026 AutoStudio Bespoke Atelier</span>
          <span>Real-Time 3D Automotive Configuration Platform</span>
        </div>
      </footer>

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
