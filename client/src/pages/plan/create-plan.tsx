import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanForm } from '../../sections/main/plan/plan-form';
import { LearningPlan } from '../../types/learning-type';
import { v4 as uuidv4 } from 'uuid';

export default function CreatePlanPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (planData: Partial<LearningPlan>) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Ensure required fields are present
            if (!planData.title) {
                throw new Error('Title is required');
            }

            if (!planData.endDate) {
                throw new Error('End date is required');
            }

            // Create a new plan with generated ID and timestamps
            const newPlan: LearningPlan = {
                id: uuidv4(),
                userId: 'current-user-id', // Mock user ID
                startDate: planData.startDate,
                endDate: planData.endDate,
                topics: planData.topics || [],
                resources: planData.resources || [],
                shared: planData.shared || false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                title: ''
            };

            // Mock API call: store the plan in localStorage
            const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
            localStorage.setItem('learning-plans', JSON.stringify([...existingPlans, newPlan]));

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            navigate('/progress'); // Redirect to plans list
        } catch (err) {
            console.error('Failed to create plan:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to create learning plan. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Create Learning Plan</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <PlanForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                buttonText="Create Plan"
            />
        </div>
    );
}