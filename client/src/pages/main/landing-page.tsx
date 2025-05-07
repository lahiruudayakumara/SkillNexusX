import { Helmet } from "react-helmet";
import { HomeView } from "@/sections/main/home/view";
import Hero from "./hero";
import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import FeaturesSection from "./feature";
import TestimonialsSection from "./testimonials";

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>SkillNexus</title>
      </Helmet>
      <Header />
      <Hero /> 
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
      
      
    </>
  );
};

export default LandingPage;
