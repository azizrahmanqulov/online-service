import React from 'react'
import {
  Home,
  ShoppingBag,
  Map as MapIcon,
  ClipboardList,
  User,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageView } from '../../types'

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, setActiveServiceModal, activeOrders, userRole } = useApp()

  const tabs: { id: PageView; label: string; icon: any; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'services', label: 'Services', icon: LayoutGrid },
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'orders', label: 'Orders', icon: ClipboardList, badge: activeOrders.length },
    ...(userRole === 'admin'
      ? [{ id: 'admin' as PageView, label: 'Admin', icon: ShieldCheck }]
      : [{ id: 'profile' as PageView, label: 'Profile', icon: User }]),
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentPage === tab.id ||
            (tab.id === 'services' && ['food', 'taxi', 'intercity', 'courier', 'bus'].includes(currentPage))
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentPage(tab.id)
                setActiveServiceModal(null)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-sky-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-sky-600 mt-0.5" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
