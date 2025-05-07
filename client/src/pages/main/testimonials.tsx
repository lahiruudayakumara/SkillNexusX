import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "UX Designer",
      company: "CreativeTech",
      image: "/api/placeholder/150/150", // Replace with actual image in production
      quote: "SkillNexusX helped me transition from graphic design to UX in just 3 months. The structured curriculum and mentor feedback were exactly what I needed to build my portfolio and land my dream job.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Data Analyst",
      company: "FinancePro",
      image: "/api/placeholder/150/150", // Replace with actual image in production
      quote: "After completing the Data Analytics course, I was able to automate key processes at my company, saving us over 20 hours per week. The practical projects were incredibly relevant to real-world challenges.",
      rating: 5
    },
    {
      name: "Emma Wilson",
      role: "Project Manager",
      company: "TechSolutions",
      image: "/api/placeholder/150/150", // Replace with actual image in production
      quote: "The project management certification from SkillNexusX gave me the confidence to lead larger teams. Within 6 months of completing the course, I received a promotion and a 30% salary increase.",
      rating: 5
    },
    {
      name: "David Rodriguez",
      role: "Software Developer",
      company: "InnovateSoft",
      image: "/api/placeholder/150/150", // Replace with actual image in production
      quote: "The coding bootcamp was intense but worth every minute. The instructors were excellent at breaking down complex concepts, and the peer collaboration made learning enjoyable. Highly recommended!",
      rating: 4
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialCount = testimonials.length;
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialCount);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialCount) % testimonialCount);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Success Stories From Our <span className="text-blue-600">Community</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            See how SkillNexusX has helped professionals like you transform their careers and achieve their goals.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-5xl mx-auto">
          {/* Slider Controls */}
          <div className="absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 z-10">
            <button 
              onClick={prevTestimonial}
              className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 z-10">
            <button 
              onClick={nextTestimonial}
              className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Testimonial Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Testimonial Image - Hidden on mobile */}
              <div className="hidden lg:block bg-gradient-to-br from-blue-700 to-indigo-800 p-8 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Testimonial Content */}
              <div className="p-8 lg:p-12 lg:col-span-2">
                {/* Rating Stars */}
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < testimonials[currentIndex].rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-xl italic text-gray-700 mb-6 leading-relaxed">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                {/* Person Info */}
                <div className="flex items-center">
                  {/* Mobile only image */}
                  <div className="lg:hidden w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <div className="font-bold text-gray-900">{testimonials[currentIndex].name}</div>
                    <div className="text-gray-600">{testimonials[currentIndex].role} at {testimonials[currentIndex].company}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a 
            href="#" 
            className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4"
          >
            Read more success stories
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;