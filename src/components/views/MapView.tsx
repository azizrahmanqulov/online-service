import React from 'react'
import {
  Map as MapIcon,
  Car,
  Bus,
  Utensils,
  Package,
  Layers,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { InteractiveMap } from '../map/InteractiveMap'
import { BUS_STOPS, RESTAURANTS } from '../../data/mockData'

export const MapView: React.FC = () => {
  const {
    mapFilter,
    setMapFilter,
    setActiveServiceModal,
    liveBuses,
    setSelectedStop,
  } = useApp()

  return (
    <div className="space-y-4 pb-12">
      {/* Top Bar Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-md shadow-sky-600/20">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900">Live City Transit & Service Radar</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                GPS Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time positions of moving buses, nearby available taxis, couriers and restaurants
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveServiceModal('taxi')}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            <Car className="w-3.5 h-3.5" />
            <span>Book Taxi</span>
          </button>
          <button
            onClick={() => setActiveServiceModal('bus')}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Bus Radar</span>
          </button>
        </div>
      </div>

      {/* Main Map & Live Radar Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Full Interactive Map */}
        <div className="lg:col-span-8 min-h-[520px] flex flex-col">
          <InteractiveMap height="580px" />
        </div>

        {/* Live Sidebar Feeds */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Transit Stop List */}
          <div className="p-4 rounded-3xl border border-slate-200 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transit Stops Near You
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Tap to view live arrival</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {BUS_STOPS.map((stop) => (
                <div
                  key={stop.id}
                  onClick={() => setSelectedStop(stop)}
                  className="p-2.5 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200/70 hover:border-sky-200 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{stop.name}</h5>
                    <p className="text-[10px] text-slate-400">
                      Lines: {stop.lineIds.map((l) => l.replace('line-', '#')).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-sky-600">
                      #{stop.approachingBuses[0]?.busNumber} ({stop.approachingBuses[0]?.etaMinutes}m)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nearby Services shortcuts */}
          <div className="p-4 rounded-3xl border border-slate-200 bg-white space-y-3 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Quick Dispatch On Map
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveServiceModal('taxi')}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all"
              >
                <Car className="w-5 h-5 text-amber-600 mb-1" />
                <div className="text-xs font-bold text-slate-900">Call Taxi</div>
                <div className="text-[10px] text-slate-500">4 nearby ~3m</div>
              </button>

              <button
                onClick={() => setActiveServiceModal('food')}
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left transition-all"
              >
                <Utensils className="w-5 h-5 text-rose-600 mb-1" />
                <div className="text-xs font-bold text-slate-900">Food Menu</div>
                <div className="text-[10px] text-slate-500">Free delivery</div>
              </button>

              <button
                onClick={() => setActiveServiceModal('courier')}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all"
              >
                <Package className="w-5 h-5 text-purple-600 mb-1" />
                <div className="text-xs font-bold text-slate-900">Send Parcel</div>
                <div className="text-[10px] text-slate-500">Same-day pickup</div>
              </button>

              <button
                onClick={() => setActiveServiceModal('intercity')}
                className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all"
              >
                <Compass className="w-5 h-5 text-blue-600 mb-1" />
                <div className="text-xs font-bold text-slate-900">Intercity</div>
                <div className="text-[10px] text-slate-500">Scheduled trips</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
