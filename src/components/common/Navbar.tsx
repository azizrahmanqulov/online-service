import React, { useState } from 'react'
import {
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Heart,
  ChevronDown,
  User,
  LogOut,
  Lock,
  Megaphone,
  Car,
  Utensils,
  Package,
  Bus,
  Compass,
  Grid3X3,
  LayoutGrid,
  LogIn,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageView } from '../../types'

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentLocation,
    setIsLocationPickerOpen,
    totalCartItems,
    setIsCartOpen,
    setActiveServiceModal,
    currentUser,
    userRole,
    isLoggedIn,
    logout,
    setIsAuthModalOpen,
    announcement,
    setShowWelcomeScreen,
  } = useApp()

  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState<boolean>(false)

  const navItems: { id: PageView; label: string; isAdminOnly?: boolean }[] = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Online Shop' },
    { id: 'map', label: 'Live Map' },
    { id: 'orders', label: 'Orders' },
    { id: 'profile', label: 'Profile' },
    ...(userRole === 'admin' ? [{ id: 'admin' as PageView, label: 'Admin Panel', isAdminOnly: true }] : []),
  ]

  const serviceShortcuts: { id: PageView; label: string; icon: any; color: string; bg: string }[] = [
    { id: 'food', label: 'Food Delivery', icon: Utensils, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'taxi', label: 'City Taxi', icon: Car, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'intercity', label: 'Intercity Taxi', icon: Compass, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'courier', label: 'Courier', icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'bus', label: 'Bus Transit', icon: Bus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'shop', label: 'Online Shop', icon: ShoppingBag, color: 'text-sky-600', bg: 'bg-sky-50' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Announcement Broadcast Bar */}
      {announcement && (
        <div className="bg-gradient-to-r from-indigo-900 via-sky-900 to-slate-900 text-white text-[11px] font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <Megaphone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="truncate">{announcement}</span>
          {userRole === 'admin' && (
            <button
              onClick={() => setCurrentPage('admin')}
              className="text-sky-300 hover:underline text-[10px] ml-1 shrink-0 font-bold"
            >
              (Edit in Admin)
            </button>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCurrentPage('home')
                setActiveServiceModal(null)
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-slate-900">
                    Omni<span className="text-sky-600">Serve</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    Free
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden md:block -mt-0.5">
                  Everyday Services in One App
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Services Quick-Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsServicesMenuOpen(!isServicesMenuOpen)
                    setIsUserMenuOpen(false)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    ['food', 'taxi', 'intercity', 'courier', 'bus'].includes(currentPage)
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Services</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isServicesMenuOpen && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setIsServicesMenuOpen(false)}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                      All Services
                    </p>
                    {serviceShortcuts.map((svc) => {
                      const Icon = svc.icon
                      const isActive = currentPage === svc.id
                      return (
                        <button
                          key={svc.id}
                          onClick={() => {
                            setCurrentPage(svc.id)
                            setActiveServiceModal(null)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left ${
                            isActive ? 'bg-sky-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg ${svc.bg} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${svc.color}`} />
                          </div>
                          <span className={`text-xs font-semibold ${isActive ? 'text-sky-700' : 'text-slate-700'}`}>
                            {svc.label}
                          </span>
                          {isActive && <span className="ml-auto text-sky-500 text-[10px] font-bold">Active</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {navItems.map((item) => {
                const isActive = currentPage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id)
                      setActiveServiceModal(null)
                      setIsServicesMenuOpen(false)
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? item.isAdminOnly
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-sky-50 text-sky-700'
                        : item.isAdminOnly
                        ? 'text-indigo-600 hover:bg-indigo-50 font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.isAdminOnly && <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Location Selector Pill */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={() => setIsLocationPickerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="font-semibold truncate max-w-[180px] lg:max-w-[200px]">
                {currentLocation.split(',')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 transition-transform active:scale-95 flex items-center justify-center"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-slate-800" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-in zoom-in-50">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Auth / Profile Button */}
            {isLoggedIn && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen)
                    setIsServicesMenuOpen(false)
                  }}
                  className="flex items-center gap-2 p-1 pl-2 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 transition-all"
                >
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                      userRole === 'admin'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {userRole === 'admin' ? 'Admin' : 'User'}
                  </span>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <ChevronDown className="w-3 h-3 text-slate-400 pr-0.5" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    onClick={() => setIsUserMenuOpen(false)}
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
                  >
                    <div className="p-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    {userRole === 'admin' && (
                      <button
                        onClick={() => setCurrentPage('admin')}
                        className="w-full p-2 rounded-xl text-left text-xs font-bold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 flex items-center gap-2 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Control Panel</span>
                      </button>
                    )}

                    <button
                      onClick={() => setCurrentPage('profile')}
                      className="w-full p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Citizen Profile</span>
                    </button>

                    <button
                      onClick={() => setCurrentPage('orders')}
                      className="w-full p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Orders & Passes</span>
                    </button>

                    <button
                      onClick={() => {
                        localStorage.removeItem('omni_welcome_seen')
                        setShowWelcomeScreen(true)
                      }}
                      className="w-full p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-400" />
                      <span>Welcome Screen / Switch Account</span>
                    </button>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={logout}
                        className="w-full p-2 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem('omni_welcome_seen')
                  setShowWelcomeScreen(true)
                }}
                className="py-1.5 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Click-away overlay for menus */}
      {(isUserMenuOpen || isServicesMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsServicesMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}
