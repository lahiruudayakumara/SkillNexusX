import { Book, Award, Users, Clock, Globe, Headphones } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Book className="h-10 w-10 text-blue-600" />,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of experience in their respective fields."
    },
    {
      icon: <Award className="h-10 w-10 text-blue-600" />,
      title: "Earn Certificates",
      description: "Gain verifiable certificates upon course completion to showcase your new skills."
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "Community Support",
      description: "Join our active learning community for networking and collaboration opportunities."
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-600" />,
      title: "Learn at Your Pace",
      description: "Flexible scheduling allows you to learn whenever and wherever it suits you best."
    },
    {
      icon: <Globe className="h-10 w-10 text-blue-600" />,
      title: "Global Perspective",
      description: "Access diverse content that incorporates international best practices and viewpoints."
    },
    {
      icon: <Headphones className="h-10 w-10 text-blue-600" />,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team and resources."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Everything You Need to <span className="text-blue-600">Excel</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            SkillNexusX combines powerful features to provide the ultimate learning experience 
            and help you achieve your career goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-blue-100"
            >
              <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to start your learning journey?</h3>
              <p className="mt-2 text-blue-100">Join thousands of professionals advancing their careers today.</p>
            </div>
            <div>
              <button className="px-8 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition shadow-md">
                Browse Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;