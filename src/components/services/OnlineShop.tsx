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
  X,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { SHOP_PRODUCTS } from '../../data/mockData'
import { ShopProduct } from '../../types'

interface OnlineShopProps {
  onClose?: () => void
}

const CATEGORIES = ['All', 'Electronics', 'Groceries', 'Home & Living', 'Personal Care']

export const OnlineShop: React.FC<OnlineShopProps> = ({ onClose }) => {
  const {
    addShopProduct,
    wishlist,
    toggleWishlist,
    isWishlisted,
    setIsCartOpen,
    shopCart,
  } = useApp()

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular')
  const [showOnlyWishlist, setShowOnlyWishlist] = useState<boolean>(false)
  const [selectedProductModal, setSelectedProductModal] = useState<ShopProduct | null>(null)
  const [modalQuantity, setModalQuantity] = useState<number>(1)

  // Filtering & Sorting
  const filteredProducts = SHOP_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory
    const matchesSearch =
      !searchQuery.trim() ||
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesWishlist = !showOnlyWishlist || isWishlisted(prod.id)

    return matchesCat && matchesSearch && matchesWishlist
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return (b.reviewsCount || 0) - (a.reviewsCount || 0)
  })

  const handleOpenProduct = (prod: ShopProduct) => {
    setSelectedProductModal(prod)
    setModalQuantity(1)
  }

  const handleAddFromModal = () => {
    if (!selectedProductModal) return
    addShopProduct(selectedProductModal, modalQuantity)
    setSelectedProductModal(null)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl w-full mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 via-sky-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Everyday Online Marketplace</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                100% Free Shipping
              </span>
            </div>
            <p className="text-xs text-slate-500">Groceries, tech gadgets & household essentials with zero platform markups</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Wishlist quick filter */}
          <button
            onClick={() => setShowOnlyWishlist(!showOnlyWishlist)}
            className={`py-1.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
              showOnlyWishlist
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Saved ({wishlist.length})</span>
          </button>

          {/* Cart Trigger */}
          {shopCart.length > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({shopCart.reduce((s, i) => s + i.quantity, 0)})</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Search, Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, headphones, coffee..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No products found</h4>
            <p className="text-xs text-slate-400 mt-1">Try relaxing your search or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((prod) => {
              const favorited = isWishlisted(prod.id)
              return (
                <div
                  key={prod.id}
                  onClick={() => handleOpenProduct(prod)}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  {/* Image area */}
                  <div className="relative bg-slate-100 h-44 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Wishlist toggle button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(prod.id)
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-600 shadow-xs transition-transform active:scale-90"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {prod.isBestSeller && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                          Best Seller
                        </span>
                      )}
                      {prod.isNew && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500 text-white shadow-xs">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body info */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{prod.category}</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {prod.rating} ({prod.reviewsCount})
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {prod.title}
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-900">${prod.price.toFixed(2)}</span>
                          {prod.originalPrice && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ${prod.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600">Free 1-Day Delivery</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          addShopProduct(prod, 1)
                        }}
                        className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 shadow-xs transition-transform active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedProductModal.category}
                </span>
                <span className="text-xs text-slate-400">• In Stock ({selectedProductModal.stock} units)</span>
              </div>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product photo */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedProductModal.image}
                  alt={selectedProductModal.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => toggleWishlist(selectedProductModal.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-600 shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted(selectedProductModal.id) ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Specs and action */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedProductModal.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {selectedProductModal.rating}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({selectedProductModal.reviewsCount} customer reviews)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {selectedProductModal.description}
                  </p>

                  {/* Specifications table */}
                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                    {Object.entries(selectedProductModal.specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-400">{k}:</span>
                        <span className="font-semibold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-black text-slate-900">
                        ${selectedProductModal.price.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Free Shipping Included
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-900 w-4 text-center">
                        {modalQuantity}
                      </span>
                      <button
                        onClick={() => setModalQuantity((q) => q + 1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center hover:bg-slate-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddFromModal}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart • ${(selectedProductModal.price * modalQuantity).toFixed(2)}
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
