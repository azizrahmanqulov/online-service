import React, { useState } from 'react'
import {
  ClipboardList,
  Car,
  Compass,
  Utensils,
  Package,
  ShoppingBag,
  Bus,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  RotateCcw,
  XCircle,
  ShieldCheck,
  Navigation,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ServiceOrder, ServiceId, OrderStatus } from '../../types'
import { InteractiveMap } from '../map/InteractiveMap'

export const OrdersView: React.FC = () => {
  const { orders, activeOrders, pastOrders, cancelOrder, setActiveServiceModal } = useApp()

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [serviceFilter, setServiceFilter] = useState<ServiceId | 'all'>('all')

  const filterOrders = (list: ServiceOrder[]) => {
    if (serviceFilter === 'all') return list
    return list.filter((o) => o.serviceId === serviceFilter)
  }

  const displayedOrders = filterOrders(activeTab === 'active' ? activeOrders : pastOrders)

  const getServiceIcon = (sid: ServiceId) => {
    switch (sid) {
      case 'taxi':
        return <Car className="w-4 h-4 text-amber-600" />
      case 'intercity':
        return <Compass className="w-4 h-4 text-blue-600" />
      case 'food':
        return <Utensils className="w-4 h-4 text-rose-600" />
      case 'courier':
        return <Package className="w-4 h-4 text-purple-600" />
      case 'shop':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />
      case 'bus':
        return <Bus className="w-4 h-4 text-sky-600" />
    }
  }

  // Steps for active timeline
  const TIMELINE_STEPS = [
    { step: 1, label: 'Order Accepted' },
    { step: 2, label: 'Driver/Courier Arriving' },
    { step: 3, label: 'On The Way' },
    { step: 4, label: 'Arriving / Completed' },
  ]

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-600/20">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Your Orders & Trips</h1>
            <p className="text-xs text-slate-500">
              Track active deliveries, taxi rides, and view past history across all services
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 sm:flex-initial py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 sm:flex-initial py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Order History ({pastOrders.length})
          </button>
        </div>
      </div>

      {/* Service Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setServiceFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            serviceFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Types
        </button>
        <button
          onClick={() => setServiceFilter('taxi')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            serviceFilter === 'taxi'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Taxis</span>
        </button>
        <button
          onClick={() => setServiceFilter('intercity')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            serviceFilter === 'intercity'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Intercity</span>
        </button>
        <button
          onClick={() => setServiceFilter('food')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            serviceFilter === 'food'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Food</span>
        </button>
        <button
          onClick={() => setServiceFilter('courier')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            serviceFilter === 'courier'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Courier</span>
        </button>
        <button
          onClick={() => setServiceFilter('shop')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            serviceFilter === 'shop'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shop</span>
        </button>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">No orders found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'active'
              ? 'You currently do not have active orders in transit. Book a taxi, order food, or dispatch a package to see live progress.'
              : 'Your past order history will be saved here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const isCompleted = order.status === 'completed'
            const isCancelled = order.status === 'cancelled'
            const isActive = !isCompleted && !isCancelled

            return (
              <div
                key={order.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      {getServiceIcon(order.serviceId)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{order.title}</h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {order.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{order.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900">
                        {order.currency}{order.totalAmount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-600 block font-semibold">$0 Platform Fee</span>
                    </div>

                    {isCompleted && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                    {isCancelled && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                        Cancelled
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 flex items-center gap-1 animate-soft-pulse">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        {order.estimatedTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Active Order Step Timeline */}
                {isActive && (
                  <div className="py-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{order.statusText}</span>
                      <span className="text-slate-400 text-[11px]">Step {order.progressStep} of 4</span>
                    </div>

                    {/* Stepper Progress Bar */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {TIMELINE_STEPS.map((stepItem) => {
                        const isDone = order.progressStep >= stepItem.step
                        const isCurrent = order.progressStep === stepItem.step
                        return (
                          <div key={stepItem.step} className="space-y-1">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isDone ? 'bg-sky-600' : 'bg-slate-200'
                              } ${isCurrent ? 'animate-pulse' : ''}`}
                            />
                            <span
                              className={`text-[10px] block leading-tight font-medium ${
                                isDone ? 'text-sky-900 font-bold' : 'text-slate-400'
                              }`}
                            >
                              {stepItem.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Route points & details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">From / Pickup</span>
                        <p className="font-semibold text-slate-800">{order.pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">To / Destination</span>
                        <p className="font-semibold text-slate-800">{order.dropoffLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Assigned driver / courier if present */}
                  {order.driverOrCourier && (
                    <div className="flex items-center justify-between border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.driverOrCourier.avatar}
                          alt={order.driverOrCourier.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1 font-bold text-slate-900">
                            <span>{order.driverOrCourier.name}</span>
                            <span className="text-amber-500 text-[11px]">★ {order.driverOrCourier.rating}</span>
                          </div>
                          <p className="text-slate-500 text-[11px]">{order.driverOrCourier.carModel}</p>
                          {order.driverOrCourier.plateNumber && (
                            <span className="text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {order.driverOrCourier.plateNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      {order.driverOrCourier.phone && isActive && (
                        <a
                          href={`tel:${order.driverOrCourier.phone}`}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-sky-600 hover:bg-sky-50 shadow-xs"
                          title="Call Driver"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">Placed: {order.createdAt}</span>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="py-1.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold transition-colors"
                      >
                        Cancel (Free)
                      </button>
                    )}

                    {!isActive && (
                      <button
                        onClick={() => setActiveServiceModal(order.serviceId)}
                        className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Book / Order Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
