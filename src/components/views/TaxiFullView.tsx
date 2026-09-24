import React, { useState } from 'react'
import {
  Car,
  MapPin,
  Navigation,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  Crown,
  CheckCircle2,
  Phone,
  Star,
  ArrowRight,
  ArrowLeft,
  Compass,
  Luggage,
  Fuel,
  Timer,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { TAXI_TYPES } from '../../data/mockData'
import { TaxiVehicleType, DriverInfo } from '../../types'
import { InteractiveMap } from '../map/InteractiveMap'

const MOCK_DRIVERS: DriverInfo[] = [
  {
    name: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    tripsCount: 1840,
    phone: '+1 (555) 381-9023',
    carModel: 'Toyota Camry Hybrid (Silver)',
    carColor: 'Silver Metallic',
    plateNumber: '5-NYC-812',
  },
  {
    name: 'Sofia Martinez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    tripsCount: 2210,
    phone: '+1 (555) 749-1102',
    carModel: 'Tesla Model 3 (Pearl White)',
    carColor: 'Pearl White',
    plateNumber: '9-EV-440',
  },
]

const SAVED_PLACES = [
  'Tech Innovation Tower, 12th Floor',
  'Central Park East Entrance',
  'Downtown Financial District',
  'Ocean View Mall, Level 3',
  'Airport Terminal B',
]

export const TaxiFullView: React.FC = () => {
  const { currentLocation, userProfile, addOrder, setCurrentPage } = useApp()

  const [pickup, setPickup] = useState(currentLocation)
  const [destination, setDestination] = useState('Tech Innovation Tower, 12th Floor')
  const [selectedTier, setSelectedTier] = useState<TaxiVehicleType>(TAXI_TYPES[0])
  const [isBooking, setIsBooking] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<{
    orderId: string
    driver: DriverInfo
    etaMinutes: number
    fare: number
  } | null>(null)
  const [etaCountdown, setEtaCountdown] = useState<number | null>(null)

  const handleBookTaxi = () => {
    if (!pickup.trim() || !destination.trim()) return
    setIsBooking(true)
    setTimeout(() => {
      const assignedDriver = selectedTier.id === 'electric' ? MOCK_DRIVERS[1] : MOCK_DRIVERS[0]
      const orderId = addOrder({
        serviceId: 'taxi',
        serviceName: 'Taxi Ride',
        title: `${selectedTier.name} to ${destination.split(',')[0]}`,
        subtitle: `${assignedDriver.carModel} • ${assignedDriver.rating}★ Driver`,
        totalAmount: selectedTier.price,
        currency: '$',
        status: 'driver_assigned',
        progressStep: 2,
        statusText: 'Driver is arriving at your pickup location',
        estimatedTime: `${selectedTier.etaMinutes} mins`,
        pickupLocation: pickup,
        dropoffLocation: destination,
        driverOrCourier: assignedDriver,
        mapCoords: { x: 380, y: 270 },
      })
      setConfirmedBooking({
        orderId,
        driver: assignedDriver,
        etaMinutes: selectedTier.etaMinutes,
        fare: selectedTier.price,
      })
      setIsBooking(false)
    }, 1200)
  }

  const tierIconMap: Record<string, React.ReactNode> = {
    standard: <Car className="w-5 h-5" />,
    comfort: <Sparkles className="w-5 h-5" />,
    electric: <Zap className="w-5 h-5" />,
    minivan: <Users className="w-5 h-5" />,
    vip: <Crown className="w-5 h-5" />,
  }

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => setCurrentPage('home')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black">City Taxi Service</h1>
              <p className="text-amber-100 text-sm">
                Verified drivers • Transparent fares • <span className="font-bold text-white">$0 Platform Fee</span>
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mt-5 text-sm">
            {[
              { icon: Car, label: '247 Drivers Online' },
              { icon: Timer, label: 'Avg 3 min pickup' },
              { icon: ShieldCheck, label: '100% Verified' },
              { icon: Star, label: '4.96★ Average' },
            ].map((s) => {
              const Icon = s.icon
              return (
                <span key={s.label} className="flex items-center gap-1.5 text-amber-100 font-medium">
                  <Icon className="w-4 h-4 text-white/80" />
                  {s.label}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {confirmedBooking ? (
          /* ─── Confirmed Booking State ─── */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-emerald-900 text-lg">Taxi Dispatched Successfully!</h3>
                <p className="text-sm text-emerald-700 mt-0.5">
                  Your driver has accepted and is heading to your pickup. Live tracking active.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-semibold text-emerald-900">
                  <span>Trip ID: {confirmedBooking.orderId}</span>
                  <span>•</span>
                  <span>Total Fare: ${confirmedBooking.fare.toFixed(2)} (No booking fee)</span>
                </div>
              </div>
            </div>

            {/* Driver Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <img
                    src={confirmedBooking.driver.avatar}
                    alt={confirmedBooking.driver.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-lg">{confirmedBooking.driver.name}</h4>
                      <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {confirmedBooking.driver.rating}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {confirmedBooking.driver.carModel}
                    </p>
                    <p className="text-sm text-slate-800 font-bold mt-0.5">
                      Plate: {confirmedBooking.driver.plateNumber}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-sm text-sky-700 font-semibold">
                      <Clock className="w-4 h-4" />
                      Arriving in approx{' '}
                      <span className="text-slate-900 font-black">{confirmedBooking.etaMinutes} mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={`tel:${confirmedBooking.driver.phone}`}
                    className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-sky-600" />
                    Call Driver
                  </a>
                  <button
                    onClick={() => setCurrentPage('orders')}
                    className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
                  >
                    Track Live
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Map */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Live Driver GPS Radar
                </span>
                <span className="text-sm text-emerald-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live GPS Active
                </span>
              </div>
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xs">
                <InteractiveMap
                  height="400px"
                  activeRoute={{
                    from: { x: 380, y: 270, label: pickup },
                    to: { x: 520, y: 340, label: destination },
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* ─── Booking Input State (Split Screen) ─── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-5 space-y-5">
              {/* Address Inputs */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Where are you going?</h3>

                {/* Pickup */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Pickup Location
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickup(currentLocation)}
                      className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
                    >
                      📍 Use Current Location
                    </button>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder="Enter pickup address..."
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Destination
                    </span>
                    {userProfile.savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setDestination(userProfile.savedAddresses[0].address)}
                        className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold"
                      >
                        🏠 {userProfile.savedAddresses[0].label}
                      </button>
                    )}
                  </label>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-rose-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Where are you going?"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-800"
                    />
                  </div>

                  {/* Quick Saved Places */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {SAVED_PLACES.slice(0, 3).map((place) => (
                      <button
                        key={place}
                        onClick={() => setDestination(place)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 font-medium transition-colors"
                      >
                        {place.split(',')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2.5">
                  <Compass className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Estimated route: <strong>8.2 km</strong> • Trip time: <strong>~14 min</strong></span>
                </div>
              </div>

              {/* Vehicle Tiers */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-3">Select Vehicle Tier</h3>
                <div className="space-y-2.5">
                  {TAXI_TYPES.map((tier) => {
                    const isSelected = selectedTier.id === tier.id
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTier(tier)}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-2 ring-amber-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tierIconMap[tier.id]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{tier.name}</span>
                              {tier.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{tier.description}</p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {tier.etaMinutes} min pickup
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Users className="w-3 h-3" />
                                {tier.capacity} seats
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Luggage className="w-3 h-3" />
                                {tier.luggage} bags
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-2">
                          <div className="text-lg font-black text-slate-900">${tier.price.toFixed(2)}</div>
                          <div className="text-[11px] font-semibold text-emerald-600">$0 Fee</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Free Promise */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Free Platform:</strong> OmniServe charges $0 commission. What you pay goes directly to the driver.
                </span>
              </div>

              {/* Book Button */}
              <button
                type="button"
                disabled={isBooking || !pickup || !destination}
                onClick={handleBookTaxi}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/30 active:scale-[0.99] disabled:opacity-50"
              >
                {isBooking ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Dispatching Nearest Driver...
                  </>
                ) : (
                  <>
                    <Car className="w-5 h-5" />
                    Book {selectedTier.name} — ${selectedTier.price.toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Right: Map */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live City Radar — Nearby Drivers
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs text-slate-600 font-semibold">4 Drivers Nearby</span>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ minHeight: '500px', height: '100%' }}>
                  <InteractiveMap
                    height="100%"
                    activeRoute={{
                      from: { x: 340, y: 260, label: pickup },
                      to: { x: 480, y: 330, label: destination },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
