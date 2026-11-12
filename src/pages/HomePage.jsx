import BlogSection from '../components/sections/BlogSection'
import ClinicsSection from '../components/sections/ClinicsSection'
import CoordinatorSection from '../components/sections/CoordinatorSection'
import DoctorsSection from '../components/sections/DoctorsSection'
import FaqSection from '../components/sections/FaqSection'
import HeroSection from '../components/sections/HeroSection'
import IntroSection from '../components/sections/IntroSection'
import NewsletterSection from '../components/sections/NewsletterSection'
import PlanSection from '../components/sections/PlanSection'
import RefundSection from '../components/sections/RefundSection'
import ReviewsSection from '../components/sections/ReviewsSection'
import SearchSection from '../components/sections/SearchSection'
import ServicesSection from '../components/sections/ServicesSection'
import SupportedSection from '../components/sections/SupportedSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ReviewsSection />
      <ServicesSection />
      <DoctorsSection />
      <ClinicsSection />
      <PlanSection />
      <RefundSection />
      <BlogSection />
      <CoordinatorSection />
      <SearchSection />
      <FaqSection />
      <NewsletterSection />
      <SupportedSection />
    </>
  )
}
