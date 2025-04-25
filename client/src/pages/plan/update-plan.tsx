import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlanForm } from '../../sections/main/plan/plan-form';
import { LearningPlan } from '../../types/learning-type';

export default function UpdatePlanPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [plan, setPlan] = useState<LearningPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPlan() {
            if (!id) return;

            try {
                // Fetch plan from localStorage
                const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
                const foundPlan = existingPlans.find((p: LearningPlan) => p.id === id);

                if (foundPlan) {
                    setPlan(foundPlan);
                } else {
                    setError('Learning plan not found');
                }
            } catch (err) {
                console.error('Failed to fetch plan:', err);
                setError('Failed to load the learning plan. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchPlan();
        // Simulate network latency
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [id]);

    const handleSubmit = async (planData: Partial<LearningPlan>) => {
        if (!plan || !id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Ensure required fields
            if (!planData.endDate) {
                throw new Error('End date is required');
            }

            // Update plan in localStorage
            const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
            const updatedPlans = existingPlans.map((p: LearningPlan) =>
                p.id === id
                    ? {
                        ...p,
                        ...planData,
                        updatedAt: new Date().toISOString()
                    }
                    : p
            );

            localStorage.setItem('learning-plans', JSON.stringify(updatedPlans));

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            navigate(`/plans/${id}`); // Redirect to view plan
        } catch (err) {
            console.error('Failed to update plan:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to update learning plan. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center">Loading plan...</p>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-red-600">Plan not found or you don't have permission to edit it</p>
                <div className="text-center mt-4">
                    <button
                        onClick={() => navigate('/plans')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Plans
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Update Learning Plan</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <PlanForm
                initialData={plan}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                buttonText="Update Plan"
            />
        </div>
    );
}