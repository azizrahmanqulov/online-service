import React, { useState } from 'react'
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  Check,
  Star,
  Luggage,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  X,
  Phone,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { INTERCITY_TRIPS, POPULAR_INTERCITY_ROUTES } from '../../data/mockData'
import { IntercityTrip } from '../../types'

interface IntercityTaxiProps {
  onClose?: () => void
}

const CITIES = [
  'Central Metro',
  'Seaside Bay',
  'Highland Peak',
  'Silicon District',
  'Old Town Harbor',
  'Airport Grand Hub',
]

export const IntercityTaxi: React.FC<IntercityTaxiProps> = ({ onClose }) => {
  const { addOrder, setCurrentPage, userProfile } = useApp()

  const [fromCity, setFromCity] = useState<string>('Central Metro')
  const [toCity, setToCity] = useState<string>('Seaside Bay')
  const [travelDate, setTravelDate] = useState<string>('Today')
  const [selectedTrip, setSelectedTrip] = useState<IntercityTrip | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)
  const [isReserving, setIsReserving] = useState<boolean>(false)
  const [confirmedReservation, setConfirmedReservation] = useState<{
    orderId: string
    trip: IntercityTrip
    seat: number
  } | null>(null)

  // Filter trips by city pair if matched, or return all
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

      setConfirmedReservation({
        orderId,
        trip: selectedTrip,
        seat: selectedSeat,
      })
      setIsReserving(false)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Long-Distance Intercity Taxi</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Direct City-to-City
              </span>
            </div>
            <p className="text-xs text-slate-500">Book comfortable single seats or entire vehicles between cities with verified drivers</p>
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

      {confirmedReservation ? (
        /* Confirmed Reservation Card */
        <div className="p-6 md:p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-900 text-base">Seat Reserved Successfully!</h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Your seat has been reserved. Your driver will meet you at the departure terminal. No cancellation fees.
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-emerald-900">
                <span>Pass ID: {confirmedReservation.orderId}</span>
                <span>•</span>
                <span>Seat #{confirmedReservation.seat} ({confirmedReservation.seat === 1 ? 'Front' : 'Window / Aisle'})</span>
              </div>
            </div>
          </div>

          {/* Boarding Pass Summary Card */}
          <div className="p-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">Intercity Boarding Pass</span>
                <h4 className="text-xl font-black text-slate-900 mt-0.5">
                  {confirmedReservation.trip.fromCity} → {confirmedReservation.trip.toCity}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Departure</span>
                <p className="text-lg font-bold text-slate-900">{confirmedReservation.trip.departureTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block">Seat</span>
                <span className="font-bold text-slate-800 text-sm">#{confirmedReservation.seat} (Confirmed)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Travel Duration</span>
                <span className="font-bold text-slate-800 text-sm">{confirmedReservation.trip.duration}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Vehicle</span>
                <span className="font-bold text-slate-800 text-sm truncate block">{confirmedReservation.trip.carModel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Price</span>
                <span className="font-bold text-emerald-600 text-sm">${confirmedReservation.trip.pricePerSeat.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={confirmedReservation.trip.driver.avatar}
                  alt={confirmedReservation.trip.driver.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">{confirmedReservation.trip.driver.name}</p>
                  <p className="text-[11px] text-slate-500">Plate: {confirmedReservation.trip.driver.plateNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${confirmedReservation.trip.driver.phone}`}
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-100"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  Call Driver
                </a>
                <button
                  onClick={() => {
                    if (onClose) onClose()
                    setCurrentPage('orders')
                  }}
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  View in Orders
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Intercity Planner & Trip Selection */
        <div className="p-6 md:p-8 space-y-6">
          {/* Quick Route Selector Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {/* From City */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Departure City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* To City */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Destination City</label>
              <div className="relative">
                <Compass className="w-4 h-4 text-indigo-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {CITIES.filter((c) => c !== fromCity).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Travel Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Today">Today (Fast Departure)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Weekend">This Weekend</option>
                </select>
              </div>
            </div>
          </div>

          {/* Popular Routes Pills */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Popular Intercity Routes
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_INTERCITY_ROUTES.map((route, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectRoute(route.from, route.to)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                    fromCity === route.from && toCity === route.to
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>
                    {route.from} → {route.to}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-700 font-bold">${route.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Available Scheduled Trips List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available Departures ({tripsToDisplay.length})
              </span>
              <span className="text-xs text-emerald-600 font-semibold">$0 Platform Fee Guarantee</span>
            </div>

            <div className="space-y-3">
              {tripsToDisplay.map((trip) => {
                const isSelected = selectedTrip?.id === trip.id
                return (
                  <div
                    key={trip.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Trip time & Route */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">{trip.departureTime}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-600">{trip.arrivalTime}</span>
                          <span className="text-xs text-slate-400">({trip.duration})</span>
                        </div>

                        <div className="text-xs font-medium text-slate-700">
                          {trip.fromCity} → {trip.toCity}
                        </div>
                        <p className="text-[11px] text-slate-400">Pickup: {trip.pickupPoint}</p>
                      </div>

                      {/* Driver & Car */}
                      <div className="flex items-center gap-3">
                        <img
                          src={trip.driver.avatar}
                          alt={trip.driver.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div className="text-xs">
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <span>{trip.driver.name}</span>
                            <span className="text-amber-500">★ {trip.driver.rating}</span>
                          </div>
                          <span className="text-slate-500">{trip.carModel}</span>
                          <div className="text-[11px] text-emerald-600 font-semibold">
                            {trip.availableSeats.length} of {trip.totalSeats} seats left
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center sm:flex-col items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <div>
                          <span className="text-lg font-black text-slate-900">${trip.pricePerSeat}</span>
                          <span className="text-xs text-slate-400">/seat</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTrip(trip)
                            setSelectedSeat(trip.availableSeats[0] || 1)
                          }}
                          className={`mt-1 py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {isSelected ? 'Seats Selected' : 'Select Seats'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Seat Map if selected */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-slate-200/80 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-slate-700">Choose Your Preferred Seat:</span>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                              Selected
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                              Reserved
                            </span>
                          </div>
                        </div>

                        {/* Interactive Car Layout */}
                        <div className="max-w-xs mx-auto bg-slate-100 p-4 rounded-2xl border border-slate-200">
                          <div className="text-[10px] uppercase font-bold text-slate-400 text-center mb-2">
                            Front of Vehicle (Driver: {trip.driver.name})
                          </div>
                          
                          {/* Front row */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="py-2.5 px-3 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold text-center">
                              Driver Wheel
                            </div>
                            <button
                              type="button"
                              disabled={!trip.availableSeats.includes(1)}
                              onClick={() => setSelectedSeat(1)}
                              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                                selectedSeat === 1
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : trip.availableSeats.includes(1)
                                  ? 'bg-white text-slate-800 hover:bg-blue-50 border border-slate-200'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              Seat 1 (Front Window)
                            </button>
                          </div>

                          {/* Back row */}
                          <div className="grid grid-cols-3 gap-2">
                            {[2, 3, 4].map((seatNum) => {
                              const isAvailable = trip.availableSeats.includes(seatNum)
                              const isChosen = selectedSeat === seatNum
                              return (
                                <button
                                  key={seatNum}
                                  type="button"
                                  disabled={!isAvailable}
                                  onClick={() => setSelectedSeat(seatNum)}
                                  className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                                    isChosen
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : isAvailable
                                      ? 'bg-white text-slate-800 hover:bg-blue-50 border border-slate-200'
                                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  }`}
                                >
                                  Seat #{seatNum}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Features checklist */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {trip.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1"
                            >
                              <Check className="w-3 h-3 text-emerald-600" />
                              {feat}
                            </span>
                          ))}
                        </div>

                        {/* Reserve Action Bar */}
                        <div className="mt-4 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-xs text-slate-500">Seat #{selectedSeat} reserved for you</span>
                            <p className="text-sm font-bold text-slate-900">Total: ${trip.pricePerSeat.toFixed(2)}</p>
                          </div>
                          <button
                            type="button"
                            disabled={isReserving}
                            onClick={handleConfirmReservation}
                            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
                          >
                            {isReserving ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Reserving Seat...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Confirm Seat Reservation
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
