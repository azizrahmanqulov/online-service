import React, { useState } from 'react'
import {
  Compass,
  MapPin,
  Clock,
  Car,
  Users,
  Check,
  Star,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  CheckCircle2,
  Calendar,
  Wifi,
  Coffee,
  Snowflake,
  Music,
  Ticket,
  Navigation,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { INTERCITY_TRIPS, POPULAR_INTERCITY_ROUTES } from '../../data/mockData'
import { IntercityTrip } from '../../types'

const CITIES = [
  'Central Metro',
  'Seaside Bay',
  'Highland Peak',
  'Silicon District',
  'Old Town Harbor',
  'Airport Grand Hub',
]

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3.5 h-3.5" />,
  'Coffee': <Coffee className="w-3.5 h-3.5" />,
  'AC': <Snowflake className="w-3.5 h-3.5" />,
  'Music': <Music className="w-3.5 h-3.5" />,
}

const SEAT_LABELS: Record<number, string> = {
  1: 'Driver',
  2: 'Front Passenger',
  3: 'Back Left Window',
  4: 'Back Middle',
  5: 'Back Right Window',
}

export const IntercityFullView: React.FC = () => {
  const { addOrder, setCurrentPage, userProfile } = useApp()

  const [fromCity, setFromCity] = useState('Central Metro')
  const [toCity, setToCity] = useState('Seaside Bay')
  const [travelDate, setTravelDate] = useState('Today')
  const [selectedTrip, setSelectedTrip] = useState<IntercityTrip | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)
  const [isReserving, setIsReserving] = useState(false)
  const [confirmedReservation, setConfirmedReservation] = useState<{
    orderId: string
    trip: IntercityTrip
    seat: number
  } | null>(null)

  const filteredTrips = INTERCITY_TRIPS.filter((t) => {
    if (fromCity && toCity) {
      return (
        t.fromCity.toLowerCase().includes(fromCity.toLowerCase()) &&
        t.toCity.toLowerCase().includes(toCity.toLowerCase())
      )
    }
    return true
  })

  const tripsToDisplay = filteredTrips.length > 0 ? filteredTrips : INTERCITY_TRIPS

  const handleSelectRoute = (from: string, to: string) => {
    setFromCity(from)
    setToCity(to)
    setSelectedTrip(null)
    setSelectedSeat(null)
  }

  const handleConfirmReservation = () => {
    if (!selectedTrip || !selectedSeat) return

    setIsReserving(true)
    setTimeout(() => {
      const orderId = addOrder({
        serviceId: 'intercity',
        serviceName: 'Intercity Taxi',
        title: `${selectedTrip.fromCity} → ${selectedTrip.toCity}`,
        subtitle: `Seat #${selectedSeat} reserved • ${selectedTrip.carModel}`,
        totalAmount: selectedTrip.pricePerSeat,
        currency: '$',
        status: 'confirmed',
        progressStep: 1,
        statusText: `Departure scheduled for ${selectedTrip.departureTime} at ${selectedTrip.pickupPoint}`,
        estimatedTime: selectedTrip.departureTime,
        pickupLocation: selectedTrip.pickupPoint,
        dropoffLocation: selectedTrip.dropoffPoint,
        driverOrCourier: selectedTrip.driver,
        details: {
          seatNumber: selectedSeat,
          departureTime: selectedTrip.departureTime,
          duration: selectedTrip.duration,
          car: selectedTrip.carModel,
        },
      })

      setConfirmedReservation({ orderId, trip: selectedTrip, seat: selectedSeat })
      setIsReserving(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setCurrentPage('home')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Long-Distance Intercity Taxi</h1>
              <p className="text-blue-100 text-sm">
                City-to-city single seats & full cars • Verified drivers • <span className="font-bold text-white">$0 Platform Fee</span>
              </p>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Popular Routes</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              {POPULAR_INTERCITY_ROUTES.map((route, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRoute(route.from, route.to)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 border ${
                    fromCity === route.from && toCity === route.to
                      ? 'bg-white text-blue-700 border-white shadow-md'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {route.from} → {route.to}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {confirmedReservation ? (
          /* ─── Confirmed Reservation ─── */
          <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-emerald-900 text-lg">Intercity Seat Reserved!</h3>
                <p className="text-sm text-emerald-700 mt-0.5">
                  Your seat is confirmed. Meet the driver at the departure terminal listed below.
                </p>
              </div>
            </div>

            {/* Digital Boarding Pass */}
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-300 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-7 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200">OmniServe Intercity Pass</p>
                    <h4 className="text-2xl font-black mt-1">
                      {confirmedReservation.trip.fromCity} → {confirmedReservation.trip.toCity}
                    </h4>
                  </div>
                  <Ticket className="w-10 h-10 text-white/40" />
                </div>
              </div>

              <div className="px-7 py-6 grid grid-cols-2 sm:grid-cols-4 gap-5">
                {[
                  { label: 'Seat', value: `#${confirmedReservation.seat} — ${SEAT_LABELS[confirmedReservation.seat] || 'Passenger'}` },
                  { label: 'Departure', value: confirmedReservation.trip.departureTime },
                  { label: 'Arrival', value: confirmedReservation.trip.arrivalTime },
                  { label: 'Duration', value: confirmedReservation.trip.duration },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="px-7 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={confirmedReservation.trip.driver.avatar}
                    alt={confirmedReservation.trip.driver.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{confirmedReservation.trip.driver.name}</p>
                    <p className="text-xs text-slate-500">
                      {confirmedReservation.trip.carModel} • Plate: {confirmedReservation.trip.driver.plateNumber}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pickup Gate</p>
                  <p className="text-sm font-bold text-slate-900">{confirmedReservation.trip.pickupPoint}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Paid</p>
                  <p className="text-lg font-black text-emerald-600">${confirmedReservation.trip.pricePerSeat.toFixed(2)}</p>
                </div>
              </div>

              <div className="px-7 py-4 bg-amber-50 border-t border-amber-200">
                <p className="text-xs font-bold text-amber-800">
                  📍 Departure Gate Instructions: {confirmedReservation.trip.pickupPoint} — Arrive 10 mins early. Your driver will have a sign with your name. Booking ID: <strong>{confirmedReservation.orderId}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`tel:${confirmedReservation.trip.driver.phone}`}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-sky-600" />
                Call Driver
              </a>
              <button
                onClick={() => setCurrentPage('orders')}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                My Orders & Passes
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : selectedTrip ? (
          /* ─── Trip Selected: Seat Picker ─── */
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
            <button
              onClick={() => { setSelectedTrip(null); setSelectedSeat(null) }}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to available trips
            </button>

            {/* Trip Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {selectedTrip.fromCity} → {selectedTrip.toCity}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-sky-600" />
                      {selectedTrip.departureTime} → {selectedTrip.arrivalTime}
                    </span>
                    <span>•</span>
                    <span>{selectedTrip.duration}</span>
                    <span>•</span>
                    <span>{selectedTrip.carModel}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black text-slate-900">${selectedTrip.pricePerSeat.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">per seat</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTrip.features.map((f) => (
                  <span key={f} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-700 font-medium">
                    {FEATURE_ICONS[f] || <Sparkles className="w-3 h-3" />}
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Seat Selector — Car Interior Layout */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="font-bold text-slate-900 mb-4">Choose Your Seat</h4>

              {/* Car Layout Visual */}
              <div className="relative bg-slate-100 rounded-2xl p-6 border border-slate-200">
                {/* Steering wheel indicator */}
                <div className="flex justify-start mb-2">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-400 flex items-center justify-center">
                    <Car className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Front Row */}
                <div className="flex items-center gap-2 mb-4 justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Seat 1 - Driver */}
                    <div className="w-14 h-14 rounded-xl bg-slate-300 border border-slate-400 flex items-center justify-center text-xs font-bold text-slate-600">
                      Driver
                    </div>
                    <div className="flex-1" />
                    {/* Seat 2 - Front Passenger */}
                    {[2].map((seat) => {
                      const isAvailable = selectedTrip.availableSeats.includes(seat)
                      const isSelected = selectedSeat === seat
                      return (
                        <button
                          key={seat}
                          disabled={!isAvailable}
                          onClick={() => setSelectedSeat(isSelected ? null : seat)}
                          className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : isAvailable
                              ? 'bg-white border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                              : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isAvailable ? (isSelected ? <Check className="w-4 h-4" /> : `#${seat}`) : '✗'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Back Row */}
                <div className="flex items-center justify-around gap-2">
                  {[3, 4, 5].map((seat) => {
                    const isAvailable = selectedTrip.availableSeats.includes(seat)
                    const isSelected = selectedSeat === seat
                    return (
                      <button
                        key={seat}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSeat(isSelected ? null : seat)}
                        className={`flex-1 h-14 rounded-xl border-2 flex flex-col items-center justify-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : isAvailable
                            ? 'bg-white border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                            : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? (
                          isSelected ? <Check className="w-4 h-4" /> : (
                            <>
                              <span>#{seat}</span>
                              <span className="text-[9px] mt-0.5 opacity-70">
                                {seat === 3 ? 'L' : seat === 4 ? 'Mid' : 'R'}
                              </span>
                            </>
                          )
                        ) : '✗'}
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-white border border-slate-300" />
                    Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-600" />
                    Selected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300" />
                    Taken
                  </span>
                </div>
              </div>

              {selectedSeat && (
                <div className="mt-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-800 font-semibold">
                  ✅ Seat #{selectedSeat} selected — {SEAT_LABELS[selectedSeat]}
                </div>
              )}
            </div>

            {/* Confirm Button */}
            <button
              disabled={!selectedSeat || isReserving}
              onClick={handleConfirmReservation}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50"
            >
              {isReserving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Reserving Seat...
                </>
              ) : (
                <>
                  <Ticket className="w-5 h-5" />
                  Confirm Seat #{selectedSeat} — ${selectedTrip.pricePerSeat.toFixed(2)}
                </>
              )}
            </button>
          </div>
        ) : (
          /* ─── Trip Selection ─── */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900">Find a Route</h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">From City</label>
                  <select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-800"
                  >
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">To City</label>
                  <select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-800"
                  >
                    {CITIES.filter((c) => c !== fromCity).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Travel Date</label>
                  <select
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-800"
                  >
                    {['Today', 'Tomorrow', 'This Week'].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                  Free cancellation up to 2 hours before departure.
                </div>
              </div>
            </div>

            {/* Trips List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">
                  {tripsToDisplay.length} trips available
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    {fromCity} → {toCity}
                  </span>
                </h3>
              </div>

              {tripsToDisplay.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <div className="text-lg font-black text-slate-900">
                            {trip.departureTime}
                            <span className="text-slate-400 font-medium mx-2">→</span>
                            {trip.arrivalTime}
                          </div>
                          <div className="text-sm text-slate-500 mt-0.5">
                            {trip.fromCity} → {trip.toCity} • {trip.duration} journey
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={trip.driver.avatar}
                          alt={trip.driver.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-sm font-semibold text-slate-800">{trip.driver.name}</span>
                          <span className="ml-2 text-xs font-bold text-amber-600 flex items-center gap-0.5 inline-flex">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {trip.driver.rating}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">• {trip.carModel}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {trip.features.map((f) => (
                          <span key={f} className="px-2 py-0.5 rounded-lg bg-slate-100 text-xs text-slate-600 font-medium flex items-center gap-1">
                            {FEATURE_ICONS[f] || null}{f}
                          </span>
                        ))}
                        <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-xs text-sky-700 font-bold flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {trip.availableSeats.length} seats left
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">${trip.pricePerSeat.toFixed(2)}</p>
                        <p className="text-xs text-slate-500">per seat • $0 fee</p>
                      </div>
                      <button
                        onClick={() => { setSelectedTrip(trip); setSelectedSeat(null) }}
                        className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
                      >
                        Select Seat
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
