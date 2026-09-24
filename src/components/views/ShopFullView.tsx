import React, { useState } from 'react'
import {
  ShoppingBag,
  Search,
  Star,
  Heart,
  Plus,
  Minus,
  Check,
  Filter,
  ArrowUpDown,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
  Grid,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  CheckCircle2,
  X,
  Clock,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ShopProduct } from '../../types'

const DEPARTMENTS = [
  { id: 'All', label: 'All Departments', icon: Sparkles },
  { id: 'Electronics', label: 'Tech & Electronics', icon: Zap },
  { id: 'Groceries', label: 'Fresh Groceries', icon: Tag },
  { id: 'Home & Living', label: 'Home & Living', icon: ShoppingBag },
  { id: 'Personal Care', label: 'Care & Wellness', icon: Heart },
]

export const ShopFullView: React.FC = () => {
  const {
    products,
    addShopProduct,
    wishlist,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
    shopCart,
  } = useApp()

  const [selectedDept, setSelectedDept] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [minRating, setMinRating] = useState<number>(0)
  const [priceBracket, setPriceBracket] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null)
  const [detailQuantity, setDetailQuantity] = useState<number>(1)

  // Filter products
  const filteredProducts = products
    .filter((prod) => {
      const matchDept = selectedDept === 'All' || prod.category === selectedDept
      const matchSearch =
        !searchQuery.trim() ||
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStock = !inStockOnly || prod.stock > 0
      const matchRating = prod.rating >= minRating

      let matchPrice = true
      if (priceBracket === 'under15') matchPrice = prod.price < 15
      else if (priceBracket === '15to30') matchPrice = prod.price >= 15 && prod.price <= 30
      else if (priceBracket === 'over30') matchPrice = prod.price > 30

      return matchDept && matchSearch && matchStock && matchRating && matchPrice
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return (b.reviewsCount || 0) - (a.reviewsCount || 0)
    })

  const handleOpenDetail = (prod: ShopProduct) => {
    setSelectedProduct(prod)
    setDetailQuantity(1)
  }

  const handleAddFromDetail = () => {
    if (!selectedProduct) return
    addShopProduct(selectedProduct, detailQuantity)
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Immersive Shop Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              OmniMarket Official Store
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[11px] font-bold text-emerald-300">
              100% Free Shipping on All Orders
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Full Marketplace & Groceries.<br />
            <span className="text-emerald-400">Zero markup. Zero delivery fees.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Discover verified gadgets, household products, fresh estate coffee, and pantry essentials delivered same-day to your door.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl pt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by keyword, brand, or feature..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
            />
          </div>
        </div>
      </section>

      {/* Departments Mega Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DEPARTMENTS.map((dept) => {
          const Icon = dept.icon
          const isSelected = selectedDept === dept.id
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{dept.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Content Layout with Filter Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filter Sidebar (Desktop) */}
        <aside className="lg:col-span-3 space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Filters
              </span>
              {(inStockOnly || minRating > 0 || priceBracket !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setInStockOnly(false)
                    setMinRating(0)
                    setPriceBracket('all')
                    setSearchQuery('')
                  }}
                  className="text-[11px] text-rose-600 font-semibold hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Price Range</span>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under15', label: 'Under $15' },
                  { id: '15to30', label: '$15 to $30' },
                  { id: 'over30', label: 'Over $30' },
                ].map((pb) => (
                  <label
                    key={pb.id}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer py-1"
                  >
                    <input
                      type="radio"
                      name="pricebracket"
                      checked={priceBracket === pb.id}
                      onChange={() => setPriceBracket(pb.id)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{pb.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block">Minimum Rating</span>
              <div className="flex items-center gap-1.5">
                {[0, 4.5, 4.8, 4.9].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => setMinRating(ratingVal)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      minRating === ratingVal
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ratingVal === 0 ? 'All' : `${ratingVal}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span className="font-semibold">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

            {/* Free Shipping Promise Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Delivery Fees</span>
              </div>
              <p className="text-[11px] leading-snug">
                Every product comes with 100% free delivery. No minimum cart value required.
              </p>
            </div>
          </div>
        </aside>

        {/* Products Grid Area */}
        <main className="lg:col-span-9 space-y-4">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs text-slate-500">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products in{' '}
              <strong className="text-emerald-700">{selectedDept}</strong>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No matching products found</h4>
              <p className="text-xs text-slate-400">Try adjusting your filters or department selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => {
                const favorited = isWishlisted(prod.id)
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleOpenDetail(prod)}
                    className="rounded-3xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                  >
                    {/* Image Area */}
                    <div className="relative bg-slate-100 h-52 overflow-hidden">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(prod.id)
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-600 shadow-sm transition-transform active:scale-90"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                          }`}
                        />
                      </button>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {prod.isBestSeller && (
                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            Best Seller
                          </span>
                        )}
                        {prod.isNew && (
                          <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-sky-500 text-white shadow-sm">
                            New Arrival
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details Info */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="uppercase font-semibold">{prod.category}</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {prod.rating} ({prod.reviewsCount})
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {prod.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg font-black text-slate-900">
                              ${prod.price.toFixed(2)}
                            </span>
                            {prod.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ${prod.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            Free 1-Day Delivery
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            addShopProduct(prod, 1)
                          }}
                          className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {/* Deep Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedProduct.category}
                </span>
                <span className="text-xs text-slate-400">• In Stock ({selectedProduct.stock} units available)</span>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Photo & Guarantee */}
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 h-72">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-600 shadow-sm"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Delivered Today by 6:00 PM
                  </span>
                  <span className="text-emerald-700 font-bold">$0 Shipping</span>
                </div>
              </div>

              {/* Specs, Reviews & Add-to-Cart */}
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">{selectedProduct.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {selectedProduct.rating}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({selectedProduct.reviewsCount} customer reviews)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Specifications Table */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Product Specifications
                    </span>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                      {Object.entries(selectedProduct.specs).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-slate-200/60 pb-1 last:border-0 last:pb-0">
                          <span className="text-slate-400">{k}</span>
                          <span className="font-semibold text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Quantity & Add Bar */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900">
                        ${selectedProduct.price.toFixed(2)}
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        Zero convenience fees
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-900 w-5 text-center">
                        {detailQuantity}
                      </span>
                      <button
                        onClick={() => setDetailQuantity((q) => q + 1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddFromDetail}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart • ${(selectedProduct.price * detailQuantity).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
