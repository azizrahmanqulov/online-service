import React, { useState } from 'react'
import {
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileText,
  Box,
  Truck,
  Phone,
  X,
  Compass,
  Lock,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PackageSize, CourierRequest } from '../../types'
import { InteractiveMap } from '../map/InteractiveMap'

interface CourierDeliveryProps {
  onClose?: () => void
}

interface PackageTier {
  type: PackageSize
  title: string
  subtitle: string
  maxWeight: string
  basePrice: number
  estMinutes: number
  icon: any
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
  },
  {
    type: 'small',
    title: 'Small Parcel',
    subtitle: 'Shoes, gifts, clothing, books',
    maxWeight: 'Up to 5.0 kg',
    basePrice: 5.8,
    estMinutes: 35,
    icon: Box,
  },
  {
    type: 'medium',
    title: 'Medium Box',
    subtitle: 'Electronics, multiple parcels, appliances',
    maxWeight: 'Up to 15.0 kg',
    basePrice: 9.5,
    estMinutes: 45,
    icon: Package,
  },
  {
    type: 'cargo',
    title: 'Heavy Cargo',
    subtitle: 'Furniture parts, heavy crates, bulk goods',
    maxWeight: 'Up to 35.0 kg',
    basePrice: 16.0,
    estMinutes: 60,
    icon: Truck,
  },
]

export const CourierDelivery: React.FC<CourierDeliveryProps> = ({ onClose }) => {
  const { currentLocation, userProfile, addOrder, setCurrentPage } = useApp()

  const [form, setForm] = useState<CourierRequest>({
    pickupAddress: currentLocation,
    pickupContact: userProfile.name,
    pickupPhone: userProfile.phone,
    deliveryAddress: '312 Maple Boulevard, Suite 5',
    recipientContact: 'Emily Carter',
    recipientPhone: '+1 (555) 912-4411',
    packageSize: 'small',
    weightKg: 2.5,
    urgentExpress: false,
    fragile: false,
    instructions: 'Please call recipient upon arrival at lobby.',
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [createdOrder, setCreatedOrder] = useState<{
    orderId: string
    trackingCode: string
    etaMinutes: number
    totalCost: number
  } | null>(null)

  const selectedTier = PACKAGE_TIERS.find((t) => t.type === form.packageSize) || PACKAGE_TIERS[0]
  const calculatedCost =
    selectedTier.basePrice + (form.urgentExpress ? 3.0 : 0) + (form.fragile ? 1.0 : 0)
  const estimatedTime = form.urgentExpress
    ? Math.floor(selectedTier.estMinutes * 0.65)
    : selectedTier.estMinutes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.pickupAddress || !form.deliveryAddress || !form.recipientContact) return

    setIsSubmitting(true)
    setTimeout(() => {
      const trackingCode = 'EXP-' + Math.floor(100000 + Math.random() * 900000)
      const orderId = addOrder({
        serviceId: 'courier',
        serviceName: 'Package Courier',
        title: `${selectedTier.title} Delivery`,
        subtitle: `To: ${form.recipientContact} • PIN ${trackingCode.slice(-4)}`,
        totalAmount: calculatedCost,
        currency: '$',
        status: 'driver_assigned',
        progressStep: 2,
        statusText: `Courier assigned (${form.urgentExpress ? 'Express Speed' : 'Standard Speed'})`,
        estimatedTime: `${estimatedTime} mins`,
        pickupLocation: form.pickupAddress,
        dropoffLocation: form.deliveryAddress,
        trackingCode,
        driverOrCourier: {
          name: 'Marco Rossi',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
          rating: 4.95,
          tripsCount: 1640,
          phone: '+1 (555) 702-3319',
          carModel: 'Express E-Scooter',
          carColor: 'Ocean Teal',
          plateNumber: 'SC-881',
        },
        mapCoords: { x: 420, y: 310 },
      })

      setCreatedOrder({
        orderId,
        trackingCode,
        etaMinutes: estimatedTime,
        totalCost: calculatedCost,
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-600/10 via-sky-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Courier & Parcel Delivery</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Live Door-to-Door Tracking
              </span>
            </div>
            <p className="text-xs text-slate-500">Fast, secure local parcel dispatch with real-time tracking code</p>
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

      {createdOrder ? (
        /* Confirmed Order State */
        <div className="p-6 md:p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-900 text-base">Courier Dispatched & Route Active!</h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Courier Marco is heading to your pickup location. Share the tracking PIN with recipient for handoff.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-emerald-900">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Security PIN: {createdOrder.trackingCode}
                </span>
                <span>•</span>
                <span>Total: ${createdOrder.totalCost.toFixed(2)} ($0 platform fee)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Route Summary */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Details</span>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block">From (Pickup)</span>
                  <span className="font-semibold text-slate-800">{form.pickupAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">To (Recipient)</span>
                  <span className="font-semibold text-slate-800">{form.deliveryAddress}</span>
                  <p className="text-slate-500 mt-0.5">{form.recipientContact} • {form.recipientPhone}</p>
                </div>
                <div>
                  <span className="text-slate-400 block">Package Type</span>
                  <span className="font-semibold text-purple-700">{selectedTier.title} ({form.weightKg} kg)</span>
                </div>
              </div>
            </div>

            {/* Courier Card */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Courier</span>
                <div className="flex items-center gap-3 mt-3">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
                    alt="Courier"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Marco Rossi</h5>
                    <p className="text-xs text-slate-500">Express E-Scooter • ★ 4.95</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">ETA: ~{createdOrder.etaMinutes} mins</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <a
                  href="tel:+15557023319"
                  className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-100"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-600" />
                  Call Courier
                </a>
                <button
                  onClick={() => {
                    if (onClose) onClose()
                    setCurrentPage('orders')
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  Track in Orders
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Live Courier Progress
            </span>
            <InteractiveMap
              height="280px"
              activeRoute={{
                from: { x: 320, y: 280, label: form.pickupAddress },
                to: { x: 540, y: 390, label: form.deliveryAddress },
              }}
            />
          </div>
        </div>
      ) : (
        /* Courier Input Form */
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Package Size Tiers */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              1. Select Package Size
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PACKAGE_TIERS.map((tier) => {
                const Icon = tier.icon
                const isSelected = form.packageSize === tier.type
                return (
                  <button
                    key={tier.type}
                    type="button"
                    onClick={() => setForm({ ...form, packageSize: tier.type })}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{tier.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{tier.subtitle}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{tier.maxWeight}</span>
                      <span className="font-bold text-slate-900 text-xs">${tier.basePrice.toFixed(2)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Pickup Details (Sender)
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pickup Address</label>
                <input
                  type="text"
                  value={form.pickupAddress}
                  onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                  placeholder="Address or apartment..."
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sender Name</label>
                  <input
                    type="text"
                    value={form.pickupContact}
                    onChange={(e) => setForm({ ...form, pickupContact: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sender Phone</label>
                  <input
                    type="text"
                    value={form.pickupPhone}
                    onChange={(e) => setForm({ ...form, pickupPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Delivery Details (Recipient)
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dropoff Address</label>
                <input
                  type="text"
                  value={form.deliveryAddress}
                  onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                  placeholder="Destination address..."
                  required
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={form.recipientContact}
                    onChange={(e) => setForm({ ...form, recipientContact: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Recipient Phone</label>
                  <input
                    type="text"
                    value={form.recipientPhone}
                    onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Options: Express & Fragile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                form.urgentExpress
                  ? 'border-purple-600 bg-purple-50/40 text-purple-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className={`w-4 h-4 ${form.urgentExpress ? 'text-purple-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Express Delivery (Rush)</div>
                  <div className="text-[11px] text-slate-500">Delivered within 30-40 min (+$3.00)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.urgentExpress}
                onChange={(e) => setForm({ ...form, urgentExpress: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                form.fragile
                  ? 'border-purple-600 bg-purple-50/40 text-purple-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-4 h-4 ${form.fragile ? 'text-purple-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Handle with Care (Fragile)</div>
                  <div className="text-[11px] text-slate-500">Extra bubble wrap & gentle transit (+$1.00)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={form.fragile}
                onChange={(e) => setForm({ ...form, fragile: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>

          {/* Submission Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900">${calculatedCost.toFixed(2)}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  $0 Fee Platform
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Estimated transit: ~{estimatedTime} minutes • PIN Handshake
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Assigning Courier...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Send Parcel Now
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
