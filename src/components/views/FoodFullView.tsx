import React, { useState } from 'react'
import {
  Utensils,
  Search,
  Star,
  Clock,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  Flame,
  Leaf,
  X,
  MapPin,
  Filter,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { RESTAURANTS } from '../../data/mockData'
import { Restaurant, FoodItem } from '../../types'

const CUISINES = [
  { id: 'All', label: '🍽️ All Cuisines' },
  { id: 'Burgers', label: '🍔 Burgers & Grill' },
  { id: 'Asian', label: '🍣 Asian & Sushi' },
  { id: 'Italian', label: '🍕 Italian Pizza' },
  { id: 'Healthy', label: '🥗 Healthy & Vegan' },
  { id: 'Mexican', label: '🌮 Mexican' },
  { id: 'Desserts', label: '🍰 Desserts & Cafés' },
]

const DIETARY_FILTERS = ['Vegetarian', 'Gluten-Free', 'Vegan', 'Spicy']

export const FoodFullView: React.FC = () => {
  const { addFoodItem, setIsCartOpen, foodCart, setCurrentPage, addToast } = useApp()

  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [minRating, setMinRating] = useState<number>(0)
  const [fastOnly, setFastOnly] = useState(false)
  const [dietFilters, setDietFilters] = useState<string[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [activeItemModal, setActiveItemModal] = useState<FoodItem | null>(null)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const toggleDiet = (filter: string) => {
    setDietFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    )
  }

  const filteredRestaurants = RESTAURANTS.filter((rest) => {
    const matchesCuisine =
      selectedCuisine === 'All' || rest.category.toLowerCase().includes(selectedCuisine.toLowerCase())
    const matchesSearch =
      !searchQuery.trim() ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rest.popularItems.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesRating = rest.rating >= minRating
    const matchesSpeed = !fastOnly || parseInt(rest.deliveryTime) <= 25
    const matchesDiet =
      dietFilters.length === 0 ||
      dietFilters.some((f) =>
        f === 'Vegetarian'
          ? rest.popularItems.some((i) => i.isVegetarian)
          : rest.tags.some((t) => t.toLowerCase().includes(f.toLowerCase()))
      )

    return matchesCuisine && matchesSearch && matchesRating && matchesSpeed && matchesDiet
  })

  const cartTotal = foodCart.reduce((s, i) => s + i.item.price * i.quantity, 0)
  const cartCount = foodCart.reduce((s, i) => s + i.quantity, 0)

  const handleOpenItem = (item: FoodItem) => {
    setActiveItemModal(item)
    setItemQuantity(1)
  }

  const handleAddToCart = () => {
    if (!activeItemModal) return
    addFoodItem(activeItemModal, itemQuantity)
    setActiveItemModal(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-200">
      {/* Full-Width Hero Header */}
      <div className="bg-gradient-to-r from-rose-600 via-orange-600 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setCurrentPage('home')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Food & Dining Delivery</h1>
              <p className="text-rose-100 text-sm">
                Top-rated kitchens • <span className="font-bold text-white">$0 Delivery</span> • Avg 20-30 min
              </p>
            </div>
          </div>

          {/* Cuisine Mega Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-6 scrollbar-none -mx-1 px-1">
            {CUISINES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCuisine(c.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedCuisine === c.id
                    ? 'bg-white text-rose-700 shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, restaurants (pizza, sushi, burger...)..."
              className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-800 shadow-xs"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all shadow-xs ${
              showFilters || minRating > 0 || fastOnly || dietFilters.length > 0
                ? 'bg-rose-600 border-rose-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(minRating > 0 || fastOnly || dietFilters.length > 0) && (
              <span className="w-5 h-5 rounded-full bg-white/30 text-xs font-black flex items-center justify-center">
                {(minRating > 0 ? 1 : 0) + (fastOnly ? 1 : 0) + dietFilters.length}
              </span>
            )}
          </button>

          {cartCount > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Cart ({cartCount}) • ${cartTotal.toFixed(2)}
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-xs animate-in fade-in duration-150">
            <div className="flex flex-wrap gap-6">
              {/* Min Rating */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Minimum Rating</p>
                <div className="flex items-center gap-2">
                  {[0, 4.0, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        minRating === r
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-300'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Speed */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Delivery Speed</p>
                <button
                  onClick={() => setFastOnly(!fastOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    fastOnly
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Under 25 Minutes Only
                </button>
              </div>

              {/* Dietary */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Dietary Options</p>
                <div className="flex flex-wrap items-center gap-2">
                  {DIETARY_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleDiet(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                        dietFilters.includes(f)
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {f === 'Vegetarian' && <Leaf className="w-3.5 h-3.5" />}
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content: Restaurant List OR Restaurant Menu */}
        {selectedRestaurant ? (
          <div className="animate-in fade-in duration-200">
            {/* Restaurant Hero */}
            <div className="relative rounded-3xl overflow-hidden mb-6 h-64 sm:h-80">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="self-start py-2 px-4 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold hover:bg-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Restaurants
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
                      {selectedRestaurant.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                      $0 Free Delivery
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-white">{selectedRestaurant.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/90 mt-2">
                    <span className="flex items-center gap-1 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {selectedRestaurant.rating} ({selectedRestaurant.reviewCount}+ reviews)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedRestaurant.deliveryTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedRestaurant.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Grid */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Popular Menu Dishes
                <span className="ml-2 text-sm font-normal text-slate-400">
                  ({selectedRestaurant.popularItems.length} items)
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedRestaurant.popularItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenItem(item)}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-rose-200 hover:shadow-md transition-all cursor-pointer group flex gap-4 p-4"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-cover group-hover:scale-[1.02] transition-transform"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          addFoodItem(item, 1)
                        }}
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-transform active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {item.isPopular && <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{item.description}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-extrabold text-slate-900 text-sm">${item.price.toFixed(2)}</span>
                        {item.calories && (
                          <span className="text-slate-400">{item.calories} kcal</span>
                        )}
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {item.preparationTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Restaurant Catalog */
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-600">
                {filteredRestaurants.length} restaurants found
              </span>
              <span className="text-xs text-slate-400">Average delivery: 20-30 min</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => setSelectedRestaurant(rest)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-rose-200 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative h-48">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/95 text-slate-800 shadow-sm">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {rest.deliveryTime}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500 text-white shadow-sm">
                        Free Delivery
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {rest.rating}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-rose-600 transition-colors">
                        {rest.name}
                      </h4>
                      <p className="text-xs text-slate-500">{rest.category}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {rest.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                        {rest.address}
                      </span>
                      <span className="text-rose-600 font-bold flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform">
                        View Menu
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-20">
                <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-semibold">No restaurants match your filters</p>
                <button
                  onClick={() => {
                    setSelectedCuisine('All')
                    setMinRating(0)
                    setFastOnly(false)
                    setDietFilters([])
                    setSearchQuery('')
                  }}
                  className="mt-3 text-rose-600 text-sm font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {cartCount > 0 && !activeItemModal && (
        <div className="fixed bottom-20 lg:bottom-6 left-0 right-0 flex justify-center px-4 z-30 pointer-events-none">
          <button
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto flex items-center justify-between gap-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl px-6 py-4 shadow-2xl shadow-rose-600/40 transition-all animate-in slide-in-from-bottom duration-300 max-w-sm w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">{cartCount} items in cart</p>
                <p className="text-xs text-rose-200">Tap to checkout</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-black">${cartTotal.toFixed(2)}</p>
              <p className="text-xs text-rose-200">$0 delivery</p>
            </div>
          </button>
        </div>
      )}

      {/* Item Customizer Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 slide-in-from-bottom duration-200">
            <div className="relative">
              <img
                src={activeItemModal.image}
                alt={activeItemModal.name}
                className="w-full h-56 object-cover"
              />
              <button
                onClick={() => setActiveItemModal(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-slate-700 flex items-center justify-center hover:bg-white shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
              {activeItemModal.isPopular && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Popular
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-900">{activeItemModal.name}</h4>
                  {activeItemModal.isVegetarian && <Leaf className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-500 mt-1">{activeItemModal.description}</p>
                <div className="flex items-center gap-3 text-sm mt-2">
                  <span className="font-extrabold text-slate-900 text-base">
                    ${activeItemModal.price.toFixed(2)}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">Prep: {activeItemModal.preparationTime}</span>
                  {activeItemModal.calories && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{activeItemModal.calories} kcal</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-sm font-bold text-slate-700">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-black text-slate-900 w-5 text-center">{itemQuantity}</span>
                  <button
                    onClick={() => setItemQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition-all active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart — ${(activeItemModal.price * itemQuantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
