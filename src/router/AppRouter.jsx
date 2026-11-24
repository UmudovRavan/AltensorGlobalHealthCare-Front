import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from '../components/common/ScrollToTop'
import MainLayout from '../layouts/MainLayout'
import AboutPage from '../pages/AboutPage'
import BlogPage from '../pages/BlogPage'
import ClinicsPage from '../pages/ClinicsPage'
import DoctorsPage from '../pages/DoctorsPage'
import HomePage from '../pages/HomePage'
import InquiriesPage from '../pages/InquiriesPage'
import InquiryDetailPage from '../pages/InquiryDetailPage'
import ProfilePage from '../pages/ProfilePage'
import {
  LegalPage,
  SearchResultsPage,
  SymptomsPage,
  ZagrebPage,
} from '../pages/InfoPage'
import ReviewsPage from '../pages/ReviewsPage'
import ServicesPage from '../pages/ServicesPage'
import TreatmentPlanPage from '../pages/TreatmentPlanPage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Portal (Role-protected: AdminLoginPage -> AdminDashboardPage) */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} />

        {/* Guest 9-Step Treatment Planner */}
        <Route path="/plan" element={<TreatmentPlanPage />} />
        <Route path="/en/plan" element={<TreatmentPlanPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/en" element={<HomePage />} />

          {/* User Portal / Post-Login Routes (ZagrebMed exact 1:1) */}
          <Route path="/en/my-profile" element={<ProfilePage />} />
          <Route path="/en/my-profile/inquiries" element={<InquiriesPage />} />
          <Route path="/en/my-profile/:inquiryId" element={<InquiryDetailPage />} />
          <Route path="/en/user/profile" element={<ProfilePage />} />
          <Route path="/en/user/inquiries" element={<InquiriesPage />} />
          <Route path="/en/user/inquiries/:inquiryId" element={<InquiryDetailPage />} />
          <Route path="/en/my-inquiries" element={<InquiriesPage />} />
          <Route path="/en/profile" element={<ProfilePage />} />

          {/* About Us */}
          <Route path="/en/about-us" element={<AboutPage />} />
          <Route path="/en/about-us/:subpage" element={<AboutPage />} />

          {/* Services */}
          <Route path="/en/services" element={<ServicesPage />} />
          <Route path="/en/services/:category" element={<ServicesPage />} />
          <Route path="/en/services/:category/:sub" element={<ServicesPage />} />
          <Route
            path="/en/services/:category/:sub/:procedure"
            element={<ServicesPage />}
          />

          {/* Doctors */}
          <Route path="/en/doctors" element={<DoctorsPage />} />
          <Route path="/en/doctors/:slug" element={<DoctorsPage />} />

          {/* Clinics */}
          <Route path="/en/clinics" element={<ClinicsPage />} />
          <Route path="/en/clinics/:slug" element={<ClinicsPage />} />

          {/* Reviews */}
          <Route path="/en/patient-reviews" element={<ReviewsPage />} />

          {/* Zagreb / Altensor Healthcare */}
          <Route path="/en/zagreb" element={<ZagrebPage />} />
          <Route path="/en/zagreb/:subpage" element={<ZagrebPage />} />
          <Route path="/en/altensor-healthcare" element={<ZagrebPage />} />
          <Route path="/en/altensor-healthcare/:subpage" element={<ZagrebPage />} />

          {/* Blog */}
          <Route path="/en/blog" element={<BlogPage />} />
          <Route path="/en/blog/:slug" element={<BlogPage />} />

          {/* Utility & Legal */}
          <Route path="/en/medical-symptoms" element={<SymptomsPage />} />
          <Route path="/en/terms-and-conditions" element={<LegalPage type="terms" />} />
          <Route path="/en/privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="/en/search" element={<SearchResultsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/en" replace />} />
      </Routes>
    </>
  )
}
