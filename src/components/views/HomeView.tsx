import React, { useState } from 'react'
import {
  Car,
  Compass,
  Utensils,
  Package,
  ShoppingBag,
  Bus,
  Search,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ChevronRight,
  Truck,
  Heart,
  Calendar,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ServiceId } from '../../types'
import { InteractiveMap } from '../map/InteractiveMap'
import {
  RESTAURANTS,
  BUS_STOPS,
  POPULAR_INTERCITY_ROUTES,
  SHOP_PRODUCTS,
} from '../../data/mockData'

export const HomeView: React.FC = () => {
  const {
    currentLocation,
    setIsLocationPickerOpen,
    setActiveServiceModal,
    setCurrentPage,
    activeOrders,
    searchQuery,
    setSearchQuery,
    wishlist,
    toggleWishlist,
    isWishlisted,
    addShopProduct,
    addFoodItem,
  } = useApp()

  const [localSearch, setLocalSearch] = useState<string>('')

  // 6 Main Service Cards
  const services: {
    id: ServiceId
    title: string
    subtitle: string
    icon: any
    badge: string
    color: string
    bgLight: string
    accentColor: string
  }[] = [
    {
      id: 'taxi',
      title: 'City Taxi',
      subtitle: 'Instant car pickup in ~3 mins',
      icon: Car,
      badge: 'Fast Pickup',
      color: 'text-amber-600',
      bgLight: 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-200/70',
      accentColor: 'bg-amber-500',
    },
    {
      id: 'intercity',
      title: 'Long-Distance Taxi',
      subtitle: 'City-to-city single seats & cars',
      icon: Compass,
      badge: 'Intercity',
      color: 'text-blue-600',
      bgLight: 'bg-blue-500/10 hover:bg-blue-500/15 border-blue-200/70',
      accentColor: 'bg-blue-600',
    },
    {
      id: 'food',
      title: 'Food Delivery',
      subtitle: 'Delicious meals, $0 delivery fee',
      icon: Utensils,
      badge: '$0 Delivery',
      color: 'text-rose-600',
      bgLight: 'bg-rose-500/10 hover:bg-rose-500/15 border-rose-200/70',
      accentColor: 'bg-rose-600',
    },
    {
      id: 'courier',
      title: 'Courier & Parcel',
      subtitle: 'Send documents & boxes door-to-door',
      icon: Package,
      badge: 'Express',
      color: 'text-purple-600',
      bgLight: 'bg-purple-500/10 hover:bg-purple-500/15 border-purple-200/70',
      accentColor: 'bg-purple-600',
    },
    {
      id: 'shop',
      title: 'Online Shop',
      subtitle: 'Everyday groceries & tech gadgets',
      icon: ShoppingBag,
      badge: 'Free Shipping',
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-200/70',
      accentColor: 'bg-emerald-600',
    },
    {
      id: 'bus',
      title: 'Live Bus Transit',
      subtitle: 'Moving buses on radar & stop ETAs',
      icon: Bus,
      badge: 'Live Radar',
      color: 'text-sky-600',
      bgLight: 'bg-sky-500/10 hover:bg-sky-500/15 border-sky-200/70',
      accentColor: 'bg-sky-600',
    },
  ]

  // Global search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!localSearch.trim()) return
    const q = localSearch.toLowerCase()
    if (q.includes('taxi') || q.includes('cab') || q.includes('ride')) {
      setActiveServiceModal('taxi')
    } else if (q.includes('bus') || q.includes('stop') || q.includes('line') || q.includes('transit')) {
      setActiveServiceModal('bus')
    } else if (q.includes('intercity') || q.includes('bay') || q.includes('city')) {
      setActiveServiceModal('intercity')
    } else if (q.includes('parcel') || q.includes('courier') || q.includes('package')) {
      setActiveServiceModal('courier')
    } else if (
      q.includes('burger') ||
      q.includes('sushi') ||
      q.includes('pizza') ||
      q.includes('food') ||
      q.includes('restaurant')
    ) {
      setActiveServiceModal('food')
    } else {
      setActiveServiceModal('shop')
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-6 sm:p-10 shadow-lg">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              All-in-One Everyday City Super-Platform
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-bold text-emerald-300">
              100% Free Forever • Zero Subscriptions
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ride, eat, deliver & shop.<br />
            <span className="text-sky-400">Everything in one smooth click.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Instant taxis, intercity travel, restaurant delivery, door-to-door couriers, shopping marketplace, and live public bus radar.
          </p>

          {/* Smart Global Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Where to? Search taxis, food, products, bus lines..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/15 font-medium transition-all"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/30 transition-transform active:scale-95"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Location Badge */}
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Serving near: <strong>{currentLocation}</strong></span>
            <button
              onClick={() => setIsLocationPickerOpen(true)}
              className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 ml-1"
            >
              Change
            </button>
          </div>
        </div>
      </section>

      {/* Active Order Alert Banner if any */}
      {activeOrders.length > 0 && (
        <div
          onClick={() => setCurrentPage('orders')}
          className="p-4 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black">
              {activeOrders[0].serviceId === 'taxi' && <Car className="w-5 h-5" />}
              {activeOrders[0].serviceId === 'food' && <Utensils className="w-5 h-5" />}
              {activeOrders[0].serviceId === 'courier' && <Package className="w-5 h-5" />}
              {activeOrders[0].serviceId === 'intercity' && <Compass className="w-5 h-5" />}
              {activeOrders[0].serviceId === 'shop' && <ShoppingBag className="w-5 h-5" />}
              {activeOrders[0].serviceId === 'bus' && <Bus className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Active Order: {activeOrders[0].title}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase">
                  {activeOrders[0].estimatedTime}
                </span>
              </div>
              <p className="text-xs text-sky-100">{activeOrders[0].statusText}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl group-hover:bg-white/20 transition-colors">
            <span>Track Live</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* 6 Main Services Cards Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Everyday Services</h2>
            <p className="text-xs text-slate-500">Pick a service and complete your booking in 2-3 clicks</p>
          </div>
          <button
            onClick={() => setCurrentPage('services')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            All Services
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {services.map((srv) => {
            const Icon = srv.icon
            return (
              <div
                key={srv.id}
                onClick={() => setActiveServiceModal(srv.id)}
                className={`p-4 sm:p-5 rounded-3xl border ${srv.bgLight} transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${srv.accentColor} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-700 shadow-2xs">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                    {srv.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Launch</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Large Interactive Live Map Section */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Live City Radar</h2>
            <p className="text-xs text-slate-500">
              Interactive map displaying moving taxis, buses on line routes, restaurants, and couriers
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('map')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 self-start sm:self-auto flex items-center gap-1"
          >
            Full Map Mode
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <InteractiveMap height="460px" />
      </section>

      {/* Grid: Live Bus Stops Radar + Popular Intercity Trips */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nearby Bus Stops */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Nearby Bus Stops</h3>
                <p className="text-xs text-slate-500">Live arrival countdowns near you</p>
              </div>
            </div>
            <button
              onClick={() => setActiveServiceModal('bus')}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              View Transit
            </button>
          </div>

          <div className="space-y-2.5">
            {BUS_STOPS.slice(0, 3).map((stop) => (
              <div
                key={stop.id}
                onClick={() => setActiveServiceModal('bus')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">{stop.name}</h5>
                    <p className="text-[10px] text-slate-400">
                      Lines: {stop.lineIds.map((l) => l.replace('line-', '#')).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600">
                    #{stop.approachingBuses[0]?.busNumber} in {stop.approachingBuses[0]?.etaMinutes}m
                  </span>
                  <div className="text-[10px] text-slate-400">Approaching now</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Intercity Routes */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Intercity Departures</h3>
                <p className="text-xs text-slate-500">Travel between cities with verified drivers</p>
              </div>
            </div>
            <button
              onClick={() => setActiveServiceModal('intercity')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Book Seat
            </button>
          </div>

          <div className="space-y-2.5">
            {POPULAR_INTERCITY_ROUTES.map((route, idx) => (
              <div
                key={idx}
                onClick={() => setActiveServiceModal('intercity')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">
                    {route.from} → {route.to}
                  </h5>
                  <p className="text-[10px] text-slate-400">
                    {route.distance} • ~{route.duration} • AC Sedan
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">${route.price}</span>
                    <span className="text-[10px] text-slate-400 block">/seat</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Food Kitchens Showcase */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Popular Kitchens Near You</h2>
            <p className="text-xs text-slate-500">Fresh dishes with guaranteed $0 delivery fee</p>
          </div>
          <button
            onClick={() => setActiveServiceModal('food')}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            Explore Menu
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESTAURANTS.map((rest) => (
            <div
              key={rest.id}
              onClick={() => setActiveServiceModal('food')}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-white/95 text-[11px] font-bold text-slate-800 shadow-xs">
                  {rest.deliveryTime}
                </div>
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-white/95 text-[11px] font-bold text-amber-600 flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {rest.rating}
                </div>
              </div>

              <div className="p-3.5 space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs group-hover:text-rose-600 transition-colors">
                  {rest.name}
                </h4>
                <p className="text-[11px] text-slate-400">{rest.category}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-bold">$0 Delivery</span>
                  <span className="text-slate-400">Min ${rest.minOrder}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Online Marketplace Deals */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Trending Products & Deals</h2>
            <p className="text-xs text-slate-500">Everyday essentials with free 1-day shipping</p>
          </div>
          <button
            onClick={() => setActiveServiceModal('shop')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            All Products
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHOP_PRODUCTS.slice(0, 4).map((prod) => (
            <div
              key={prod.id}
              onClick={() => setActiveServiceModal('shop')}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(prod.id)
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-600 hover:text-rose-600 shadow-xs"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isWishlisted(prod.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {prod.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {prod.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">${prod.price.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-emerald-600">Free Delivery</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 100% Free Guarantee Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Fees Platform Manifesto
          </div>
          <h3 className="text-xl font-black text-white">Why OmniServe is completely free</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We believe everyday transit, food delivery, parcel dispatch, and city transit tracking should be accessible to everyone without paid subscriptions, convenience charges, or surprise checkout fees.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="text-center px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg font-black text-emerald-400">$0</div>
            <div className="text-[11px] text-slate-400">Subscription Fee</div>
          </div>
          <div className="text-center px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg font-black text-sky-400">$0</div>
            <div className="text-[11px] text-slate-400">Platform Markup</div>
          </div>
          <div className="text-center px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-lg font-black text-indigo-400">100%</div>
            <div className="text-[11px] text-slate-400">Driver Earning</div>
          </div>
        </div>
      </section>
    </div>
  )
}
