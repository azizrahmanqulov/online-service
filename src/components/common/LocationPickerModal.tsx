import React, { useState } from 'react'
import {
  MapPin,
  Crosshair,
  Home,
  Briefcase,
  Dumbbell,
  Check,
  X,
  Plus,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const CITY_PRESETS = [
  '742 Evergreen Terrace, Downtown',
  'Central Metro Station, Gate 2',
  'Tech Innovation Tower, 12th Floor',
  'Market Square & Civic Center',
  'Seaside Promenade & Marina',
  'South Medical Regional Center',
]

export const LocationPickerModal: React.FC = () => {
  const {
    isLocationPickerOpen,
    setIsLocationPickerOpen,
    currentLocation,
    setCurrentLocation,
    userProfile,
    addToast,
  } = useApp()

  const [inputVal, setInputVal] = useState<string>('')

  if (!isLocationPickerOpen) return null

  const handleSelect = (addr: string) => {
    setCurrentLocation(addr)
    setIsLocationPickerOpen(false)
    addToast('Location Updated', `Current location set to ${addr.split(',')[0]}`, 'info')
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputVal.trim()) return
    handleSelect(inputVal.trim())
    setInputVal('')
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Choose Your Location</h3>
              <p className="text-[11px] text-slate-500">Tailors nearby taxis, food & bus stops</p>
            </div>
          </div>

          <button
            onClick={() => setIsLocationPickerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Custom Search/Input */}
          <form onSubmit={handleCustomSubmit} className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type any street address or landmark..."
              className="w-full pl-3.5 pr-20 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-40"
            >
              Set
            </button>
          </form>

          {/* Saved Addresses */}
          {userProfile.savedAddresses.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Your Saved Places
              </span>
              <div className="space-y-1.5">
                {userProfile.savedAddresses.map((addr) => {
                  const isCurrent = currentLocation === addr.address
                  return (
                    <button
                      key={addr.id}
                      onClick={() => handleSelect(addr.address)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'border-sky-600 bg-sky-50/50 text-sky-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          {addr.type === 'home' && <Home className="w-3.5 h-3.5" />}
                          {addr.type === 'work' && <Briefcase className="w-3.5 h-3.5" />}
                          {addr.type === 'other' && <Dumbbell className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{addr.label}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[220px]">
                            {addr.address}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-sky-600" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* City Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Popular City Spots
            </span>
            <div className="space-y-1">
              {CITY_PRESETS.map((preset) => {
                const isCurrent = currentLocation === preset
                return (
                  <button
                    key={preset}
                    onClick={() => handleSelect(preset)}
                    className={`w-full p-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{preset}</span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
