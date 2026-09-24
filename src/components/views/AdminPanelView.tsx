import React, { useState } from 'react'
import {
  ShieldCheck,
  Package,
  Car,
  Utensils,
  Compass,
  Bus,
  ShoppingBag,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Power,
  Megaphone,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  X,
  ExternalLink,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ServiceId, OrderStatus, ShopProduct } from '../../types'

export const AdminPanelView: React.FC = () => {
  const {
    userRole,
    currentUser,
    login,
    orders,
    adminUpdateOrderStatus,
    products,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    disabledServices,
    adminToggleService,
    announcement,
    adminSetAnnouncement,
    liveBuses,
    setCurrentPage,
  } = useApp()

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'services' | 'announcements'>('overview')
  const [orderSearch, setOrderSearch] = useState<string>('')
  const [newAnnouncementText, setNewAnnouncementText] = useState<string>(announcement || '')

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false)
  const [newProd, setNewProd] = useState({
    title: '',
    category: 'Electronics',
    price: 19.99,
    originalPrice: 29.99,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    description: '',
    rating: 5.0,
    reviewsCount: 1,
    freeDelivery: true,
    specs: { Warranty: '1 Year', Origin: 'Official Hub' },
  })

  // Access check: if not admin, show login prompt
  if (userRole !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Admin Control Panel Restricted</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This command panel is restricted to verified Platform Administrators to control live dispatches, products inventory, service availability, and city broadcasts.
        </p>
        <button
          onClick={() => login('admin', 'admin@omniserve.org', 'Master Administrator')}
          className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-transform active:scale-95"
        >
          Sign In as Master Administrator (Instant Demo Access)
        </button>
      </div>
    )
  }

  // Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const platformFeeSavings = (totalRevenue * 0.2).toFixed(2) // 20% typical commission saved
  const activeOrdersCount = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProd.title.trim()) return
    adminAddProduct(newProd)
    setIsAddProductOpen(false)
    setNewProd({
      title: '',
      category: 'Electronics',
      price: 19.99,
      originalPrice: 29.99,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      description: '',
      rating: 5.0,
      reviewsCount: 1,
      freeDelivery: true,
      specs: { Warranty: '1 Year', Origin: 'Official Hub' },
    })
  }

  const allServicesList: { id: ServiceId; name: string; icon: any; color: string }[] = [
    { id: 'taxi', name: 'City Taxi Service', icon: Car, color: 'text-amber-600' },
    { id: 'intercity', name: 'Long-Distance Taxi', icon: Compass, color: 'text-blue-600' },
    { id: 'food', name: 'Food & Dining Delivery', icon: Utensils, color: 'text-rose-600' },
    { id: 'courier', name: 'Courier & Parcel Dispatch', icon: Package, color: 'text-purple-600' },
    { id: 'shop', name: 'Online Marketplace Shop', icon: ShoppingBag, color: 'text-emerald-600' },
    { id: 'bus', name: 'Public Bus Transit Radar', icon: Bus, color: 'text-sky-600' },
  ]

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Master Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">OmniServe Master Command Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 uppercase">
                SuperAdmin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live controller for orders, inventory, service switches, transit radar, and citizen broadcasts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('home')}
            className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>View Citizen Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
          { id: 'orders', label: `Orders Manager (${activeOrdersCount} Active)`, icon: Clock },
          { id: 'inventory', label: `Shop Inventory (${products.length} Items)`, icon: ShoppingBag },
          { id: 'services', label: 'Services & Operations', icon: Power },
          { id: 'announcements', label: 'City Announcements', icon: Megaphone },
        ].map((t) => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: Platform Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Live Orders</span>
                <Clock className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{activeOrdersCount}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Dispatch running on schedule</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Gross Merchandise Value</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</div>
              <span className="text-[11px] text-slate-400">Across {orders.length} total transactions</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Citizen Fee Savings</span>
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">${platformFeeSavings}</div>
              <span className="text-[11px] text-emerald-700 font-bold">100% Free Platform Promise</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Transit Buses on Radar</span>
                <Bus className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{liveBuses.length}</div>
              <span className="text-[11px] text-sky-600 font-semibold">Real-time GPS broadcast active</span>
            </div>
          </div>

          {/* Quick Shortcuts to Admin tasks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('orders')}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Manage Active Dispatches</h3>
              <p className="text-xs text-slate-500">
                Override ride steps, reassign drivers, or resolve customer delivery issues.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('inventory')}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Product Inventory & Prices</h3>
              <p className="text-xs text-slate-500">
                Add new items, update stock counters, or run special flash discount sales.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('announcements')}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">City-Wide Announcements</h3>
              <p className="text-xs text-slate-500">
                Publish instant emergency storm warnings or holiday transit notices to all users.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Manager */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Live Dispatch Control</h3>
              <p className="text-xs text-slate-500">Select any order to change its progression step</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order ID or title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {orders
              .filter(
                (o) =>
                  !orderSearch ||
                  o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                  o.title.toLowerCase().includes(orderSearch.toLowerCase())
              )
              .map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{order.title}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {order.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                          {order.serviceId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{order.subtitle}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-slate-900">${order.totalAmount.toFixed(2)}</span>
                      <div className="text-[10px] font-bold text-sky-600 capitalize">
                        {order.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Quick Admin Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="text-xs text-slate-500">
                      Current: <strong>{order.statusText}</strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => adminUpdateOrderStatus(order.id, 'driver_assigned', 'Driver / Courier Dispatched by Admin')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                      >
                        Set Dispatched
                      </button>
                      <button
                        onClick={() => adminUpdateOrderStatus(order.id, 'on_the_way', 'In Transit on Route')}
                        className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-bold transition-colors"
                      >
                        Set On The Way
                      </button>
                      <button
                        onClick={() => adminUpdateOrderStatus(order.id, 'completed', 'Order Delivered & Completed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition-colors"
                      >
                        Set Completed
                      </button>
                      <button
                        onClick={() => adminUpdateOrderStatus(order.id, 'cancelled', 'Cancelled by Admin')}
                        className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Shop Inventory Manager */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Marketplace Products Catalog</h3>
              <p className="text-xs text-slate-500">
                Add, edit prices, update stock levels, or remove marketplace items
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Add Product Modal */}
          {isAddProductOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900 text-base">Add Product to Marketplace</h4>
                  <button
                    onClick={() => setIsAddProductOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
                    <input
                      type="text"
                      value={newProd.title}
                      onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                      placeholder="e.g. Mechanical Ergonomic Keyboard"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={newProd.category}
                        onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Home & Living">Home & Living</option>
                        <option value="Personal Care">Personal Care</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProd.price}
                        onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Stock Units</label>
                      <input
                        type="number"
                        value={newProd.stock}
                        onChange={(e) => setNewProd({ ...newProd, stock: parseInt(e.target.value) || 0 })}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProd.image}
                        onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      value={newProd.description}
                      onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                      placeholder="Product details & features..."
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddProductOpen(false)}
                      className="py-2 px-4 rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Publish Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Product Items Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="divide-y divide-slate-100">
              {products.map((prod) => (
                <div key={prod.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-slate-900 text-xs">{prod.title}</h5>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                          {prod.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Stock: <strong className="text-slate-700">{prod.stock}</strong> units • Rating: {prod.rating}★
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400">Price:</span>
                      <input
                        type="number"
                        step="0.01"
                        value={prod.price}
                        onChange={(e) => adminUpdateProduct(prod.id, { price: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-2 py-1 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg text-right"
                      />
                    </div>

                    <button
                      onClick={() => adminDeleteProduct(prod.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Services Operations */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Platform Services Switchboard</h3>
            <p className="text-xs text-slate-500">
              Temporarily enable or disable services across the website (e.g. during extreme weather or maintenance)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allServicesList.map((srv) => {
              const Icon = srv.icon
              const isEnabled = !disabledServices.includes(srv.id)
              return (
                <div
                  key={srv.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${srv.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{srv.name}</h4>
                        <span
                          className={`text-[10px] font-bold ${
                            isEnabled ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isEnabled ? '● Active & Serving' : '○ Paused (Maintenance)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => adminToggleService(srv.id, !isEnabled)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      isEnabled
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isEnabled ? 'Pause Service' : 'Enable Service'}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab 5: City Announcements Broadcaster */}
      {activeTab === 'announcements' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">City-Wide Announcement Broadcaster</h3>
            <p className="text-xs text-slate-500">
              Broadcast high-priority alerts, free holiday promotions, or weather notifications directly to all citizens at the top of the app.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              value={newAnnouncementText}
              onChange={(e) => setNewAnnouncementText(e.target.value)}
              placeholder="Type announcement message here..."
              rows={3}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-medium"
            />

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setNewAnnouncementText('')
                  adminSetAnnouncement(null)
                }}
                className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Clear Broadcast
              </button>

              <button
                onClick={() => adminSetAnnouncement(newAnnouncementText.trim() || null)}
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20"
              >
                <Megaphone className="w-4 h-4" />
                <span>Publish Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
