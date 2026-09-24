import React, { useState } from 'react'
import {
  Bus,
  Search,
  Clock,
  MapPin,
  Users,
  Navigation,
  Compass,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Activity,
  Radio,
  ChevronRight,
  Circle,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { BUS_LINES, BUS_STOPS } from '../../data/mockData'
import { BusLine, BusStop, ActiveBusVehicle } from '../../types'
import { InteractiveMap } from '../map/InteractiveMap'

const OCCUPANCY_COLORS: Record<string, string> = {
  empty: 'text-emerald-600 bg-emerald-50',
  low: 'text-sky-600 bg-sky-50',
  medium: 'text-amber-600 bg-amber-50',
  crowded: 'text-rose-600 bg-rose-50',
}

const OCCUPANCY_LABELS: Record<string, string> = {
  empty: 'Empty',
  low: 'Light',
  medium: 'Moderate',
  crowded: 'Crowded',
}

export const BusFullView: React.FC = () => {
  const {
    liveBuses,
    selectedStop,
    setSelectedStop,
    selectedVehicle,
    setSelectedVehicle,
    setCurrentPage,
    setMapFocusPoint,
    mapFocusPoint,
  } = useApp()

  const [searchLine, setSearchLine] = useState('')
  const [selectedLineId, setSelectedLineId] = useState<string | 'all'>('all')

  const filteredLines = BUS_LINES.filter((line) => {
    if (selectedLineId !== 'all' && line.id !== selectedLineId) return false
    if (!searchLine.trim()) return true
    return (
      line.number.toLowerCase().includes(searchLine.toLowerCase()) ||
      line.name.toLowerCase().includes(searchLine.toLowerCase()) ||
      line.stops.some((s) => s.name.toLowerCase().includes(searchLine.toLowerCase()))
    )
  })

  const filteredBuses = liveBuses.filter((b) => {
    if (selectedLineId !== 'all' && b.lineId !== selectedLineId) return false
    if (!searchLine.trim()) return true
    return (
      b.busNumber.includes(searchLine) ||
      b.nextStopName.toLowerCase().includes(searchLine.toLowerCase())
    )
  })

  const handleStopSelect = (stop: BusStop) => {
    setSelectedStop(selectedStop?.id === stop.id ? null : stop)
    setMapFocusPoint({ x: stop.coords.x, y: stop.coords.y })
  }

  const handleBusSelect = (bus: ActiveBusVehicle) => {
    setSelectedVehicle(selectedVehicle?.id === bus.id ? null : bus)
    setMapFocusPoint({ x: bus.x, y: bus.y })
  }

  const selectedLine = BUS_LINES.find((l) => l.id === selectedLineId)

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Live Bus Transit Radar</h1>
              <p className="text-emerald-100 text-sm">
                Real-time GPS tracking • All routes • <span className="font-bold text-white">100% Free Municipal Service</span>
              </p>
            </div>
          </div>

          {/* Live Stats Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {[
              { icon: Bus, label: `${liveBuses.length} Buses Active` },
              { icon: Radio, label: 'Live GPS Updates' },
              { icon: MapPin, label: `${BUS_STOPS.length} Stops Covered` },
              { icon: Activity, label: '4 Active Routes' },
            ].map((s) => {
              const Icon = s.icon
              return (
                <span key={s.label} className="flex items-center gap-1.5 text-emerald-100 font-medium">
                  <Icon className="w-4 h-4 text-white/80" />
                  {s.label}
                </span>
              )
            })}
          </div>

          {/* Route Selector Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            <button
              onClick={() => setSelectedLineId('all')}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shrink-0 border ${
                selectedLineId === 'all'
                  ? 'bg-white text-emerald-700 border-white shadow-md'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              All Routes
            </button>
            {BUS_LINES.map((line) => (
              <button
                key={line.id}
                onClick={() => setSelectedLineId(line.id === selectedLineId ? 'all' : line.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shrink-0 border ${
                  selectedLineId === line.id
                    ? 'bg-white text-emerald-700 border-white shadow-md'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: line.color }}
                />
                Line {line.number}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Search + Bus List + Stops */}
          <div className="lg:col-span-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchLine}
                onChange={(e) => setSearchLine(e.target.value)}
                placeholder="Search bus, stop, or line name..."
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 shadow-xs"
              />
            </div>

            {/* Live Bus Vehicles */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Vehicles</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {filteredBuses.length} Active
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {filteredBuses.map((bus) => {
                  const line = BUS_LINES.find((l) => l.id === bus.lineId)
                  const isSelected = selectedVehicle?.id === bus.id
                  return (
                    <button
                      key={bus.id}
                      onClick={() => handleBusSelect(bus)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                        isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: line?.color || '#64748b' }}
                      >
                        <Bus className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{bus.busNumber}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${OCCUPANCY_COLORS[bus.occupancy]}`}
                          >
                            {OCCUPANCY_LABELS[bus.occupancy]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          Next: {bus.nextStopName} • {bus.etaNextStopMin} min
                        </p>
                        <p className="text-[11px] text-slate-400">{bus.speedKmH} km/h</p>
                      </div>
                      {isSelected && (
                        <span className="text-emerald-600 text-xs font-bold">▼</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bus Stops Directory */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bus Stops Directory</span>
                <span className="text-xs text-slate-400">{BUS_STOPS.length} stops</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {BUS_STOPS.map((stop) => {
                  const isSelected = selectedStop?.id === stop.id
                  const approachingCount = stop.approachingBuses.length
                  return (
                    <button
                      key={stop.id}
                      onClick={() => handleStopSelect(stop)}
                      className={`w-full px-4 py-3 text-left transition-colors ${
                        isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-600' : 'bg-slate-100'
                          }`}>
                            <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{stop.name}</p>
                            <p className="text-[11px] text-slate-500">
                              Lines: {stop.lineIds.join(', ')} • {approachingCount} bus{approachingCount !== 1 ? 'es' : ''} approaching
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-emerald-600' : 'text-slate-300'}`} />
                      </div>

                      {/* Departures Board */}
                      {isSelected && stop.approachingBuses.length > 0 && (
                        <div className="mt-2 space-y-1.5 pl-9">
                          {stop.approachingBuses.map((ab, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700">{ab.busNumber}</span>
                              <span className="text-slate-500 truncate mx-2">{ab.destination}</span>
                              <span className={`font-black shrink-0 ${
                                ab.etaMinutes <= 2 ? 'text-rose-600' :
                                ab.etaMinutes <= 5 ? 'text-amber-600' : 'text-emerald-600'
                              }`}>
                                {ab.etaMinutes <= 1 ? 'Now' : `${ab.etaMinutes} min`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right: Live Radar Map + Telemetry */}
          <div className="lg:col-span-8 space-y-4">
            {/* Interactive Radar Map */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live City Transit Radar
                  </span>
                  {selectedLine && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: selectedLine.color }}
                    >
                      Line {selectedLine.number}
                    </span>
                  )}
                </div>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  GPS Live — Updates every 2.5s
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <InteractiveMap height="420px" />
              </div>
            </div>

            {/* Selected Vehicle Telemetry */}
            {selectedVehicle && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: BUS_LINES.find((l) => l.id === selectedVehicle.lineId)?.color || '#64748b' }}
                  >
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Bus {selectedVehicle.busNumber}</p>
                    <p className="text-xs text-slate-500">
                      Line {BUS_LINES.find((l) => l.id === selectedVehicle.lineId)?.number} —{' '}
                      {BUS_LINES.find((l) => l.id === selectedVehicle.lineId)?.name}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${OCCUPANCY_COLORS[selectedVehicle.occupancy]}`}>
                      {OCCUPANCY_LABELS[selectedVehicle.occupancy]} Load
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Speed', value: `${selectedVehicle.speedKmH} km/h`, icon: Activity },
                    { label: 'Next Stop', value: selectedVehicle.nextStopName, icon: MapPin },
                    { label: 'ETA Next', value: `${selectedVehicle.etaNextStopMin} min`, icon: Clock },
                    { label: 'Heading', value: `${selectedVehicle.heading}°`, icon: Compass },
                  ].map((m) => {
                    const Icon = m.icon
                    return (
                      <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium">{m.label}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate">{m.value}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Lines Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredLines.map((line) => (
                <div
                  key={line.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all"
                  onClick={() => setSelectedLineId(line.id === selectedLineId ? 'all' : line.id)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: line.color }}
                    >
                      <span className="text-white font-black text-sm">{line.number}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{line.name}</p>
                      <p className="text-xs text-slate-500">Every {line.frequencyMinutes} min • {line.operatingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {line.stops.length} stops
                    </span>
                    <span className="text-slate-500">
                      {liveBuses.filter((b) => b.lineId === line.id).length} buses active
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
                    {line.stops.slice(0, 5).map((stop, idx) => (
                      <React.Fragment key={stop.id}>
                        <span className="text-[10px] text-slate-600 font-medium whitespace-nowrap">{stop.name.split(' ')[0]}</span>
                        {idx < Math.min(4, line.stops.length - 1) && (
                          <span className="text-slate-300 text-[10px]">→</span>
                        )}
                      </React.Fragment>
                    ))}
                    {line.stops.length > 5 && (
                      <span className="text-[10px] text-slate-400">+{line.stops.length - 5} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
