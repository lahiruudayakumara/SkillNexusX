import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LearningPlan } from '../../types/learning-type';
import { PlanCard } from '../../sections/main/plan/plan-card';

export default function PlansListPage() {
    const [plans, setPlans] = useState<LearningPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'inProgress' | 'completed' | 'notStarted'>('all');

    useEffect(() => {
        async function fetchPlans() {
            try {
                // Fetch plans from localStorage
                const storedPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
                
                // Sort plans by creation date (newest first)
                const sortedPlans = storedPlans.sort((a: LearningPlan, b: LearningPlan) => {
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
        // Simulate network latency
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Function to determine the status of a plan
    const getPlanStatus = (plan: LearningPlan): 'inProgress' | 'completed' | 'notStarted' => {
        const now = new Date();
        const start = plan.startDate ? new Date(plan.startDate) : new Date(plan.createdAt);
        const end = new Date(plan.endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'notStarted';
        if (now < start) return 'notStarted';
        if (now > end) return 'completed';
        return 'inProgress';
    };

    // Filter plans based on current filter
    const filteredPlans = plans.filter(plan => {
        if (filter === 'all') return true;
        return getPlanStatus(plan) === filter;
    });

    // Count plans by status
    const counts = {
        all: plans.length,
        inProgress: plans.filter(plan => getPlanStatus(plan) === 'inProgress').length,
        completed: plans.filter(plan => getPlanStatus(plan) === 'completed').length,
        notStarted: plans.filter(plan => getPlanStatus(plan) === 'notStarted').length
    };

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

            <div className="mb-6">
                <div className="flex space-x-2 border-b">
                    <button
                        onClick={() => setFilter('all')}
                        className={`py-2 px-4 ${filter === 'all' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All ({counts.all})
                    </button>
                    <button
                        onClick={() => setFilter('inProgress')}
                        className={`py-2 px-4 ${filter === 'inProgress' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        In Progress ({counts.inProgress})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`py-2 px-4 ${filter === 'completed' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Completed ({counts.completed})
                    </button>
                    <button
                        onClick={() => setFilter('notStarted')}
                        className={`py-2 px-4 ${filter === 'notStarted' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Not Started ({counts.notStarted})
                    </button>
                </div>
            </div>

            {filteredPlans.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                        {filter === 'all' 
                            ? "You don't have any learning plans yet." 
                            : `You don't have any ${filter === 'inProgress' ? 'in-progress' : filter} plans.`}
                    </p>
                    {filter !== 'all' && (
                        <button
                            onClick={() => setFilter('all')}
                            className="text-blue-600 hover:underline"
                        >
                            View all plans
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </div>
            )}

            {filteredPlans.length > 0 && filter === 'all' && (
                <div className="mt-8 text-center text-gray-500">
                    {plans.length === 1 
                        ? 'Showing 1 learning plan' 
                        : `Showing ${plans.length} learning plans`}
                </div>
            )}
        </div>
    );
}