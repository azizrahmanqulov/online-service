import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  PageView,
  ServiceId,
  FoodItem,
  FoodCartItem,
  ShopProduct,
  ShopCartItem,
  ServiceOrder,
  UserProfile,
  ToastMessage,
  ActiveBusVehicle,
  BusStop,
  SavedAddress,
  AuthUser,
  UserRole,
  OrderStatus,
} from '../types'
import {
  INITIAL_USER_PROFILE,
  INITIAL_ORDERS,
  INITIAL_BUSES,
  BUS_LINES,
  SHOP_PRODUCTS,
} from '../data/mockData'

const DEFAULT_USER: AuthUser = {
  id: 'usr-1',
  name: 'Samira Vance',
  email: 'samira.vance@example.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  phone: '+1 (555) 234-5678',
}

const DEFAULT_ADMIN: AuthUser = {
  id: 'adm-1',
  name: 'Master Admin',
  email: 'admin@omniserve.org',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  phone: '+1 (555) 000-ADMIN',
}

interface AppContextType {
  // Navigation
  currentPage: PageView
  setCurrentPage: (page: PageView) => void
  activeServiceModal: ServiceId | null
  setActiveServiceModal: (service: ServiceId | null) => void
  
  // Authentication & Onboarding
  currentUser: AuthUser | null
  userRole: UserRole
  isLoggedIn: boolean
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void
  showWelcomeScreen: boolean
  setShowWelcomeScreen: (show: boolean) => void
  login: (role: UserRole, email?: string, name?: string) => void
  logout: () => void

  // Location
  currentLocation: string
  setCurrentLocation: (loc: string) => void
  isLocationPickerOpen: boolean
  setIsLocationPickerOpen: (open: boolean) => void
  
  // Global search
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Products (Managed & expandable by Admin)
  products: ShopProduct[]
  
  // Cart
  foodCart: FoodCartItem[]
  shopCart: ShopCartItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addFoodItem: (item: FoodItem, quantity?: number) => void
  removeFoodItem: (itemId: string) => void
  updateFoodQuantity: (itemId: string, delta: number) => void
  addShopProduct: (product: ShopProduct, quantity?: number) => void
  removeShopProduct: (productId: string) => void
  updateShopQuantity: (productId: string, delta: number) => void
  clearCart: () => void
  totalCartItems: number
  totalCartAmount: number
  
  // Wishlist
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  
  // Orders
  orders: ServiceOrder[]
  activeOrders: ServiceOrder[]
  pastOrders: ServiceOrder[]
  addOrder: (order: Omit<ServiceOrder, 'id' | 'createdAt'>) => string
  cancelOrder: (orderId: string) => void
  
  // Admin Operations
  disabledServices: ServiceId[]
  announcement: string | null
  adminToggleService: (serviceId: ServiceId, enabled: boolean) => void
  adminSetAnnouncement: (text: string | null) => void
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus, statusText?: string) => void
  adminAddProduct: (prod: Omit<ShopProduct, 'id'>) => void
  adminUpdateProduct: (id: string, patch: Partial<ShopProduct>) => void
  adminDeleteProduct: (id: string) => void

  // Toasts
  toasts: ToastMessage[]
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning', serviceId?: ServiceId) => void
  removeToast: (id: string) => void
  
  // Profile
  userProfile: UserProfile
  updateUserProfile: (profile: Partial<UserProfile>) => void
  addSavedAddress: (addr: SavedAddress) => void
  removeSavedAddress: (id: string) => void
  
  // Map and Live Transit
  liveBuses: ActiveBusVehicle[]
  mapFilter: 'all' | 'taxis' | 'buses' | 'food' | 'couriers'
  setMapFilter: (f: 'all' | 'taxis' | 'buses' | 'food' | 'couriers') => void
  selectedStop: BusStop | null
  setSelectedStop: (stop: BusStop | null) => void
  selectedVehicle: ActiveBusVehicle | null
  setSelectedVehicle: (v: ActiveBusVehicle | null) => void
  mapFocusPoint: { x: number; y: number } | null
  setMapFocusPoint: (point: { x: number; y: number } | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home')
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceId | null>(null)

  // Auth & Onboarding state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('omni_auth_user')
    return saved ? JSON.parse(saved) : DEFAULT_USER
  })
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState<boolean>(() => {
    return !localStorage.getItem('omni_welcome_seen')
  })

  // System & Admin Controls
  const [disabledServices, setDisabledServices] = useState<ServiceId[]>([])
  const [announcement, setAnnouncement] = useState<string | null>(
    '✨ Citizen Notice: OmniServe is 100% free for all residents — No surge pricing, no platform cuts, and $0 delivery fees.'
  )
  
  // Products list (dynamically manageable by Admin)
  const [products, setProducts] = useState<ShopProduct[]>(() => {
    const saved = localStorage.getItem('omni_products')
    return saved ? JSON.parse(saved) : SHOP_PRODUCTS
  })

  const [currentLocation, setCurrentLocation] = useState<string>('742 Evergreen Terrace, Downtown')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Cart states
  const [foodCart, setFoodCart] = useState<FoodCartItem[]>([])
  const [shopCart, setShopCart] = useState<ShopCartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  
  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-3'])
  
  // Orders
  const [orders, setOrders] = useState<ServiceOrder[]>(() => {
    const saved = localStorage.getItem('omni_orders')
    return saved ? JSON.parse(saved) : INITIAL_ORDERS
  })
  
  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  
  // Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('omni_profile')
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE
  })
  
  // Live Buses & Map
  const [liveBuses, setLiveBuses] = useState<ActiveBusVehicle[]>(INITIAL_BUSES)
  const [mapFilter, setMapFilter] = useState<'all' | 'taxis' | 'buses' | 'food' | 'couriers'>('all')
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<ActiveBusVehicle | null>(null)
  const [mapFocusPoint, setMapFocusPoint] = useState<{ x: number; y: number } | null>(null)

  // Persist auth, products, orders & profile
  useEffect(() => {
    localStorage.setItem('omni_auth_user', JSON.stringify(currentUser))
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem('omni_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('omni_orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('omni_profile', JSON.stringify(userProfile))
  }, [userProfile])

  // Authentication functions
  const login = (role: UserRole, email?: string, name?: string) => {
    if (role === 'admin') {
      setCurrentUser({
        ...DEFAULT_ADMIN,
        email: email || DEFAULT_ADMIN.email,
        name: name || DEFAULT_ADMIN.name,
      })
      addToast('Administrator Access Granted', 'You now have full control over orders, inventory, and services.', 'success')
    } else {
      setCurrentUser({
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        name: name || DEFAULT_USER.name,
      })
      addToast('Welcome Back!', `Signed in as ${name || DEFAULT_USER.name}`, 'success')
    }
    setIsAuthModalOpen(false)
    localStorage.setItem('omni_welcome_seen', 'true')
    setShowWelcomeScreen(false)
  }

  const logout = () => {
    setCurrentUser(null)
    if (currentPage === 'admin') {
      setCurrentPage('home')
    }
    addToast('Signed Out', 'You are now browsing as a guest.', 'info')
  }

  const userRole: UserRole = currentUser?.role || 'user'
  const isLoggedIn = currentUser !== null

  // Toast helper
  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' = 'info',
    serviceId?: ServiceId
  ) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title,
      message,
      type,
      serviceId,
    }
    setToasts((prev) => [...prev.slice(-3), newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Live Bus simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBuses((prevBuses) => {
        return prevBuses.map((bus) => {
          const line = BUS_LINES.find((l) => l.id === bus.lineId)
          if (!line || line.pathPoints.length < 2) return bus

          const dx = (Math.random() - 0.45) * 4
          const dy = (Math.random() - 0.45) * 4
          
          let nextX = bus.x + dx
          let nextY = bus.y + dy

          if (nextX < 120) nextX = 140
          if (nextX > 880) nextX = 860
          if (nextY < 120) nextY = 140
          if (nextY > 580) nextY = 560

          return {
            ...bus,
            x: Math.round(nextX),
            y: Math.round(nextY),
            speedKmH: Math.floor(25 + Math.random() * 20),
          }
        })
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Live active orders progression simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) => {
        let changed = false
        const updated = prevOrders.map((ord) => {
          if (ord.status === 'completed' || ord.status === 'cancelled') {
            return ord
          }

          if (ord.status === 'confirmed') {
            changed = true
            return {
              ...ord,
              status: 'on_the_way' as const,
              progressStep: 2,
              statusText: 'Driver / Courier is on the way to you',
              estimatedTime: '8 mins remaining',
            }
          } else if (ord.status === 'on_the_way') {
            changed = true
            return {
              ...ord,
              status: 'arriving' as const,
              progressStep: 3,
              statusText: 'Arriving in less than 2 minutes!',
              estimatedTime: '2 mins remaining',
            }
          }
          return ord
        })
        return changed ? updated : prevOrders
      })
    }, 45000)

    return () => clearInterval(timer)
  }, [])

  // Admin Operations
  const adminToggleService = (serviceId: ServiceId, enabled: boolean) => {
    setDisabledServices((prev) => {
      if (enabled) {
        return prev.filter((id) => id !== serviceId)
      } else {
        return prev.includes(serviceId) ? prev : [...prev, serviceId]
      }
    })
    addToast(
      'Service State Updated',
      `${serviceId.toUpperCase()} is now ${enabled ? 'ENABLED' : 'PAUSED (Maintenance)'}`,
      'info'
    )
  }

  const adminSetAnnouncement = (text: string | null) => {
    setAnnouncement(text)
    addToast('Broadcast Updated', text ? 'Announcement published' : 'Announcement cleared', 'success')
  }

  const adminUpdateOrderStatus = (orderId: string, status: OrderStatus, statusText?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          let step = 1
          if (status === 'driver_assigned') step = 2
          if (status === 'on_the_way') step = 3
          if (status === 'arriving' || status === 'completed') step = 4
          return {
            ...o,
            status,
            progressStep: step,
            statusText: statusText || `Status updated to ${status.replace('_', ' ')} by Admin`,
          }
        }
        return o
      })
    )
    addToast('Order Status Updated', `Order #${orderId} marked as ${status}`, 'success')
  }

  const adminAddProduct = (prod: Omit<ShopProduct, 'id'>) => {
    const newProd: ShopProduct = {
      ...prod,
      id: 'prod-' + Date.now(),
    }
    setProducts((prev) => [newProd, ...prev])
    addToast('Product Added', `"${newProd.title}" added to marketplace.`, 'success', 'shop')
  }

  const adminUpdateProduct = (id: string, patch: Partial<ShopProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    )
    addToast('Product Updated', 'Changes saved successfully', 'success', 'shop')
  }

  const adminDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    addToast('Product Deleted', 'Product removed from marketplace', 'info', 'shop')
  }

  // Cart operations
  const addFoodItem = (item: FoodItem, quantity: number = 1) => {
    setFoodCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id)
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        )
      }
      return [...prev, { item, quantity }]
    })
    addToast('Added to Cart', `${item.name} added to your food order`, 'success', 'food')
  }

  const removeFoodItem = (itemId: string) => {
    setFoodCart((prev) => prev.filter((ci) => ci.item.id !== itemId))
  }

  const updateFoodQuantity = (itemId: string, delta: number) => {
    setFoodCart((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const nextQty = ci.quantity + delta
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null
          }
          return ci
        })
        .filter(Boolean) as FoodCartItem[]
    )
  }

  const addShopProduct = (product: ShopProduct, quantity: number = 1) => {
    setShopCart((prev) => {
      const existing = prev.find((ci) => ci.product.id === product.id)
      if (existing) {
        return prev.map((ci) =>
          ci.product.id === product.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        )
      }
      return [...prev, { product, quantity }]
    })
    addToast('Added to Cart', `${product.title} added to your cart`, 'success', 'shop')
  }

  const removeShopProduct = (productId: string) => {
    setShopCart((prev) => prev.filter((ci) => ci.product.id !== productId))
  }

  const updateShopQuantity = (productId: string, delta: number) => {
    setShopCart((prev) =>
      prev
        .map((ci) => {
          if (ci.product.id === productId) {
            const nextQty = ci.quantity + delta
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null
          }
          return ci
        })
        .filter(Boolean) as ShopCartItem[]
    )
  }

  const clearCart = () => {
    setFoodCart([])
    setShopCart([])
  }

  const totalCartItems =
    foodCart.reduce((sum, item) => sum + item.quantity, 0) +
    shopCart.reduce((sum, item) => sum + item.quantity, 0)

  const totalCartAmount =
    foodCart.reduce((sum, item) => sum + item.item.price * item.quantity, 0) +
    shopCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId)
      if (exists) {
        addToast('Removed from Wishlist', 'Item removed from your favorites', 'info', 'shop')
        return prev.filter((id) => id !== productId)
      } else {
        addToast('Saved to Wishlist', 'Item added to your favorites', 'success', 'shop')
        return [...prev, productId]
      }
    })
  }

  const isWishlisted = (productId: string) => wishlist.includes(productId)

  // Orders
  const addOrder = (orderData: Omit<ServiceOrder, 'id' | 'createdAt'>): string => {
    const id = 'ORD-' + Math.floor(1000 + Math.random() * 9000)
    const newOrder: ServiceOrder = {
      ...orderData,
      id,
      createdAt: 'Just now',
    }
    setOrders((prev) => [newOrder, ...prev])
    addToast('Order Placed Successfully!', `${newOrder.title} is now active. 100% Free platform fee.`, 'success', newOrder.serviceId)
    return id
  }

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'cancelled',
              statusText: 'Order cancelled by user',
              estimatedTime: 'Cancelled',
            }
          : ord
      )
    )
    addToast('Order Cancelled', 'Your order was successfully cancelled without any fee.', 'info')
  }

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled')
  const pastOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled')

  // Profile operations
  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...patch }))
    addToast('Profile Updated', 'Your preferences have been saved successfully.', 'success')
  }

  const addSavedAddress = (addr: SavedAddress) => {
    setUserProfile((prev) => ({
      ...prev,
      savedAddresses: [...prev.savedAddresses, addr],
    }))
    addToast('Address Saved', `"${addr.label}" was added to your addresses.`, 'success')
  }

  const removeSavedAddress = (id: string) => {
    setUserProfile((prev) => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter((a) => a.id !== id),
    }))
  }

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        activeServiceModal,
        setActiveServiceModal,
        currentUser,
        userRole,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        products,
        currentLocation,
        setCurrentLocation,
        isLocationPickerOpen,
        setIsLocationPickerOpen,
        searchQuery,
        setSearchQuery,
        foodCart,
        shopCart,
        isCartOpen,
        setIsCartOpen,
        addFoodItem,
        removeFoodItem,
        updateFoodQuantity,
        addShopProduct,
        removeShopProduct,
        updateShopQuantity,
        clearCart,
        totalCartItems,
        totalCartAmount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        activeOrders,
        pastOrders,
        addOrder,
        cancelOrder,
        disabledServices,
        announcement,
        adminToggleService,
        adminSetAnnouncement,
        adminUpdateOrderStatus,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        toasts,
        addToast,
        removeToast,
        userProfile,
        updateUserProfile,
        addSavedAddress,
        removeSavedAddress,
        liveBuses,
        mapFilter,
        setMapFilter,
        selectedStop,
        setSelectedStop,
        selectedVehicle,
        setSelectedVehicle,
        showWelcomeScreen,
        setShowWelcomeScreen,
        mapFocusPoint,
        setMapFocusPoint,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
