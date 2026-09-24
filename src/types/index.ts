export type ServiceId = 'taxi' | 'intercity' | 'food' | 'courier' | 'shop' | 'bus'

export type PageView =
  | 'home'
  | 'shop'
  | 'food'
  | 'taxi'
  | 'intercity'
  | 'courier'
  | 'bus'
  | 'map'
  | 'services'
  | 'orders'
  | 'profile'
  | 'admin'

export type UserRole = 'user' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  phone: string
}

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'driver_assigned'
  | 'on_the_way'
  | 'arriving'
  | 'completed'
  | 'cancelled'

// Taxi
export interface TaxiVehicleType {
  id: string
  name: string
  description: string
  etaMinutes: number
  price: number
  capacity: number
  luggage: number
  badge?: string
  iconName: string
}

export interface DriverInfo {
  name: string
  avatar: string
  rating: number
  tripsCount: number
  phone: string
  carModel: string
  carColor: string
  plateNumber: string
}

// Intercity
export interface IntercityTrip {
  id: string
  fromCity: string
  toCity: string
  departureTime: string
  arrivalTime: string
  duration: string
  pricePerSeat: number
  carModel: string
  driver: DriverInfo
  availableSeats: number[] // e.g. [1, 2, 4] where seat 3 is taken
  totalSeats: number
  features: string[]
  pickupPoint: string
  dropoffPoint: string
}

// Food Delivery
export interface FoodItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  calories?: number
  isVegetarian?: boolean
  isPopular?: boolean
  preparationTime: string
}

export interface Restaurant {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number // Always 0 (Free platform)
  minOrder: number
  image: string
  tags: string[]
  address: string
  coords: { x: number; y: number }
  popularItems: FoodItem[]
}

export interface FoodCartItem {
  item: FoodItem
  quantity: number
  notes?: string
}

// Courier / Delivery
export type PackageSize = 'envelope' | 'small' | 'medium' | 'cargo'

export interface CourierRequest {
  pickupAddress: string
  pickupContact: string
  pickupPhone: string
  deliveryAddress: string
  recipientContact: string
  recipientPhone: string
  packageSize: PackageSize
  weightKg: number
  urgentExpress: boolean
  fragile: boolean
  instructions?: string
}

// Online Shop
export interface ShopProduct {
  id: string
  title: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviewsCount: number
  image: string
  stock: number
  isBestSeller?: boolean
  isNew?: boolean
  freeDelivery: boolean
  description: string
  specs: { [key: string]: string }
}

export interface ShopCartItem {
  product: ShopProduct
  quantity: number
}

// Bus Transit
export interface BusStop {
  id: string
  name: string
  lineIds: string[]
  coords: { x: number; y: number }
  approachingBuses: {
    busNumber: string
    lineId: string
    destination: string
    etaMinutes: number
  }[]
}

export interface BusLine {
  id: string
  number: string
  name: string
  color: string
  frequencyMinutes: number
  operatingHours: string
  stops: BusStop[]
  pathPoints: { x: number; y: number }[]
}

export interface ActiveBusVehicle {
  id: string
  lineId: string
  busNumber: string
  x: number
  y: number
  heading: number
  speedKmH: number
  nextStopName: string
  etaNextStopMin: number
  occupancy: 'empty' | 'low' | 'medium' | 'crowded'
}

// Orders
export interface ServiceOrder {
  id: string
  serviceId: ServiceId
  serviceName: string
  title: string
  subtitle: string
  totalAmount: number
  currency: string
  createdAt: string
  status: OrderStatus
  progressStep: number // 1 to 4
  statusText: string
  estimatedTime: string
  driverOrCourier?: DriverInfo
  pickupLocation: string
  dropoffLocation: string
  trackingCode?: string
  itemsSummary?: string
  details?: Record<string, any>
  mapCoords?: { x: number; y: number }
}

// User Profile
export interface SavedAddress {
  id: string
  label: string
  address: string
  type: 'home' | 'work' | 'other'
}

export interface FavoritePlace {
  id: string
  name: string
  category: string
  address: string
  rating: number
}

export interface UserProfile {
  name: string
  phone: string
  email: string
  avatar: string
  savedAddresses: SavedAddress[]
  favoritePlaces: FavoritePlace[]
  selectedPayment: 'cash' | 'card' | 'wallet'
  language: string
  theme: 'light' | 'dark'
  notificationsEnabled: boolean
}

// Toast
export interface ToastMessage {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning'
  serviceId?: ServiceId
}
