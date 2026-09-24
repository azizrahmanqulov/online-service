import React from 'react'
import {
  Car,
  Compass,
  Utensils,
  Package,
  ShoppingBag,
  Bus,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ServiceId } from '../../types'

export const ServicesView: React.FC = () => {
  const { setActiveServiceModal } = useApp()

  const allServices: {
    id: ServiceId
    title: string
    shortDesc: string
    fullDesc: string
    icon: any
    color: string
    accentBg: string
    badge: string
    features: string[]
    actionLabel: string
  }[] = [
    {
      id: 'taxi',
      title: 'City Taxi Service',
      shortDesc: 'Instant ride booking across the city',
      fullDesc:
        'Connect with verified professional drivers in under 3 minutes. Choose from Standard, Comfort, Eco Electric, or Minivans with upfront pricing and zero surge markup.',
      icon: Car,
      color: 'text-amber-500',
      accentBg: 'bg-amber-500',
      badge: 'Instant Dispatch',
      features: [
        'Real-time live map tracking of driver arrival',
        'Multiple car tiers (Standard, Comfort, Electric, Van)',
        'Full driver profile, rating, and vehicle plate display',
        'No surge pricing or hidden platform commissions',
      ],
      actionLabel: 'Book Taxi Now',
    },
    {
      id: 'intercity',
      title: 'Long-Distance Intercity Taxi',
      shortDesc: 'Comfortable travel between distant cities',
      fullDesc:
        'Schedule city-to-city rides with experienced highway drivers. Book individual seats or the full car for intercity business, family vacations, or airport links.',
      icon: Compass,
      color: 'text-blue-600',
      accentBg: 'bg-blue-600',
      badge: 'City-to-City',
      features: [
        'Interactive vehicle seat picker (Front, Window, Middle)',
        'Guaranteed departure schedules and popular routes',
        'Free luggage allowance and climate-controlled cars',
        'Direct pickup and dropoff at central terminals',
      ],
      actionLabel: 'Explore Routes & Seats',
    },
    {
      id: 'food',
      title: 'Food & Restaurant Delivery',
      shortDesc: 'Delicious meals with $0 delivery fee',
      fullDesc:
        'Order from top-rated local kitchens, burger spots, authentic sushi bars, artisan pizza ovens, and healthy smoothie cafes delivered straight to your door.',
      icon: Utensils,
      color: 'text-rose-600',
      accentBg: 'bg-rose-600',
      badge: 'Free Delivery',
      features: [
        'Categorized restaurants with customer review ratings',
        'Interactive dish customizer with dietary tags',
        'Live courier GPS tracking on city map',
        '100% free delivery with no sneaky checkout fees',
      ],
      actionLabel: 'Browse Restaurants',
    },
    {
      id: 'courier',
      title: 'Express Courier & Parcel',
      shortDesc: 'Door-to-door package dispatch',
      fullDesc:
        'Send documents, contracts, parcels, gifts, or heavy boxes locally. Handed off with secure tracking PIN codes and real-time courier radar.',
      icon: Package,
      color: 'text-purple-600',
      accentBg: 'bg-purple-600',
      badge: 'Same-Day Handshake',
      features: [
        'Sizing tiers for Envelopes, Small boxes, Medium & Cargo',
        'Express rush delivery option for urgent contracts',
        'Security PIN verification on delivery handoff',
        'Direct phone contact with assigned courier',
      ],
      actionLabel: 'Send a Parcel',
    },
    {
      id: 'shop',
      title: 'Online Marketplace & Groceries',
      shortDesc: 'Everyday shopping essentials delivered',
      fullDesc:
        'High-grade tech accessories, fresh groceries, coffee beans, wellness items, and home goods with 1-day free shipping and transparent prices.',
      icon: ShoppingBag,
      color: 'text-emerald-600',
      accentBg: 'bg-emerald-600',
      badge: '1-Day Free Shipping',
      features: [
        'Curated everyday catalog across multiple categories',
        'Instant search, filter by price and rating',
        'Personal wishlist/favorites bookmarking system',
        'Detailed specifications and real customer reviews',
      ],
      actionLabel: 'Open Marketplace',
    },
    {
      id: 'bus',
      title: 'Live Public Bus Tracking',
      shortDesc: 'Real-time city transit radar & arrival ETAs',
      fullDesc:
        'Track all city transit bus lines moving in real time on our interactive vector radar. Inspect any bus stop to view approaching buses and countdown arrivals.',
      icon: Bus,
      color: 'text-sky-600',
      accentBg: 'bg-sky-600',
      badge: 'Public Transit Radar',
      features: [
        'Live moving buses with real-time coordinates & speed',
        'Departure board countdowns for every stop in the city',
        'Bus occupancy telemetry (Empty, Moderate, Crowded)',
        'Route highlighting for major city transit corridors',
      ],
      actionLabel: 'Open Transit Radar',
    },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 inline-block">
          All 6 Core Services Included
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Everything you need in one platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Clean, modern, and completely free of subscription fees or platform markups.
        </p>
      </div>

      {/* 6 Large Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allServices.map((srv) => {
          const Icon = srv.icon
          return (
            <div
              key={srv.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl ${srv.accentBg} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {srv.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{srv.fullDesc}</p>
                </div>

                {/* Features list */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {srv.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => setActiveServiceModal(srv.id)}
                  className={`w-full py-3 px-4 rounded-2xl ${srv.accentBg} text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95`}
                >
                  <span>{srv.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
