import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LearningPlan } from '../../types/learning-type';
import PlanCard from '../../sections/main/plan/plan-card';

interface ExtendedPlan extends LearningPlan {
  completedResources?: string[];
}

export default function PlansListPage() {
  const [plans, setPlans] = useState<ExtendedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'inProgress' | 'completed' | 'notStarted'>('all');

  useEffect(() => {
    async function fetchPlans() {
      try {
        const storedPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
        const plansWithCompletedResources = storedPlans.map((plan: LearningPlan) => ({
          ...plan,
          completedResources: (plan as ExtendedPlan).completedResources || [],
        }));
        const sortedPlans = plansWithCompletedResources.sort((a: ExtendedPlan, b: ExtendedPlan) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPlans(sortedPlans);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
        setError('Failed to load learning plans. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlans();
  }, []);

  const getPlanStatus = (plan: ExtendedPlan): 'inProgress' | 'completed' | 'notStarted' => {
    if (!plan.resources || plan.resources.length === 0) return 'notStarted';
    if (!plan.completedResources || plan.completedResources.length === 0) return 'notStarted';
    if (plan.completedResources.length === plan.resources.length) return 'completed';
    return 'inProgress';
  };

  const filteredPlans = plans.filter((plan) => {
    if (filter === 'all') return true;
    return getPlanStatus(plan) === filter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-white">SkillNexus</h1>
            <p className="text-blue-100">Connect. Learn. Grow.</p>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading your learning plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">SkillNexus</h1>
          <p className="text-blue-100">Connect. Learn. Grow.</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Learning Plans Management</h2>
            <Link
              to="/plans/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create New Plan
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setFilter('all')}
                className={`pb-4 px-1 ${
                  filter === 'all'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Plans
              </button>
              <button
                onClick={() => setFilter('inProgress')}
                className={`pb-4 px-1 ${
                  filter === 'inProgress'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`pb-4 px-1 ${
                  filter === 'completed'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('notStarted')}
                className={`pb-4 px-1 ${
                  filter === 'notStarted'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Not Started
              </button>
            </nav>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No learning plans found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all'
                  ? "You haven't created any learning plans yet."
                  : filter === 'inProgress'
                  ? "You don't have any in-progress plans."
                  : filter === 'completed'
                  ? "You haven't completed any plans yet."
                  : "You don't have any plans ready to start."}
              </p>
              <div className="mt-6">
                <Link
                  to="/plans/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create your first plan
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} status={getPlanStatus(plan)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © 2025 SkillNexus. All rights reserved.
        </div>
      </footer>
    </div>
  );
}