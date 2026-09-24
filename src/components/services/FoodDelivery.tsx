import React, { useState } from 'react'
import {
  Utensils,
  Search,
  Star,
  Clock,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Flame,
  Leaf,
  X,
  MapPin,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { RESTAURANTS } from '../../data/mockData'
import { Restaurant, FoodItem } from '../../types'

interface FoodDeliveryProps {
  onClose?: () => void
}

const CATEGORIES = ['All', 'Burgers & Grill', 'Japanese & Asian', 'Italian & Pizza', 'Healthy & Vegan']

export const FoodDelivery: React.FC<FoodDeliveryProps> = ({ onClose }) => {
  const { addFoodItem, setIsCartOpen, foodCart, addToast } = useApp()

  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [activeItemModal, setActiveItemModal] = useState<FoodItem | null>(null)
  const [itemQuantity, setItemQuantity] = useState<number>(1)

  // Filter restaurants
  const filteredRestaurants = RESTAURANTS.filter((rest) => {
    const matchesCategory =
      selectedCategory === 'All' || rest.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesSearch =
      !searchQuery.trim() ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rest.popularItems.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const handleOpenItem = (item: FoodItem) => {
    setActiveItemModal(item)
    setItemQuantity(1)
  }

  const handleAddItemToCart = () => {
    if (!activeItemModal) return
    addFoodItem(activeItemModal, itemQuantity)
    setActiveItemModal(null)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-5xl w-full mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-orange-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Food & Dining Delivery</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                $0 Free Delivery Everywhere
              </span>
            </div>
            <p className="text-xs text-slate-500">Delicious meals from top-rated kitchens delivered straight to your door</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {foodCart.length > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({foodCart.reduce((s, i) => s + i.quantity, 0)})</span>
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
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g., burger, sushi, pizza, ramen)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium text-slate-800"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Restaurant Detailed View OR Restaurants List */}
        {selectedRestaurant ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Restaurant Hero Card */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="w-full h-48 sm:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-between p-6">
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="self-start py-1.5 px-3 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold hover:bg-white transition-colors"
                >
                  ← Back to Restaurants
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                      {selectedRestaurant.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                      $0 Delivery
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{selectedRestaurant.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-white/90 mt-1">
                    <span className="flex items-center gap-1 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {selectedRestaurant.rating} ({selectedRestaurant.reviewCount}+ reviews)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedRestaurant.deliveryTime}
                    </span>
                    <span>•</span>
                    <span>{selectedRestaurant.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-3">Popular Menu Dishes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedRestaurant.popularItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-4 group cursor-pointer"
                    onClick={() => handleOpenItem(item)}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                          {item.name}
                        </h5>
                        {item.isVegetarian && (
                          <span title="Vegetarian">
                            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-3 pt-1 text-xs">
                        <span className="font-extrabold text-slate-900 text-sm">${item.price.toFixed(2)}</span>
                        {item.calories && (
                          <span className="text-slate-400 text-[11px]">{item.calories} kcal</span>
                        )}
                      </div>
                    </div>

                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-2xl object-cover"
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Restaurants Catalog */
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Top Kitchens Near You ({filteredRestaurants.length})
              </span>
              <span className="text-xs text-slate-400">Average prep & delivery: ~25 mins</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => setSelectedRestaurant(rest)}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative">
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/95 text-slate-800 shadow-sm">
                        {rest.deliveryTime}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500 text-white shadow-sm">
                        Free Delivery
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rest.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base group-hover:text-rose-600 transition-colors">
                          {rest.name}
                        </h4>
                        <p className="text-xs text-slate-500">{rest.category}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rest.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {rest.address}
                      </span>
                      <span className="text-rose-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        View Menu
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Item Customizer Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="relative">
              <img
                src={activeItemModal.image}
                alt={activeItemModal.name}
                className="w-full h-52 object-cover"
              />
              <button
                onClick={() => setActiveItemModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{activeItemModal.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{activeItemModal.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
                  <span className="font-extrabold text-slate-900 text-base">
                    ${activeItemModal.price.toFixed(2)}
                  </span>
                  <span>•</span>
                  <span>Prep: {activeItemModal.preparationTime}</span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-slate-900 w-4 text-center">{itemQuantity}</span>
                  <button
                    onClick={() => setItemQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddItemToCart}
                className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 transition-all active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart • ${(activeItemModal.price * itemQuantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
