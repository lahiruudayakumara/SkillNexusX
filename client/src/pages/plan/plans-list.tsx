import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLearningPlans } from "@/api/learning-plan-api";
import { LearningPlan } from "@../../stores/slices/learning-plan/learning-slice";

const PlansListPage = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("All Plans");
  const navigate = useNavigate();

  const getProgress = (plan: LearningPlan) => {
    const total = plan.resources?.length || 0;
    const completed = localStorage.getItem(`completed-${plan.id}`)
      ? JSON.parse(localStorage.getItem(`completed-${plan.id}`) || '[]')
      : [];
    return total > 0 ? Math.round((completed.length / total) * 100) : 0;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllLearningPlans();
        setPlans(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <p>Loading...</p>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <p>Error: {error}</p>
      </div>
      <Footer />
    </div>
  );

  // Filter plans based on active tab
  const filteredPlans = plans.filter(plan => {
    const progress = getProgress(plan);
    if (activeTab === "All Plans") return true;
    if (activeTab === "In Progress") return progress > 0 && progress < 100;
    if (activeTab === "Completed") return progress === 100;
    if (activeTab === "My Progress") return true; // Customize as needed
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Learning Plans Management</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate('/plans/create')}
          >
            Create New Plan
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            {["All Plans", "In Progress", "Completed", "My Progress"].map((tab) => (
              <button
                key={tab}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {filteredPlans.length === 0 ? (
          <p>No plans found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlans.map((plan) => {
              const progress = getProgress(plan);
              const isCompleted = progress === 100;
              const isOverdue = plan.endDate ? new Date(plan.endDate) < new Date() && !isCompleted : false;

              return (
                <div key={plan.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className={`px-4 py-2 text-xs ${isCompleted ? 'bg-green-100 text-green-800' : isOverdue ? 'bg-red-100 text-red-800' : ''}`}>
                    {isCompleted ? 'Completed' : isOverdue ? 'Overdue' : `${plan.resources?.length || 0} days remaining`}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{plan.title}</h3>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p>{plan.startDate ? new Date(plan.startDate).toLocaleDateString() : '4/26/2025'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">End Date</p>
                        <p>{plan.endDate ? new Date(plan.endDate).toLocaleDateString() : '5/2/2025'}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <button
                        onClick={() => navigate(`/plans/${plan.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                      >
                        View Plan
                      </button>
                      <button
                        className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50 text-center"
                      >
                        Share Completion
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Header Component
const Header = () => {
  return (
    <div>
      <div className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-xl font-bold">SkillNexus</h1>
        <p className="text-sm">Connect. Learn. Grow.</p>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-white py-4 text-center text-sm text-gray-600 mt-8">
      © 2025 SkillNexus. All rights reserved.
    </footer>
  );
};

export default PlansListPage;