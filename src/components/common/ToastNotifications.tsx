import React, { useEffect } from 'react'
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  Car,
  Utensils,
  Package,
  ShoppingBag,
  Bus,
  Compass,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ToastMessage } from '../../types'

export const ToastNotifications: React.FC = () => {
  const { toasts, removeToast } = useApp()

  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => {
      removeToast(toasts[0].id)
    }, 4500)
    return () => clearTimeout(timer)
  }, [toasts, removeToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-3.5 flex items-start gap-3 animate-in slide-in-from-right-5 fade-in duration-200"
          >
            <div className="shrink-0 mt-0.5">
              {toast.serviceId === 'taxi' && (
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
              )}
              {toast.serviceId === 'food' && (
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
              )}
              {toast.serviceId === 'courier' && (
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              )}
              {toast.serviceId === 'shop' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              )}
              {toast.serviceId === 'bus' && (
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <Bus className="w-4 h-4" />
                </div>
              )}
              {toast.serviceId === 'intercity' && (
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
              )}
              {!toast.serviceId && toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
              {!toast.serviceId && toast.type === 'info' && (
                <Info className="w-5 h-5 text-sky-600" />
              )}
              {!toast.serviceId && toast.type === 'warning' && (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-slate-900 text-xs">{toast.title}</h5>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
