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
  X,
  Compass,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { TAXI_TYPES } from '../../data/mockData'
import { TaxiVehicleType, DriverInfo } from '../../types'
import { InteractiveMap } from '../map/InteractiveMap'

interface TaxiBookingProps {
  onClose?: () => void
}

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

export const TaxiBooking: React.FC<TaxiBookingProps> = ({ onClose }) => {
  const { currentLocation, userProfile, addOrder, setCurrentPage } = useApp()

  const [pickup, setPickup] = useState<string>(currentLocation)
  const [destination, setDestination] = useState<string>('Tech Innovation Tower, 12th Floor')
  const [selectedTier, setSelectedTier] = useState<TaxiVehicleType>(TAXI_TYPES[0])
  const [isBooking, setIsBooking] = useState<boolean>(false)
  const [confirmedBooking, setConfirmedBooking] = useState<{
    orderId: string
    driver: DriverInfo
    etaMinutes: number
    fare: number
  } | null>(null)

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
    }, 1000)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-sky-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">City Taxi Service</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                100% Free Platform
              </span>
            </div>
            <p className="text-xs text-slate-500">Fast pickup, verified safe drivers & upfront transparent fares</p>
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

      {confirmedBooking ? (
        /* Confirmed Booking State */
        <div className="p-6 md:p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-900 text-base">Taxi Dispatched Successfully!</h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Your driver has accepted the trip and is on their way. Watch the vehicle on the live map below.
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-emerald-900">
                <span>Trip ID: {confirmedBooking.orderId}</span>
                <span>•</span>
                <span>Total Fare: ${confirmedBooking.fare.toFixed(2)} (No booking fee)</span>
              </div>
            </div>
          </div>

          {/* Driver Card */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={confirmedBooking.driver.avatar}
                alt={confirmedBooking.driver.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base">{confirmedBooking.driver.name}</h4>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {confirmedBooking.driver.rating} ({confirmedBooking.driver.tripsCount} trips)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {confirmedBooking.driver.carModel} • <span className="font-semibold text-slate-800">{confirmedBooking.driver.plateNumber}</span>
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Arriving in approx <strong className="text-slate-800">{confirmedBooking.etaMinutes} minutes</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <a
                href={`tel:${confirmedBooking.driver.phone}`}
                className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                Call Driver
              </a>
              <button
                onClick={() => {
                  if (onClose) onClose()
                  setCurrentPage('orders')
                }}
                className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                Open Orders Tracker
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live Map Preview with Route */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Driver Radar</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live GPS Active
              </span>
            </div>
            <InteractiveMap
              height="300px"
              activeRoute={{
                from: { x: 380, y: 270, label: pickup },
                to: { x: 520, y: 340, label: destination },
              }}
            />
          </div>
        </div>
      ) : (
        /* Booking Input & Selection State */
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form & Vehicle Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Address inputs */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {/* Pickup */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Pickup Location
                  </span>
                  <button
                    type="button"
                    onClick={() => setPickup(currentLocation)}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Current Location
                  </button>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup address..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Destination Location
                  </span>
                  {userProfile.savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setDestination(userProfile.savedAddresses[0].address)}
                      className="text-[11px] text-sky-600 hover:text-sky-700 font-medium"
                    >
                      Quick: {userProfile.savedAddresses[0].label}
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
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Options */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose Vehicle Tier</span>
                <span className="text-xs text-slate-400 font-medium">Estimated 8.2 km • ~14 min trip</span>
              </div>

              <div className="space-y-2">
                {TAXI_TYPES.map((tier) => {
                  const isSelected = selectedTier.id === tier.id
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/50 shadow-xs ring-2 ring-sky-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tier.id === 'standard' && <Car className="w-5 h-5" />}
                          {tier.id === 'comfort' && <Sparkles className="w-5 h-5" />}
                          {tier.id === 'electric' && <Zap className="w-5 h-5" />}
                          {tier.id === 'minivan' && <Users className="w-5 h-5" />}
                          {tier.id === 'vip' && <Crown className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{tier.name}</span>
                            {tier.badge && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                                {tier.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{tier.description}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>Pickup in {tier.etaMinutes} min</span>
                            <span>•</span>
                            <span>Up to {tier.capacity} seats</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-slate-900">${tier.price.toFixed(2)}</div>
                        <div className="text-[10px] font-semibold text-emerald-600">$0 Fee</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Transparent Free Platform Promise */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>100% Free Service:</strong> OmniServe charges $0 commission to riders. What you see is exactly what the driver earns.
              </span>
            </div>

            {/* Book Button */}
            <button
              type="button"
              disabled={isBooking || !pickup || !destination}
              onClick={handleBookTaxi}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isBooking ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Dispatching Nearest Driver...
                </>
              ) : (
                <>
                  <Car className="w-4 h-4" />
                  Book {selectedTier.name} (${selectedTier.price.toFixed(2)})
                </>
              )}
            </button>
          </div>

          {/* Right Column: Live Route Map */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Nearby Map</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                4 Drivers Nearby
              </span>
            </div>
            <div className="flex-1 min-h-[360px]">
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
      )}
    </div>
  )
}
