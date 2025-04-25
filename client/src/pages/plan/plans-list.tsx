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
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Learning Plans</h1>
        <Link
          to="/plans/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Plan
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} status={getPlanStatus(plan)} />
        ))}
      </div>
    </div>
  );
}