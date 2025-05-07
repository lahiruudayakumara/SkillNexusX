import { useState, FormEvent } from "react";
import { ArrowRight, CheckCircle, ChevronDown } from "lucide-react";

const Hero = () => {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle email submission logic here
    console.log("Email submitted:", email);
    setEmail("");
    // You would typically send this to your backend or newsletter service
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      {/* Hero Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div>
              <span className="bg-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                Learning Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 leading-tight">
                Accelerate Your Career With Expert-Led Courses
              </h1>
              <p className="mt-6 text-lg text-blue-100">
                SkillNexusX connects you with the skills and knowledge needed to excel
                in today's competitive job market. Learn, grow, and achieve your goals.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-2">
              <div>
                <p className="text-3xl font-bold">50+</p>
                <p className="text-blue-200 text-sm">Expert Courses</p>
              </div>
              <div>
                <p className="text-3xl font-bold">10k+</p>
                <p className="text-blue-200 text-sm">Active Learners</p>
              </div>
              <div>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-blue-200 text-sm">Satisfaction Rate</p>
              </div>
            </div>

            {/* Email Signup */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-lg flex-grow text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Get Started <ArrowRight size={18} />
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-blue-300" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-blue-300" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={16} className="text-blue-300" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-blue-800 flex items-center justify-center">
                {/* Replace with your actual hero image */}
                <div className="w-full h-full bg-gradient-to-tr from-blue-700 to-indigo-600 p-8 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-full max-w-md">
                    <div className="h-8 w-24 bg-blue-200/30 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-blue-200/30 rounded w-full"></div>
                      <div className="h-4 bg-blue-200/30 rounded w-5/6"></div>
                      <div className="h-4 bg-blue-200/30 rounded w-4/6"></div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="h-12 bg-blue-500/50 rounded"></div>
                      <div className="h-12 bg-blue-500/50 rounded"></div>
                      <div className="h-12 bg-blue-500/50 rounded"></div>
                      <div className="h-12 bg-blue-500/50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feature badges floating on the image */}
              <div className="absolute -bottom-0 -left-[-10] bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-lg shadow-lg">
                <p className="font-bold">Interactive Learning</p>
              </div>
              <div className="absolute -top-0 -right-0 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg shadow-lg">
                <p className="font-bold">Industry Experts</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="flex justify-center mt-12">
          <button 
            onClick={scrollToFeatures}
            className="flex flex-col items-center text-blue-200 hover:text-white transition-colors"
          >
            <span className="text-sm mb-1">Explore More</span>
            <ChevronDown size={24} className="animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;