import React, { useState } from 'react'
import {
  User,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  Globe,
  Settings,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  Home,
  Briefcase,
  Dumbbell,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SavedAddress } from '../../types'

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
  { code: 'uz', name: "O'zbekcha" },
]

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    addSavedAddress,
    removeSavedAddress,
    orders,
    addToast,
  } = useApp()

  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false)
  const [newLabel, setNewLabel] = useState<string>('')
  const [newAddress, setNewAddress] = useState<string>('')
  const [newType, setNewType] = useState<'home' | 'work' | 'other'>('other')

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabel.trim() || !newAddress.trim()) return

    const newAddr: SavedAddress = {
      id: 'addr-' + Date.now(),
      label: newLabel.trim(),
      address: newAddress.trim(),
      type: newType,
    }
    addSavedAddress(newAddr)
    setNewLabel('')
    setNewAddress('')
    setIsAddingAddress(false)
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Verified Account">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900">{userProfile.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Verified Citizen • $0 Fees
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {userProfile.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {userProfile.email}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 text-center">
            <span className="text-lg font-black text-slate-900">{orders.length}</span>
            <p className="text-[11px] text-slate-400">Total Trips & Orders</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 text-center">
            <span className="text-lg font-black text-emerald-600">$0.00</span>
            <p className="text-[11px] text-slate-400">Platform Fees Paid</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 text-center">
            <span className="text-lg font-black text-amber-500">5.0 ★</span>
            <p className="text-[11px] text-slate-400">Rider / Buyer Rating</p>
          </div>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Saved Addresses</h2>
              <p className="text-xs text-slate-500">Quickly select pickup or delivery destinations</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingAddress(!isAddingAddress)}
            className="py-1.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </button>
        </div>

        {/* Add Address Form */}
        {isAddingAddress && (
          <form
            onSubmit={handleSaveAddress}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150"
          >
            <span className="text-xs font-bold text-slate-800 block">New Saved Location</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label (e.g. Studio, Parents)"
                required
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Full Street Address"
                required
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="addrtype"
                    checked={newType === 'home'}
                    onChange={() => setNewType('home')}
                  />
                  <span>Home</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="addrtype"
                    checked={newType === 'work'}
                    onChange={() => setNewType('work')}
                  />
                  <span>Work</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="addrtype"
                    checked={newType === 'other'}
                    onChange={() => setNewType('other')}
                  />
                  <span>Other</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="py-1.5 px-3 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {userProfile.savedAddresses.map((addr) => (
            <div
              key={addr.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                  {addr.type === 'home' && <Home className="w-4 h-4" />}
                  {addr.type === 'work' && <Briefcase className="w-4 h-4" />}
                  {addr.type === 'other' && <Dumbbell className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{addr.label}</h4>
                  <p className="text-[11px] text-slate-500">{addr.address}</p>
                </div>
              </div>

              <button
                onClick={() => removeSavedAddress(addr.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Remove address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Places */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Favorite Places</h2>
            <p className="text-xs text-slate-500">Quick shortcuts to your frequent spots</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {userProfile.favoritePlaces.map((fav) => (
            <div
              key={fav.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">{fav.category}</span>
                <span className="text-xs font-bold text-amber-500">★ {fav.rating}</span>
              </div>
              <h5 className="font-bold text-slate-900 text-xs">{fav.name}</h5>
              <p className="text-[11px] text-slate-500 truncate">{fav.address}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Preferences */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Payment Preferences</h2>
              <p className="text-xs text-slate-500">0% convenience fee on all methods</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'card', title: 'Credit / Debit Card', sub: 'Visa •••• 4242 (0% Fee)' },
            { id: 'cash', title: 'Cash on Arrival', sub: 'Pay driver or courier directly' },
            { id: 'wallet', title: 'Digital Mobile Pay', sub: 'Apple / Google / Instant Bank' },
          ].map((m) => {
            const isSelected = userProfile.selectedPayment === m.id
            return (
              <button
                key={m.id}
                onClick={() => updateUserProfile({ selectedPayment: m.id as any })}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">{m.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">{m.sub}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Language & Notifications Settings */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">App Settings & Language</h2>
            <p className="text-xs text-slate-500">Customize display and alert preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Language Switcher */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>Language</span>
            </div>
            <select
              value={userProfile.language}
              onChange={(e) => updateUserProfile({ language: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Bell className="w-4 h-4 text-sky-600" />
              <div>
                <span>Push Notifications</span>
                <p className="text-[11px] text-slate-400 font-normal">Real-time driver arrival alerts</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={userProfile.notificationsEnabled}
              onChange={(e) => updateUserProfile({ notificationsEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 100% Free Guarantee Certificate */}
      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-start gap-4">
        <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-800 space-y-1">
          <h3 className="font-bold text-emerald-950 text-sm">OmniServe Free Platform Guarantee</h3>
          <p className="leading-relaxed">
            Your account is 100% free forever. No monthly memberships, no premium paywalls, and no hidden booking charges. Every penny paid goes directly to your driver, courier, or local vendor.
          </p>
        </div>
      </div>
    </div>
  )
}
