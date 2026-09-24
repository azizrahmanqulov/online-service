import React, { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Navbar } from './components/common/Navbar'
import { BottomNav } from './components/common/BottomNav'
import { CartDrawer } from './components/common/CartDrawer'
import { LocationPickerModal } from './components/common/LocationPickerModal'
import { ToastNotifications } from './components/common/ToastNotifications'
import { AuthModal } from './components/common/AuthModal'
import { WelcomeAuthScreen } from './components/common/WelcomeAuthScreen'

// Full-page views
import { HomeView } from './components/views/HomeView'
import { MapView } from './components/views/MapView'
import { ServicesView } from './components/views/ServicesView'
import { OrdersView } from './components/views/OrdersView'
import { ProfileView } from './components/views/ProfileView'
import { ShopFullView } from './components/views/ShopFullView'
import { AdminPanelView } from './components/views/AdminPanelView'
import { FoodFullView } from './components/views/FoodFullView'
import { TaxiFullView } from './components/views/TaxiFullView'
import { IntercityFullView } from './components/views/IntercityFullView'
import { CourierFullView } from './components/views/CourierFullView'
import { BusFullView } from './components/views/BusFullView'

const MainContent: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    activeServiceModal,
    setActiveServiceModal,
    showWelcomeScreen,
  } = useApp()

  // When any service modal is triggered, navigate directly to the dedicated full-page view
  useEffect(() => {
    if (!activeServiceModal) return

    // Route each service to its dedicated full-screen page
    const servicePageMap: Record<string, typeof currentPage> = {
      shop: 'shop',
      food: 'food',
      taxi: 'taxi',
      intercity: 'intercity',
      courier: 'courier',
      bus: 'bus',
    }

    const targetPage = servicePageMap[activeServiceModal]
    if (targetPage) {
      setCurrentPage(targetPage)
      setActiveServiceModal(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeServiceModal, setCurrentPage, setActiveServiceModal])

  const renderActiveView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />
      case 'shop':
        return <ShopFullView />
      case 'food':
        return <FoodFullView />
      case 'taxi':
        return <TaxiFullView />
      case 'intercity':
        return <IntercityFullView />
      case 'courier':
        return <CourierFullView />
      case 'bus':
        return <BusFullView />
      case 'map':
        return <MapView />
      case 'services':
        return <ServicesView />
      case 'orders':
        return <OrdersView />
      case 'profile':
        return <ProfileView />
      case 'admin':
        return <AdminPanelView />
      default:
        return <HomeView />
    }
  }

  // Determine if the current view is a dedicated full-width service view (no max-width container needed)
  const isFullWidthView = ['food', 'taxi', 'intercity', 'courier', 'bus'].includes(currentPage)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* First-Time Welcome & Auth Onboarding Screen */}
      {showWelcomeScreen && <WelcomeAuthScreen />}

      {/* Top Navigation & Broadcast Bar */}
      <Navbar />

      {/* Main Content Area */}
      {isFullWidthView ? (
        // Full-width layout for dedicated service views (no max-width restriction)
        <main className="flex-1 pb-24 lg:pb-12">
          {renderActiveView()}
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
          {renderActiveView()}
        </main>
      )}

      {/* Global Modals & Overlays */}
      <AuthModal />
      <LocationPickerModal />
      <CartDrawer />
      <ToastNotifications />

      {/* Bottom Navigation for Mobile */}
      <BottomNav />

      {/* Modern Desktop Footer */}
      <footer className="hidden lg:block bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">OmniServe Super-Platform</span>
            <span>•</span>
            <span>100% Free Everyday Services</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">$0 Platform Fees</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentPage('home')} className="hover:text-slate-900">
              Home
            </button>
            <button onClick={() => setCurrentPage('food')} className="hover:text-slate-900">
              Food Delivery
            </button>
            <button onClick={() => setCurrentPage('taxi')} className="hover:text-slate-900">
              City Taxi
            </button>
            <button onClick={() => setCurrentPage('bus')} className="hover:text-slate-900">
              Bus Transit
            </button>
            <button onClick={() => setCurrentPage('shop')} className="hover:text-slate-900">
              Online Shop
            </button>
            <button onClick={() => setCurrentPage('orders')} className="hover:text-slate-900">
              Orders Tracker
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  )
}
