import { Book, Award, Users, Clock, Globe, Headphones } from "lucide-react";
import { useState } from "react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Book className="h-6 w-6 text-[#1A3AA4]" />,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of experience in their respective fields."
    },
    {
      icon: <Award className="h-6 w-6 text-[#1A3AA4]" />,
      title: "Earn Certificates",
      description: "Gain verifiable certificates upon course completion to showcase your new skills."
    },
    {
      icon: <Users className="h-6 w-6 text-[#1A3AA4]" />,
      title: "Community Support",
      description: "Join our active learning community for networking and collaboration opportunities."
    },
    {
      icon: <Clock className="h-6 w-6 text-[#1A3AA4]" />,
      title: "Learn at Your Pace",
      description: "Flexible scheduling allows you to learn whenever and wherever it suits you best."
    },
    {
      icon: <Globe className="h-6 w-6 text-[#1A3AA4]" />,
      title: "Global Perspective",
      description: "Access diverse content that incorporates international best practices and viewpoints."
    },
    {
      icon: <Headphones className="h-6 w-6 text-[#1A3AA4]" />,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team and resources."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#1A3AA4] font-medium text-sm mb-4">
            OUR FEATURES
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Everything You Need to <span className="text-[#1A3AA4]">Excel</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            SkillNexusX combines powerful features to provide the ultimate learning experience 
            and help you achieve your career goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 cursor-pointer">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-white rounded-2xl  shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#1A3AA4] to-[#2E4FC9] rounded-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
              <div className="mb-8 md:mb-0 text-center md:text-left md:pr-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to start your learning journey?</h3>
                <p className="text-lg text-blue-100">Join thousands of professionals advancing their careers today.</p>
              </div>
              <div className="flex-shrink-0">
                <button className="group relative px-8 py-4 bg-white text-[#1A3AA4] font-medium rounded-xl hover:bg-blue-50 transition shadow-lg cursor-pointer">
                  <span className="relative z-10 flex items-center">
                    Browse Courses
                    <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Define the feature interface
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Separate component for each feature card
const FeatureCard = ({ feature }: { feature: Feature }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-md transition-all duration-300 h-full border border-gray-100 ${
        isHovered ? 'shadow-lg border-blue-100 translate-y-[-4px]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start mb-4">
        <div className="bg-blue-50 rounded-lg p-3 mr-4">
          {feature.icon}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 pt-1">{feature.title}</h3>
      </div>
      
      <p className="text-gray-600 leading-relaxed ml-16">
        {feature.description}
      </p>
      
      <div className={`mt-4 ml-16 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button className="text-sm font-medium text-[#1A3AA4] flex items-center group">
          Learn more
          <svg 
            className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};


export default FeaturesSection;