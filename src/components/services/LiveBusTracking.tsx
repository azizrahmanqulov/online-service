import React, { useState } from 'react'
import {
  Bus,
  Search,
  Clock,
  MapPin,
  Users,
  Navigation,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { BUS_LINES, BUS_STOPS } from '../../data/mockData'
import { BusLine, BusStop, ActiveBusVehicle } from '../../types'
import { InteractiveMap } from '../map/InteractiveMap'

interface LiveBusTrackingProps {
  onClose?: () => void
}

export const LiveBusTracking: React.FC<LiveBusTrackingProps> = ({ onClose }) => {
  const {
    liveBuses,
    selectedStop,
    setSelectedStop,
    selectedVehicle,
    setSelectedVehicle,
    addToast,
  } = useApp()

  const [searchLine, setSearchLine] = useState<string>('')
  const [selectedLineId, setSelectedLineId] = useState<string | 'all'>('all')

  // Filtered bus lines
  const filteredLines = BUS_LINES.filter((line) => {
    if (selectedLineId !== 'all' && line.id !== selectedLineId) return false
    if (!searchLine.trim()) return true
    return (
      line.number.toLowerCase().includes(searchLine.toLowerCase()) ||
      line.name.toLowerCase().includes(searchLine.toLowerCase()) ||
      line.stops.some((s) => s.name.toLowerCase().includes(searchLine.toLowerCase()))
    )
  })

  // Filtered buses
  const filteredBuses = liveBuses.filter((b) => {
    if (selectedLineId !== 'all' && b.lineId !== selectedLineId) return false
    if (!searchLine.trim()) return true
    return b.busNumber.includes(searchLine) || b.nextStopName.toLowerCase().includes(searchLine.toLowerCase())
  })

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl w-full mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-600/10 via-emerald-600/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Live Public Bus Tracking</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                100% Free Public Transit Radar
              </span>
            </div>
            <p className="text-xs text-slate-500">Real-time bus GPS positions, approaching lines, and stop countdowns</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Search & Line Selector Pills */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchLine}
              onChange={(e) => setSearchLine(e.target.value)}
              placeholder="Search bus number (101, 42, 88...) or stop name..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium text-slate-800"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedLineId('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLineId === 'all'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Routes
            </button>
            {BUS_LINES.map((line) => (
              <button
                key={line.id}
                onClick={() => setSelectedLineId(line.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedLineId === line.id
                    ? 'text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={{
                  backgroundColor: selectedLineId === line.id ? line.color : undefined,
                }}
              >
                <span>Line {line.number}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top Grid: Interactive Map with Buses & Stops */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map display */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Interactive Radar ({filteredBuses.length} active buses moving live)
              </span>
              <span className="text-xs text-slate-400">Click any bus stop or vehicle to view details</span>
            </div>
            <InteractiveMap height="420px" />
          </div>

          {/* Right Column: Selected Stop / Selected Bus Information */}
          <div className="lg:col-span-4 space-y-4">
            {selectedStop ? (
              <div className="p-4 rounded-3xl border border-slate-200 bg-sky-50/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{selectedStop.name}</h4>
                      <p className="text-[11px] text-slate-500">Live Stop Board</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStop(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Next Approaching Buses
                  </span>
                  {selectedStop.approachingBuses.map((arr, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white font-bold text-xs">
                          #{arr.busNumber}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{arr.destination}</p>
                          <span className="text-[10px] text-slate-400">Scheduled arrival</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-600">{arr.etaMinutes} min</span>
                        <div className="text-[10px] text-slate-400">On schedule</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedVehicle ? (
              <div className="p-4 rounded-3xl border border-slate-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Bus #{selectedVehicle.busNumber}</h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">Active in Service</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs bg-white p-3 rounded-2xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Stop:</span>
                    <span className="font-bold text-slate-800">{selectedVehicle.nextStopName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Arrival:</span>
                    <span className="font-bold text-emerald-600">~{selectedVehicle.etaNextStopMin} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Speed:</span>
                    <span className="font-semibold text-slate-800">{selectedVehicle.speedKmH} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Passenger Occupancy:</span>
                    <span className="font-bold text-slate-800 capitalize">{selectedVehicle.occupancy}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-3xl border border-slate-200 bg-slate-50 text-center space-y-2">
                <Navigation className="w-8 h-8 text-sky-600 mx-auto opacity-70" />
                <h5 className="font-bold text-slate-800 text-xs">Tap a Bus Stop or Vehicle</h5>
                <p className="text-[11px] text-slate-500">
                  Select any stop pin on the map to see real-time arriving buses or tap a bus to see live speed & occupancy.
                </p>
              </div>
            )}

            {/* Quick Bus Stop Selector */}
            <div className="p-4 rounded-3xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Nearby Transit Stops
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {BUS_STOPS.map((stop) => (
                  <button
                    key={stop.id}
                    onClick={() => {
                      setSelectedStop(stop)
                      setSelectedVehicle(null)
                    }}
                    className={`w-full p-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedStop?.id === stop.id
                        ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{stop.name}</span>
                    <span className="text-[10px] text-emerald-600 font-bold ml-1 shrink-0">
                      {stop.approachingBuses[0]?.etaMinutes}m
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bus Routes Overview Cards */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            City Transit Network Routes ({filteredLines.length})
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredLines.map((line) => (
              <div
                key={line.id}
                onClick={() => setSelectedLineId(line.id)}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: line.color }}
                    >
                      {line.number}
                    </span>
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[130px]">
                      {line.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Freq: every {line.frequencyMinutes}m</span>
                  <span>{line.operatingHours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
