import { useState } from "react";
import { Search, Calendar, User, Mail, Lock, ChevronDown, Book, BookOpen, GraduationCap, Award } from "lucide-react";

/**
 * FAQ Section Component
 * Since you mentioned a link to FAQs in your pricing section
 */
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "How do I access courses after purchase?",
      answer: "After purchasing, you'll receive login credentials via email. Simply log in to your account, navigate to 'My Courses' and you'll find all purchased courses ready to access."
    },
    {
      question: "Can I switch plans later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards future billing cycles."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees. The price you see is what you pay, and we'll always notify you before any changes to your subscription."
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a 30-day money-back guarantee on all our plans. If you're not satisfied for any reason, contact our support team within 30 days of purchase for a full refund."
    },
    {
      question: "Can I share my account with others?",
      answer: "Our accounts are for individual use only and cannot be shared. We offer team and enterprise solutions if you need access for multiple users."
    },
    {
      question: "How often is new content added?",
      answer: "We add new courses and update existing content monthly. Premium members get early access to all new content."
    }
  ];

  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about our platform, courses, and subscription plans.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border border-gray-200 rounded-lg bg-white overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-600 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              
              {openIndex === index && (
                <div className="p-4 pt-0 text-gray-600 border-t border-gray-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Call-to-Action Section Component
 * A strong CTA to encourage sign-ups
 */
const CTASection = () => {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start Your Learning Journey Today
        </h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Join thousands of learners already advancing their careers with our expert-led courses.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition">
            Get Started For Free
          </button>
          <button className="bg-transparent border-2 border-white hover:bg-blue-700 font-bold py-3 px-8 rounded-lg transition">
            View Courses
          </button>
        </div>
        <p className="mt-6 text-blue-100">No credit card required for free trial</p>
      </div>
    </section>
  );
};

/**
 * Newsletter Signup Component
 * Capture emails for marketing
 */
const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic
    console.log("Newsletter signup:", email);
    // Reset form
    setEmail("");
    // Show success message or redirect
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Stay Updated with New Courses
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter and be the first to know about new course releases, special offers, and learning tips.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <div className="flex-grow">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

/**
 * How It Works Section
 * Explaining the learning process
 */
const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-blue-600" />,
      title: "Find Your Course",
      description: "Browse our extensive library of courses across multiple disciplines and skill levels."
    },
    {
      icon: <Calendar className="w-12 h-12 text-blue-600" />,
      title: "Learn At Your Pace",
      description: "Access course content anytime, anywhere, and learn at a schedule that works for you."
    },
    {
      icon: <Award className="w-12 h-12 text-blue-600" />,
      title: "Earn Certification",
      description: "Complete assessments and projects to earn recognized certificates for your profile."
    },
    {
      icon: <GraduationCap className="w-12 h-12 text-blue-600" />,
      title: "Advance Your Career",
      description: "Apply your new skills to real-world challenges and take your career to the next level."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How It <span className="text-blue-600">Works</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our simple four-step process makes learning new skills easier than ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Authentication Components (Login/Signup)
 */
const AuthModal = ({ isLogin = true, onClose }: { isLogin?: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle auth logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? "Sign in to access your courses and continue learning"
              : "Join thousands of learners to start your journey"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}
          
          {isLogin && (
            <div className="flex justify-end mb-4">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot your password?
              </a>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              {isLogin ? "Sign Up" : "Sign In"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Course Category Section Component
 * To showcase different category options
 */
const CourseCategoriesSection = () => {
  const categories = [
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Web Development",
      courseCount: 42,
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Book className="w-10 h-10" />,
      title: "Data Science",
      courseCount: 38,
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Business",
      courseCount: 56,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: <Book className="w-10 h-10" />,
      title: "Design",
      courseCount: 29,
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Marketing",
      courseCount: 32,
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <Book className="w-10 h-10" />,
      title: "Personal Development",
      courseCount: 45,
      color: "bg-teal-100 text-teal-600"
    }
  ];

  return (
    <section id="categories" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse <span className="text-blue-600">Categories</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore our wide range of courses across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <a 
              key={index}
              href="#" 
              className="block group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center ${category.color} mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {category.title}
                </h3>
                <p className="text-gray-600">
                  {category.courseCount} courses
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * Partners/Trusted By Section
 */
const PartnersSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-lg font-medium text-gray-600 mb-8">
          Trusted by leading companies worldwide
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-70">
          {/* These would typically be actual logos, but for demo purposes we're using text */}
          <div className="text-xl font-bold text-gray-400">ACME Inc</div>
          <div className="text-xl font-bold text-gray-400">TechCorp</div>
          <div className="text-xl font-bold text-gray-400">GlobalSoft</div>
          <div className="text-xl font-bold text-gray-400">FutureTech</div>
          <div className="text-xl font-bold text-gray-400">InnovateCo</div>
          <div className="text-xl font-bold text-gray-400">LeadEdge</div>
        </div>
      </div>
    </section>
  );
};

export { 
  FAQSection,
  CTASection,
  NewsletterSection,
  HowItWorksSection,
  AuthModal,
  CourseCategoriesSection,
  PartnersSection
};