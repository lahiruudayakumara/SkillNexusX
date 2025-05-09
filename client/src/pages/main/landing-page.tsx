import { Helmet } from "react-helmet";
import { Suspense, lazy } from "react";
import { HomeView } from "@/sections/main/home/view";
import Hero from "./hero";
import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import FeaturesSection from "./feature";
import TestimonialsSection from "./testimonials";
import PopularCoursesSection from "./courses";
import PricingSection from "./pricing";
import {   FAQSection,
    CTASection,
    NewsletterSection,
    HowItWorksSection,
    AuthModal,
    CourseCategoriesSection,
    PartnersSection } from "./other-features";

// Lazy load the IntercomChat component
const IntercomChat = lazy(() => import('./intercom'));

const LandingPage = () => {
  // Replace with actual user data from your authentication context
  const user = {
    id: '123', // Replace with actual user ID
    name: 'John Doe', // Replace with actual user name
    email: 'john@example.com', // Replace with actual user email
    createdAt: Math.floor(Date.now() / 1000), // Current timestamp in seconds
  };

  return (
    <>
      <Helmet>
        <title>SkillNexus</title>
      </Helmet>
      <Header />
      <Hero /> 
      <HowItWorksSection />
      <FeaturesSection />
      <CourseCategoriesSection />
      <PartnersSection />
      <PopularCoursesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <NewsletterSection />
      <Footer />
      
      {/* Intercom chat with Suspense */}
      <Suspense fallback={null}>
        <IntercomChat user={user} />
      </Suspense>
    </>
  );
};

export default LandingPage;