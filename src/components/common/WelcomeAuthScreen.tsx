import React, { useState } from 'react'
import {
  Sparkles,
  Car,
  Utensils,
  Package,
  ShoppingBag,
  Bus,
  Compass,
  ShieldCheck,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  Star,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const WelcomeAuthScreen: React.FC = () => {
  const { login, setShowWelcomeScreen } = useApp()

  const [tab, setTab] = useState<'signin' | 'register'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDismiss = () => {
    localStorage.setItem('omni_welcome_seen', 'true')
    setShowWelcomeScreen(false)
  }

  const handleLoginAs = (role: 'user' | 'admin') => {
    setIsLoading(true)
    setTimeout(() => {
      if (role === 'admin') {
        login('admin', 'admin@omniserve.org', 'Master Administrator')
      } else {
        login('user', 'samira.vance@example.com', 'Samira Vance')
      }
      handleDismiss()
      setIsLoading(false)
    }, 600)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setIsLoading(true)
    setTimeout(() => {
      const isAdmin = email.toLowerCase().includes('admin')
      login(
        isAdmin ? 'admin' : 'user',
        email,
        name || (isAdmin ? 'System Administrator' : 'Registered Citizen')
      )
      handleDismiss()
      setIsLoading(false)
    }, 700)
  }

  const HIGHLIGHTS = [
    { icon: Car, label: 'City & Intercity Taxi', sub: 'Instant dispatch', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Utensils, label: 'Food Delivery', sub: '\$0 delivery fee', color: 'text-rose-500', bg: 'bg-rose-50' },
    { icon: Package, label: 'Door-to-Door Courier', sub: 'Express dispatch', color: 'text-violet-500', bg: 'bg-violet-50' },
    { icon: ShoppingBag, label: 'Online Marketplace', sub: 'Free shipping', color: 'text-sky-500', bg: 'bg-sky-50' },
    { icon: Bus, label: 'Live Bus Transit', sub: 'Real-time radar', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Compass, label: 'Intercity Routes', sub: 'Seat selection', color: 'text-blue-500', bg: 'bg-blue-50' },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex overflow-hidden">
      {/* Left Panel – Hero Branding (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-sky-600/10 blur-3xl" />
          <div className="absolute bottom-32 right-10 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-violet-600/8 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-sky-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tight">
              Omni<span className="text-sky-400">Serve</span>
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-widest">Super Platform</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% FREE
              </span>
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
              Everyday Everything
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                in One Free App
              </span>
            </h1>
            <p className="mt-4 text-slate-300 text-base leading-relaxed max-w-lg">
              OmniServe brings all city services together — rides, food, parcels, shopping, and transit — 
              with zero platform fees, zero commissions, and zero subscriptions. Forever free for every citizen.
            </p>
          </div>

          {/* Service Highlights Grid */}
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {HIGHLIGHTS.map((h) => {
              const Icon = h.icon
              return (
                <div
                  key={h.label}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className={`w-9 h-9 rounded-xl ${h.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${h.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{h.label}</p>
                    <p className="text-[11px] text-slate-400">{h.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {[
              { icon: ShieldCheck, text: '\$0 Platform Fees' },
              { icon: Zap, text: 'Instant Dispatch' },
              { icon: Star, text: '4.9★ Citizen Rated' },
              { icon: CheckCircle2, text: 'Verified Drivers' },
            ].map((b) => {
              const Icon = b.icon
              return (
                <span key={b.text} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-sky-400" />
                  <span>{b.text}</span>
                </span>
              )
            })}
          </div>
        </div>

        {/* Bottom note */}
        <div className="relative z-10 text-[11px] text-slate-600">
          © 2026 OmniServe — Municipal Services Platform. All services are fully free of charge.
        </div>
      </div>

      {/* Right Panel – Auth Form */}
      <div className="flex-1 lg:w-[45%] flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-sky-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            Omni<span className="text-sky-400">Serve</span>
          </span>
        </div>

        <div className="w-full max-w-md space-y-5">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10">
            {/* Card Header */}
            <div className="px-7 py-6 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Welcome to OmniServe</h2>
              <p className="text-xs text-slate-500 mt-1">Sign in, register free, or continue as guest — your choice.</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Quick 1-Tap Logins */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ⚡ Quick 1-Tap Access
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {/* Citizen */}
                  <button
                    onClick={() => handleLoginAs('user')}
                    disabled={isLoading}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all text-left flex items-center justify-between group disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="Samira"
                        className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Enter as Citizen</p>
                        <p className="text-xs text-slate-500">Samira Vance — Rider & Shopper</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Admin */}
                  <button
                    onClick={() => handleLoginAs('admin')}
                    disabled={isLoading}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all text-left flex items-center justify-between group disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Enter as Administrator</p>
                        <p className="text-xs text-slate-500">Master Admin — Full Platform Control</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or use email & password</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Form Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                <button
                  onClick={() => setTab('signin')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    tab === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setTab('register')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                    tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register Free
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3">
                {tab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {tab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all active:scale-[0.99] disabled:opacity-60 mt-1"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>{tab === 'signin' ? 'Sign In to Account' : 'Create Free Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Guest Access */}
          <button
            onClick={handleDismiss}
            className="w-full py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
          >
            <span>🔍</span>
            <span>Continue as Guest — Explore Free</span>
          </button>

          <p className="text-center text-[11px] text-slate-500">
            No account needed to browse. Your session preference is saved locally.
          </p>
        </div>
      </div>
    </div>
  )
}
