import React, { useState, useRef } from 'react'
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  Bus,
  Car,
  Utensils,
  Package,
  Layers,
  MapPin,
  Clock,
  Navigation,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { BUS_LINES, BUS_STOPS, RESTAURANTS } from '../../data/mockData'
import { BusStop, ActiveBusVehicle } from '../../types'

interface InteractiveMapProps {
  height?: string
  interactive?: boolean
  showControls?: boolean
  activeRoute?: {
    from: { x: number; y: number; label: string }
    to: { x: number; y: number; label: string }
  }
}

// Mock nearby taxis on the grid
const NEARBY_TAXIS = [
  { id: 'tax-1', x: 310, y: 240, driver: 'Leo K.', car: 'Prius Hybrid', rating: 4.9, eta: '2m' },
  { id: 'tax-2', x: 440, y: 350, driver: 'Anna S.', car: 'Tesla Model 3', rating: 4.95, eta: '4m' },
  { id: 'tax-3', x: 590, y: 230, driver: 'Ramon G.', car: 'Camry Comfort', rating: 4.88, eta: '3m' },
  { id: 'tax-4', x: 230, y: 390, driver: 'Zack T.', car: 'Ioniq 5', rating: 4.92, eta: '5m' },
]

// Mock active courier
const NEARBY_COURIERS = [
  { id: 'cour-1', x: 360, y: 300, name: 'Swift Bike #12', type: 'Food Courier', eta: '5 min' },
  { id: 'cour-2', x: 500, y: 390, name: 'Express Van #4', type: 'Package Courier', eta: '12 min' },
]

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  height = '520px',
  interactive = true,
  showControls = true,
  activeRoute,
}) => {
  const {
    liveBuses,
    mapFilter,
    setMapFilter,
    selectedStop,
    setSelectedStop,
    selectedVehicle,
    setSelectedVehicle,
    setActiveServiceModal,
    addToast,
  } = useApp()

  const [zoom, setZoom] = useState<number>(1)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  
  const [activePoi, setActivePoi] = useState<{
    type: 'taxi' | 'restaurant' | 'courier' | 'bus'
    title: string
    subtitle: string
    badge?: string
    coords: { x: number; y: number }
    data?: any
  } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedStop(null)
    setSelectedVehicle(null)
    setActivePoi(null)
  }

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => setIsDragging(false)

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive || e.touches.length === 0) return
    setIsDragging(true)
    setDragStart({
      x: e.touches[0].clientX - pan.x,
      y: e.touches[0].clientY - pan.y,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !interactive || e.touches.length === 0) return
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    })
  }

  const handleTouchEnd = () => setIsDragging(false)

  const handleStopClick = (e: React.MouseEvent, stop: BusStop) => {
    e.stopPropagation()
    setSelectedStop(stop)
    setSelectedVehicle(null)
    setActivePoi(null)
  }

  const handleBusClick = (e: React.MouseEvent, bus: ActiveBusVehicle) => {
    e.stopPropagation()
    setSelectedVehicle(bus)
    setSelectedStop(null)
    setActivePoi({
      type: 'bus',
      title: `Bus #${bus.busNumber} • Live`,
      subtitle: `Heading to ${bus.nextStopName} (ETA ${bus.etaNextStopMin} min)`,
      badge: `${bus.speedKmH} km/h • ${bus.occupancy} occupancy`,
      coords: { x: bus.x, y: bus.y },
      data: bus,
    })
  }

  const handleTaxiClick = (e: React.MouseEvent, taxi: (typeof NEARBY_TAXIS)[0]) => {
    e.stopPropagation()
    setSelectedStop(null)
    setActivePoi({
      type: 'taxi',
      title: `${taxi.car} (Driver ${taxi.driver})`,
      subtitle: `Pickup ETA ~${taxi.eta} • ★ ${taxi.rating}`,
      badge: 'Available Now',
      coords: { x: taxi.x, y: taxi.y },
      data: taxi,
    })
  }

  const handleRestaurantClick = (e: React.MouseEvent, rest: (typeof RESTAURANTS)[0]) => {
    e.stopPropagation()
    setSelectedStop(null)
    setActivePoi({
      type: 'restaurant',
      title: rest.name,
      subtitle: `${rest.category} • ${rest.deliveryTime} • $0 Delivery`,
      badge: `★ ${rest.rating}`,
      coords: rest.coords,
      data: rest,
    })
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#e8ecf2] shadow-sm select-none"
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Map Layer Controls Filter Bar */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-xs font-medium">
        <div className="flex items-center gap-1 text-slate-500 pr-1 border-r border-slate-200 mr-0.5">
          <Layers className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden sm:inline">Layers:</span>
        </div>
        <button
          onClick={() => setMapFilter('all')}
          className={`px-2.5 py-1 rounded-lg transition-all ${
            mapFilter === 'all'
              ? 'bg-sky-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setMapFilter('taxis')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
            mapFilter === 'taxis'
              ? 'bg-amber-500 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Car className="w-3 h-3" />
          <span>Taxis ({NEARBY_TAXIS.length})</span>
        </button>
        <button
          onClick={() => setMapFilter('buses')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
            mapFilter === 'buses'
              ? 'bg-emerald-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bus className="w-3 h-3" />
          <span>Buses ({liveBuses.length})</span>
        </button>
        <button
          onClick={() => setMapFilter('food')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
            mapFilter === 'food'
              ? 'bg-rose-500 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Utensils className="w-3 h-3" />
          <span>Food ({RESTAURANTS.length})</span>
        </button>
      </div>

      {/* Floating Zoom and Navigation Controls */}
      {showControls && (
        <div className="absolute bottom-4 right-3 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-9 h-9 bg-white/95 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center transition-transform active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-9 h-9 bg-white/95 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center transition-transform active:scale-95"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Center City"
            className="w-9 h-9 bg-white/95 hover:bg-white text-sky-600 rounded-xl shadow-md border border-slate-200/80 flex items-center justify-center transition-transform active:scale-95"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Active Status Chip */}
      <div className="absolute bottom-4 left-3 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/80 text-xs text-slate-600">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-slate-800">Live City Radar</span>
        <span className="text-slate-400">•</span>
        <span className="text-emerald-700 font-medium">100% Free Platform</span>
      </div>

      {/* Main SVG Vector Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full min-w-[950px] min-h-[600px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Water Gradient */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>

            {/* Park Gradient */}
            <linearGradient id="parkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dcfce7" />
              <stop offset="100%" stopColor="#bbf7d0" />
            </linearGradient>

            {/* Glowing active line filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Landmass */}
          <rect width="1000" height="650" fill="#f1f5f9" />

          {/* River / Coastline Bay */}
          <path
            d="M -20,490 C 200,470 320,530 480,510 C 640,490 760,540 900,530 C 960,525 1020,540 1020,540 L 1020,670 L -20,670 Z"
            fill="url(#waterGrad)"
            opacity="0.85"
          />
          <text x="800" y="600" fill="#1e40af" opacity="0.35" fontSize="16" fontWeight="bold">
            Seaside Bay & Grand Marina
          </text>

          {/* City Parks / Green areas */}
          <rect x="80" y="80" width="160" height="90" rx="14" fill="url(#parkGrad)" opacity="0.9" />
          <text x="95" y="115" fill="#166534" fontSize="11" fontWeight="600" opacity="0.7">
            North Central Forest
          </text>

          <rect x="580" y="90" width="200" height="100" rx="16" fill="url(#parkGrad)" opacity="0.9" />
          <text x="600" y="125" fill="#166534" fontSize="11" fontWeight="600" opacity="0.7">
            Grand Botanical Gardens
          </text>

          <rect x="360" y="380" width="130" height="80" rx="12" fill="url(#parkGrad)" opacity="0.7" />
          <text x="375" y="415" fill="#166534" fontSize="10" fontWeight="600" opacity="0.6">
            City Civic Park
          </text>

          {/* Secondary Roads Grid */}
          <g stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" opacity="0.95">
            <line x1="80" y1="180" x2="920" y2="180" />
            <line x1="80" y1="300" x2="920" y2="300" />
            <line x1="80" y1="420" x2="920" y2="420" />
            <line x1="200" y1="50" x2="200" y2="580" />
            <line x1="380" y1="50" x2="380" y2="580" />
            <line x1="560" y1="50" x2="560" y2="580" />
            <line x1="740" y1="50" x2="740" y2="580" />
          </g>

          {/* Main Major Avenues (Thick white with subtle shadow) */}
          <g stroke="#ffffff" strokeWidth="16" strokeLinecap="round" opacity="0.95">
            <line x1="120" y1="120" x2="880" y2="240" />
            <line x1="220" y1="490" x2="780" y2="110" />
            <line x1="140" y1="260" x2="860" y2="460" />
            <line x1="480" y1="60" x2="480" y2="540" />
          </g>

          {/* Highway Bridge over water */}
          <path
            d="M 450,480 L 450,560"
            stroke="#cbd5e1"
            strokeWidth="20"
            strokeLinecap="square"
          />
          <path
            d="M 450,480 L 450,560"
            stroke="#ffffff"
            strokeWidth="14"
            strokeLinecap="square"
          />

          {/* Active Bus Lines Paths (Visible if filter is all or buses) */}
          {(mapFilter === 'all' || mapFilter === 'buses') &&
            BUS_LINES.map((line) => {
              const d = line.pathPoints
                .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`)
                .join(' ')
              return (
                <g key={line.id}>
                  {/* Outer glow track */}
                  <path
                    d={d}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.3"
                  />
                  {/* Inner line */}
                  <path
                    d={d}
                    fill="none"
                    stroke={line.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                </g>
              )
            })}

          {/* Active Navigation Route Preview if present */}
          {activeRoute && (
            <g>
              <line
                x1={activeRoute.from.x}
                y1={activeRoute.from.y}
                x2={activeRoute.to.x}
                y2={activeRoute.to.y}
                stroke="#0284c7"
                strokeWidth="5"
                strokeLinecap="round"
                className="animate-dash"
              />
              <circle
                cx={activeRoute.from.x}
                cy={activeRoute.from.y}
                r="7"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <circle
                cx={activeRoute.to.x}
                cy={activeRoute.to.y}
                r="7"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Bus Stops (Clickable Markers) */}
          {(mapFilter === 'all' || mapFilter === 'buses') &&
            BUS_STOPS.map((stop) => {
              const isSelected = selectedStop?.id === stop.id
              return (
                <g
                  key={stop.id}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={(e) => handleStopClick(e, stop)}
                >
                  <circle
                    cx={stop.coords.x}
                    cy={stop.coords.y}
                    r={isSelected ? '10' : '7'}
                    fill={isSelected ? '#0284c7' : '#ffffff'}
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                  />
                  <circle
                    cx={stop.coords.x}
                    cy={stop.coords.y}
                    r={isSelected ? '5' : '3'}
                    fill={isSelected ? '#ffffff' : '#0284c7'}
                  />
                  {/* Label */}
                  <text
                    x={stop.coords.x + 10}
                    y={stop.coords.y + 4}
                    fill="#334155"
                    fontSize="10"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {stop.name}
                  </text>
                </g>
              )
            })}

          {/* Live Buses (Animated Moving) */}
          {(mapFilter === 'all' || mapFilter === 'buses') &&
            liveBuses.map((bus) => {
              const line = BUS_LINES.find((l) => l.id === bus.lineId)
              const color = line ? line.color : '#0284c7'
              return (
                <g
                  key={bus.id}
                  className="cursor-pointer transition-all duration-700 ease-linear hover:scale-125"
                  onClick={(e) => handleBusClick(e, bus)}
                  transform={`translate(${bus.x}, ${bus.y})`}
                >
                  {/* Ping effect */}
                  <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill={color}
                    opacity="0.25"
                    className="animate-ping"
                  />
                  {/* Bus Body */}
                  <rect
                    x="-12"
                    y="-9"
                    width="24"
                    height="18"
                    rx="5"
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
                  />
                  <text
                    x="0"
                    y="3"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {bus.busNumber}
                  </text>
                </g>
              )
            })}

          {/* Nearby Taxis */}
          {(mapFilter === 'all' || mapFilter === 'taxis') &&
            NEARBY_TAXIS.map((taxi) => (
              <g
                key={taxi.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={(e) => handleTaxiClick(e, taxi)}
                transform={`translate(${taxi.x}, ${taxi.y})`}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
                />
                {/* Mini car icon */}
                <path
                  d="M -5,1 L -3,-3 L 3,-3 L 5,1 L 5,4 L -5,4 Z"
                  fill="#ffffff"
                />
                <circle cx="-3" cy="4" r="1.2" fill="#000000" />
                <circle cx="3" cy="4" r="1.2" fill="#000000" />
              </g>
            ))}

          {/* Restaurant Pins */}
          {(mapFilter === 'all' || mapFilter === 'food') &&
            RESTAURANTS.map((rest) => (
              <g
                key={rest.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={(e) => handleRestaurantClick(e, rest)}
                transform={`translate(${rest.coords.x}, ${rest.coords.y})`}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
                />
                {/* Fork & Spoon symbol */}
                <path
                  d="M -3,-4 L -3,3 M 3,-4 L 3,3 M -4,-4 L -2,-4 M 2,-4 L 4,-4"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </g>
            ))}

          {/* Couriers */}
          {(mapFilter === 'all' || mapFilter === 'couriers') &&
            NEARBY_COURIERS.map((courier) => (
              <g
                key={courier.id}
                className="cursor-pointer transition-transform hover:scale-125"
                transform={`translate(${courier.x}, ${courier.y})`}
                onClick={(e) => {
                  e.stopPropagation()
                  setActivePoi({
                    type: 'courier',
                    title: courier.name,
                    subtitle: `${courier.type} • Active transit`,
                    badge: courier.eta,
                    coords: { x: courier.x, y: courier.y },
                    data: courier,
                  })
                }}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="11"
                  fill="#8b5cf6"
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
                />
                <rect x="-4" y="-3" width="8" height="6" fill="#ffffff" rx="1" />
              </g>
            ))}
        </svg>
      </div>

      {/* Selected Bus Stop Modal/Card Overlay */}
      {selectedStop && (
        <div className="absolute bottom-4 left-3 right-3 sm:right-auto sm:w-96 z-30 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{selectedStop.name}</h4>
                <p className="text-xs text-slate-500">Live Bus Stop Departure Board</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStop(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Approaching Buses
            </p>
            {selectedStop.approachingBuses.length === 0 ? (
              <p className="text-xs text-slate-500 py-1">No buses arriving within next 20 mins</p>
            ) : (
              selectedStop.approachingBuses.map((arr, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-sky-600 text-white font-bold text-xs">
                      #{arr.busNumber}
                    </span>
                    <span className="text-xs text-slate-700 font-medium truncate max-w-[150px]">
                      {arr.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{arr.etaMinutes} min</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveServiceModal('bus')
                addToast('Transit Radar', 'Switched to full Bus Transit view', 'info', 'bus')
              }}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
            >
              Full Route Details
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-400">Updates live</span>
          </div>
        </div>
      )}

      {/* Selected POI (Taxi / Food / Courier / Bus) Modal Overlay */}
      {activePoi && (
        <div className="absolute bottom-4 left-3 right-3 sm:right-auto sm:w-96 z-30 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  activePoi.type === 'taxi'
                    ? 'bg-amber-100 text-amber-700'
                    : activePoi.type === 'restaurant'
                    ? 'bg-rose-100 text-rose-600'
                    : activePoi.type === 'courier'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-sky-100 text-sky-600'
                }`}
              >
                {activePoi.type === 'taxi' && <Car className="w-5 h-5" />}
                {activePoi.type === 'restaurant' && <Utensils className="w-5 h-5" />}
                {activePoi.type === 'courier' && <Package className="w-5 h-5" />}
                {activePoi.type === 'bus' && <Bus className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-800 text-sm">{activePoi.title}</h4>
                  {activePoi.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {activePoi.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{activePoi.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setActivePoi(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {activePoi.type === 'taxi' && (
              <button
                onClick={() => {
                  setActiveServiceModal('taxi')
                  setActivePoi(null)
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Car className="w-3.5 h-3.5" />
                Book Taxi Now ($0 Platform Fee)
              </button>
            )}
            {activePoi.type === 'restaurant' && (
              <button
                onClick={() => {
                  setActiveServiceModal('food')
                  setActivePoi(null)
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Utensils className="w-3.5 h-3.5" />
                Browse Menu & Order ($0 Delivery)
              </button>
            )}
            {activePoi.type === 'bus' && (
              <button
                onClick={() => {
                  setActiveServiceModal('bus')
                  setActivePoi(null)
                }}
                className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Bus className="w-3.5 h-3.5" />
                Track All Buses & Stops
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
