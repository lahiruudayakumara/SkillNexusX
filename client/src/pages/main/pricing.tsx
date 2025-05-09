import { useState } from "react";
import { CheckCircle } from "lucide-react";

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>("monthly");

  const planFeatures = {
    basic: [
      "Access to 20+ basic courses",
      "Course completion certificates",
      "24/7 online support",
      "Mobile access"
    ],
    pro: [
      "Access to all 100+ courses",
      "Course completion certificates",
      "Priority email support",
      "Mobile access",
      "Downloadable resources",
      "Group coaching sessions"
    ],
    premium: [
      "Access to all 100+ courses",
      "Course completion certificates",
      "Priority 24/7 support",
      "Mobile access",
      "Downloadable resources",
      "1-on-1 coaching sessions",
      "Career guidance consultations",
      "Early access to new courses"
    ]
  };

  const pricingData = {
    monthly: [
      {
        id: "basic",
        name: "Basic",
        price: 9.99,
        description: "Perfect for beginners looking to learn new skills",
        features: planFeatures.basic,
        popular: false,
        buttonText: "Get Started",
        savings: undefined
      },
      {
        id: "pro",
        name: "Professional",
        price: 19.99,
        description: "Ideal for career growth and skill advancement",
        features: planFeatures.pro,
        popular: true,
        buttonText: "Start Free Trial"
      },
      {
        id: "premium",
        name: "Premium",
        price: 39.99,
        description: "Complete access with personalized coaching",
        features: planFeatures.premium,
        popular: false,
        buttonText: "Get Started"
      }
    ],
    yearly: [
      {
        id: "basic",
        name: "Basic",
        price: 7.99,
        description: "Perfect for beginners looking to learn new skills",
        features: planFeatures.basic,
        popular: false,
        buttonText: "Get Started",
        savings: "Save $24/year"
      },
      {
        id: "pro",
        name: "Professional",
        price: 16.99,
        description: "Ideal for career growth and skill advancement",
        features: planFeatures.pro,
        popular: true,
        buttonText: "Start Free Trial",
        savings: "Save $36/year"
      },
      {
        id: "premium",
        name: "Premium",
        price: 33.99,
        description: "Complete access with personalized coaching",
        features: planFeatures.premium,
        popular: false,
        buttonText: "Get Started",
        savings: "Save $72/year"
      }
    ]
  };

  const plans = pricingData[billingPeriod];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Simple, Transparent <span className="text-[#3B58C0]">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan to accelerate your learning journey and advance your career.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                billingPeriod === "monthly"
                  ? "bg-white text-[#3B58C0] shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                billingPeriod === "yearly"
                  ? "bg-white text-[#3B58C0] shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl overflow-hidden ${
                plan.popular
                  ? "border-2 border-[#3B58C0] shadow-xl relative"
                  : "border border-gray-200 shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="bg-[#3B58C0] text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className={`text-2xl font-bold ${plan.popular ? "text-[#3B58C0]" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className="text-gray-600 mt-2 min-h-12">{plan.description}</p>
                
                <div className="mt-6 mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600 ml-2">/ month</span>
                  </div>
                  {billingPeriod === "yearly" && (
                    <div className="text-green-600 text-sm font-medium mt-1">
                      {plan.savings}
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    plan.popular
                      ? "bg-[#3B58C0] hover:bg-blue-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  {plan.buttonText}
                </button>

                <div className="border-t border-gray-200 mt-8 pt-6">
                  <p className="font-medium text-gray-700 mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12 text-gray-600">
          <p>30-day money-back guarantee. No questions asked.</p>
        </div>

        {/* FAQs Link */}
        <div className="text-center mt-6">
          <a href="#faq" className="text-[#3B58C0] hover:text-blue-800 font-medium">
            Have questions? Check our FAQ section
          </a>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;