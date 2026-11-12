import { Outlet } from 'react-router-dom'
import FloatingWidgets from '../components/common/FloatingWidgets'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import AuthModal from '../components/modals/AuthModal'
import InquiryModal from '../components/modals/InquiryModal'
import SearchOverlay from '../components/modals/SearchOverlay'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWidgets />
      <InquiryModal />
      <AuthModal />
      <SearchOverlay />
    </div>
  )
}
