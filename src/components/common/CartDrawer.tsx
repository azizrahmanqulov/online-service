import React, { useState } from 'react'
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  ArrowRight,
  Utensils,
  CheckCircle2,
  Truck,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    foodCart,
    shopCart,
    updateFoodQuantity,
    removeFoodItem,
    updateShopQuantity,
    removeShopProduct,
    clearCart,
    totalCartAmount,
    totalCartItems,
    currentLocation,
    addOrder,
    setCurrentPage,
  } = useApp()

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false)

  if (!isCartOpen) return null

  const handleCheckout = () => {
    setIsCheckingOut(true)
    setTimeout(() => {
      // Create Food Order if items exist
      if (foodCart.length > 0) {
        const foodTotal = foodCart.reduce((s, i) => s + i.item.price * i.quantity, 0)
        const itemsSummary = foodCart.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')
        addOrder({
          serviceId: 'food',
          serviceName: 'Food Delivery',
          title: foodCart[0].item.name,
          subtitle: itemsSummary,
          totalAmount: foodTotal,
          currency: '$',
          status: 'driver_assigned',
          progressStep: 2,
          statusText: 'Kitchen is preparing your meal & courier dispatched',
          estimatedTime: '25 mins',
          pickupLocation: 'Kitchen Hub Restaurant',
          dropoffLocation: currentLocation,
          driverOrCourier: {
            name: 'Liam Chen',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            rating: 4.96,
            tripsCount: 940,
            phone: '+1 (555) 301-4491',
            carModel: 'Eco E-Bike',
            carColor: 'Matte Grey',
            plateNumber: 'BK-102',
          },
          mapCoords: { x: 380, y: 310 },
        })
      }

      // Create Shop Order if products exist
      if (shopCart.length > 0) {
        const shopTotal = shopCart.reduce((s, i) => s + i.product.price * i.quantity, 0)
        const productsSummary = shopCart.map((i) => `${i.quantity}x ${i.product.title}`).join(', ')
        addOrder({
          serviceId: 'shop',
          serviceName: 'Online Marketplace',
          title: shopCart[0].product.title,
          subtitle: productsSummary,
          totalAmount: shopTotal,
          currency: '$',
          status: 'confirmed',
          progressStep: 1,
          statusText: 'Order packaged and ready for same-day free delivery',
          estimatedTime: 'Today by 6:00 PM',
          pickupLocation: 'OmniExpress Central Distribution',
          dropoffLocation: currentLocation,
        })
      }

      clearCart()
      setIsCheckingOut(false)
      setIsCartOpen(false)
      setCurrentPage('orders')
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Your Cart</h3>
                <p className="text-xs text-slate-500">
                  {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'} • $0 Free Delivery
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 divide-y divide-slate-100">
            {totalCartItems === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse Food Delivery or Marketplace products to add items without any delivery or platform fees!
                </p>
              </div>
            ) : (
              <>
                {/* Food Items Section */}
                {foodCart.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5" />
                      Food & Restaurant Items
                    </span>

                    <div className="space-y-2.5">
                      {foodCart.map((ci) => (
                        <div
                          key={ci.item.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                        >
                          <img
                            src={ci.item.image}
                            alt={ci.item.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-slate-900 text-xs truncate">{ci.item.name}</h5>
                            <span className="text-[11px] text-slate-500 font-medium">
                              ${ci.item.price.toFixed(2)} each
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateFoodQuantity(ci.item.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 w-3 text-center">
                              {ci.quantity}
                            </span>
                            <button
                              onClick={() => updateFoodQuantity(ci.item.id, 1)}
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeFoodItem(ci.item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shop Products Section */}
                {shopCart.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" />
                      Marketplace Products
                    </span>

                    <div className="space-y-2.5">
                      {shopCart.map((ci) => (
                        <div
                          key={ci.product.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                        >
                          <img
                            src={ci.product.image}
                            alt={ci.product.title}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-slate-900 text-xs truncate">
                              {ci.product.title}
                            </h5>
                            <span className="text-[11px] text-slate-500 font-medium">
                              ${ci.product.price.toFixed(2)} each
                            </span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateShopQuantity(ci.product.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 w-3 text-center">
                              {ci.quantity}
                            </span>
                            <button
                              onClick={() => updateShopQuantity(ci.product.id, 1)}
                              className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeShopProduct(ci.product.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {totalCartItems > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">${totalCartAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery & Courier</span>
                  <span className="font-bold text-emerald-600">FREE ($0.00)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform / Convenience Fee</span>
                  <span className="font-bold text-emerald-600">FREE ($0.00)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                  <span className="font-extrabold text-slate-900">Total</span>
                  <span className="font-black text-slate-900 text-lg">${totalCartAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivering to */}
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span className="truncate max-w-[240px]">Deliver to: <strong>{currentLocation}</strong></span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition-all active:scale-[0.99]"
              >
                {isCheckingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing $0 Fee Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Place Order & Track Live (${totalCartAmount.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
