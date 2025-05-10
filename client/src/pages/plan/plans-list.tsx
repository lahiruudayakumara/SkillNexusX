import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLearningPlans } from "@/api/learning-plan-api";
import { LearningPlan } from "@../../stores/slices/learning-plan/learning-slice";

const PlansListPage = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("All Plans");
  const [searchQuery, setSearchQuery] = useState<string>("");
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
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="max-w-6xl mx-auto p-6">
        <p>Loading...</p>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="max-w-6xl mx-auto p-6">
        <p>Error: {error}</p>
      </div>
      <Footer />
    </div>
  );

  // Filter plans based on active tab and search query
  const filteredPlans = plans.filter(plan => {
    // First apply search filter
    const matchesSearch =
      searchQuery === "" ||
      plan.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Then apply tab filters
    const progress = getProgress(plan);
    if (activeTab === "All Plans") return true;
    if (activeTab === "In Progress") return progress > 0 && progress < 100;
    if (activeTab === "Completed") return progress === 100;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Learning Plans Management</h2>
          <div className="flex space-x-4">
            <button
              className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50"
              onClick={() => navigate('/progress/view')}
            >
              My Progress
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => navigate('/plans/create')}
            >
              Create New Plan
            </button>
          </div>
        </div>

        {/* Search Bar 
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search plans by title or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>*

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            {["All Plans", "In Progress", "Completed"].map((tab) => (
              <button
                key={tab}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {filteredPlans.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            {searchQuery ? "No plans found matching your search." : "No plans found."}
          </p>
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
                         onClick={() => navigate(`/progress/create`, { state: { plan } })}
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
const Header = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white py-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">SkillNexus</h1>
            <p className="text-sm">Connect. Learn. Grow.</p>
          </div>

          <div className="w-full md:w-96">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search plans by title or description..."
                className="block w-full pl-10 pr-3 py-2 border border-blue-400 bg-blue-500 rounded-md shadow-sm placeholder-blue-200 focus:outline-none focus:ring-white focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-white py-4 text-center text-sm text-gray-600 mt-8">
      
    </footer>
  );
};

export default PlansListPage;