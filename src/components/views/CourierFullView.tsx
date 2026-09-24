import React, { useState, useCallback } from 'react'
import {
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Box,
  Truck,
  Phone,
  Compass,
  Lock,
  User,
  AlertTriangle,
  Navigation,
  Hash,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PackageSize } from '../../types'
import { InteractiveMap } from '../map/InteractiveMap'

interface PackageTier {
  type: PackageSize
  title: string
  subtitle: string
  maxWeight: string
  basePrice: number
  estMinutes: number
  icon: any
  color: string
  bg: string
}

const PACKAGE_TIERS: PackageTier[] = [
  {
    type: 'envelope',
    title: 'Document / Envelope',
    subtitle: 'Passports, contracts, keys, letters',
    maxWeight: 'Up to 1.0 kg',
    basePrice: 3.5,
    estMinutes: 30,
    icon: FileText,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    type: 'small',
    title: 'Small Parcel',
    subtitle: 'Shoes, gifts, clothing, books',
    maxWeight: 'Up to 5.0 kg',
    basePrice: 5.8,
    estMinutes: 35,
    icon: Box,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    type: 'medium',
    title: 'Medium Box',
    subtitle: 'Electronics, multiple parcels, appliances',
    maxWeight: 'Up to 15.0 kg',
    basePrice: 9.5,
    estMinutes: 40,
    icon: Package,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    type: 'cargo',
    title: 'Large Cargo',
    subtitle: 'Furniture, heavy equipment, pallets',
    maxWeight: 'Up to 60.0 kg',
    basePrice: 18.0,
    estMinutes: 55,
    icon: Truck,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
]

const MOCK_COURIER = {
  name: 'Marcus Reid',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  rating: 4.94,
  tripsCount: 3120,
  phone: '+1 (555) 627-0044',
  carModel: 'Honda Express Van (White)',
  carColor: 'White',
  plateNumber: '7-XPR-302',
}

const generatePIN = () => Math.floor(1000 + Math.random() * 9000).toString()

export const CourierFullView: React.FC = () => {
  const { currentLocation, addOrder, setCurrentPage } = useApp()

  const [selectedTier, setSelectedTier] = useState<PackageTier>(PACKAGE_TIERS[0])
  const [pickupAddress, setPickupAddress] = useState(currentLocation)
  const [pickupContact, setPickupContact] = useState('Samira Vance')
  const [pickupPhone, setPickupPhone] = useState('+1 (555) 234-5678')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [recipientContact, setRecipientContact] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [urgentExpress, setUrgentExpress] = useState(false)
  const [fragile, setFragile] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [isDispatching, setIsDispatching] = useState(false)
  const [confirmedDispatch, setConfirmedDispatch] = useState<{
    orderId: string
    pin: string
  } | null>(null)

  const totalPrice = selectedTier.basePrice * (urgentExpress ? 1.5 : 1)
  const estMinutes = selectedTier.estMinutes - (urgentExpress ? 10 : 0)

  const handleDispatch = () => {
    if (!pickupAddress || !deliveryAddress || !recipientContact) return
    setIsDispatching(true)
    const pin = generatePIN()

    setTimeout(() => {
      const orderId = addOrder({
        serviceId: 'courier',
        serviceName: 'Courier Delivery',
        title: `${selectedTier.title} to ${deliveryAddress.split(',')[0]}`,
        subtitle: `${urgentExpress ? 'Express Rush' : 'Standard'} • ${selectedTier.maxWeight}`,
        totalAmount: totalPrice,
        currency: '$',
        status: 'confirmed',
        progressStep: 1,
        statusText: 'Courier assigned and heading to pickup',
        estimatedTime: `~${estMinutes} min`,
        pickupLocation: pickupAddress,
        dropoffLocation: deliveryAddress,
        driverOrCourier: MOCK_COURIER,
        trackingCode: pin,
        details: {
          packageType: selectedTier.title,
          isFragile: fragile,
          isExpress: urgentExpress,
          securityPin: pin,
        },
      })
      setConfirmedDispatch({ orderId, pin })
      setIsDispatching(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-violet-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('home')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Courier & Parcel Dispatch</h1>
              <p className="text-violet-100 text-sm">
                Door-to-door • Verified couriers • Secure PIN handoff • <span className="font-bold text-white">$0 Commission</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {confirmedDispatch ? (
          /* ─── Confirmed Dispatch ─── */
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-emerald-900 text-lg">Courier Dispatched!</h3>
                <p className="text-sm text-emerald-700 mt-0.5">
                  Your courier is on the way. Use the Security PIN to hand off the parcel safely.
                </p>
              </div>
            </div>

            {/* Security PIN Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs">
              <Lock className="w-8 h-8 text-violet-600 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Security Handoff PIN</p>
              <div className="text-5xl font-black text-slate-900 tracking-[0.2em] my-3">
                {confirmedDispatch.pin}
              </div>
              <p className="text-xs text-slate-500">
                Share this PIN only with your courier upon handoff. Never share online.
              </p>
              <p className="mt-2 text-xs font-semibold text-violet-700 bg-violet-50 rounded-xl px-4 py-2">
                Order ID: {confirmedDispatch.orderId}
              </p>
            </div>

            {/* Courier Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={MOCK_COURIER.avatar}
                    alt={MOCK_COURIER.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-black text-slate-900">{MOCK_COURIER.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{MOCK_COURIER.carModel}</p>
                    <p className="text-xs text-slate-800 font-bold">Plate: {MOCK_COURIER.plateNumber}</p>
                    <p className="text-xs text-violet-700 font-semibold mt-1">ETA: ~{estMinutes} min</p>
                  </div>
                </div>
                <a
                  href={`tel:${MOCK_COURIER.phone}`}
                  className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  Call
                </a>
              </div>
            </div>

            {/* Route Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <InteractiveMap
                height="300px"
                activeRoute={{
                  from: { x: 330, y: 280, label: pickupAddress },
                  to: { x: 510, y: 350, label: deliveryAddress },
                }}
              />
            </div>

            <button
              onClick={() => setCurrentPage('orders')}
              className="w-full py-3.5 px-5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              Track Live Delivery
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* ─── Dispatch Form ─── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-5 space-y-5">
              {/* Package Size Selector */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base mb-3">1. Package Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PACKAGE_TIERS.map((tier) => {
                    const Icon = tier.icon
                    const isSelected = selectedTier.type === tier.type
                    return (
                      <button
                        key={tier.type}
                        onClick={() => setSelectedTier(tier)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-violet-500 bg-violet-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${tier.bg} flex items-center justify-center mb-2`}>
                          <Icon className={`w-5 h-5 ${tier.color}`} />
                        </div>
                        <p className="text-sm font-bold text-slate-900">{tier.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{tier.maxWeight}</p>
                        <p className="text-base font-black text-slate-900 mt-1">${tier.basePrice.toFixed(2)}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sender / Recipient Forms */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">2. Pickup Details</h3>

                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Sender address..."
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={pickupContact}
                        onChange={(e) => setPickupContact(e.target.value)}
                        placeholder="Sender name"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-slate-800"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        value={pickupPhone}
                        onChange={(e) => setPickupPhone(e.target.value)}
                        placeholder="Sender phone"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base pt-1">3. Delivery Details</h3>

                <div className="space-y-3">
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Recipient address..."
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={recipientContact}
                        onChange={(e) => setRecipientContact(e.target.value)}
                        placeholder="Recipient name"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-slate-800"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="Recipient phone"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-slate-800"
                      />
                    </div>
                  </div>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Delivery notes (optional): ring bell, leave at door, call before arrival..."
                    rows={2}
                    className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-medium text-slate-800 resize-none"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900 text-base">4. Delivery Options</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setUrgentExpress(!urgentExpress)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      urgentExpress
                        ? 'border-orange-500 bg-orange-50/60'
                        : 'border-slate-200 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className={`w-5 h-5 ${urgentExpress ? 'text-orange-500' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Rush Express Delivery</p>
                        <p className="text-xs text-slate-500">Priority routing, ~10 min faster (+50% price)</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${urgentExpress ? 'text-orange-600' : 'text-slate-400'}`}>
                      {urgentExpress ? '✓ On' : 'Off'}
                    </span>
                  </button>

                  <button
                    onClick={() => setFragile(!fragile)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      fragile
                        ? 'border-amber-500 bg-amber-50/60'
                        : 'border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${fragile ? 'text-amber-500' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Fragile / Handle with Care</p>
                        <p className="text-xs text-slate-500">Extra padding & careful handling flagged</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${fragile ? 'text-amber-600' : 'text-slate-400'}`}>
                      {fragile ? '✓ On' : 'Off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Summary & Dispatch Button */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-600">Base price ({selectedTier.title})</span>
                  <span className="font-bold text-slate-900">${selectedTier.basePrice.toFixed(2)}</span>
                </div>
                {urgentExpress && (
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-600">Rush Express surcharge</span>
                    <span className="font-bold text-orange-600">+${(selectedTier.basePrice * 0.5).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-black border-t border-slate-100 pt-3">
                  <span className="text-slate-900">Total</span>
                  <span className="text-violet-700">${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  disabled={isDispatching || !pickupAddress || !deliveryAddress || !recipientContact}
                  onClick={handleDispatch}
                  className="w-full mt-4 py-4 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isDispatching ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Dispatching Courier...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      Dispatch Courier — ${totalPrice.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Map & Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Route Preview
                  </span>
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-violet-600" />
                    Est. {estMinutes} min
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <InteractiveMap
                    height="380px"
                    activeRoute={
                      deliveryAddress
                        ? {
                            from: { x: 320, y: 270, label: pickupAddress },
                            to: { x: 520, y: 360, label: deliveryAddress },
                          }
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-violet-900">Secure PIN Handoff System</p>
                    <p className="text-xs text-violet-700 mt-1 leading-relaxed">
                      Once dispatched, a unique 4-digit security PIN is generated. You share this PIN with the recipient, 
                      who must provide it to the courier at dropoff. This ensures safe and verified delivery every time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-sm text-emerald-800">
                  <strong>100% Free Platform:</strong> No commission charged. Courier earns the full dispatch fee.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
