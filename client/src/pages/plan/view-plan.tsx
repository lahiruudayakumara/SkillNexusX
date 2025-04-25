import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LearningPlan } from '../../types/learning-type';

export default function ViewPlanPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [plan, setPlan] = useState<LearningPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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

    const handleDelete = async () => {
        if (!plan || !id) return;

        if (window.confirm('Are you sure you want to delete this learning plan? This action cannot be undone.')) {
            try {
                // Remove plan from localStorage
                const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
                const updatedPlans = existingPlans.filter((p: LearningPlan) => p.id !== id);

                localStorage.setItem('learning-plans', JSON.stringify(updatedPlans));

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 300));

                navigate('/plans'); // Redirect to plans list
            } catch (err) {
                console.error('Failed to delete plan:', err);
                setError('Failed to delete learning plan. Please try again.');
            }
        }
    };

    // Format date string for display
    const formatDateString = (dateString?: string) => {
        if (!dateString) return 'Not set';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Calculate progress based on dates
    const calculateProgress = () => {
        if (!plan) return 0;

        const now = new Date();
        const start = plan.startDate ? new Date(plan.startDate) : new Date(plan.createdAt);
        const end = new Date(plan.endDate);

        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

        // If plan hasn't started yet
        if (now < start) return 0;

        // If plan has ended
        if (now > end) return 100;

        // Calculate progress percentage
        const totalDuration = end.getTime() - start.getTime();
        if (totalDuration <= 0) return 0;

        const elapsed = now.getTime() - start.getTime();
        return Math.round((elapsed / totalDuration) * 100);
    };

    // Get plan status
    const getStatusText = () => {
        if (!plan) return '';

        const now = new Date();
        const start = plan.startDate ? new Date(plan.startDate) : new Date(plan.createdAt);
        const end = new Date(plan.endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Invalid dates';
        if (now < start) return 'Not started';
        if (now > end) return 'Completed';
        return 'In progress';
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
                <p className="text-center text-red-600">Plan not found</p>
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

    const progress = calculateProgress();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">{plan.title}</h1>
                <div className="space-x-2">
                    <Link
                        to={`/plans/${id}/edit`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Progress</h2>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{getStatusText()}</span>
                        <span>{progress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Schedule</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-gray-600 text-sm">Start Date:</span>
                            <p>{formatDateString(plan.startDate)}</p>
                        </div>
                        <div>
                            <span className="text-gray-600 text-sm">End Date:</span>
                            <p>{formatDateString(plan.endDate)}</p>
                        </div>
                    </div>
                </div>

                {plan.description && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Description</h2>
                        <p className="text-gray-700">{plan.description}</p>
                    </div>
                )}

                {Array.isArray(plan.topics) && plan.topics.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Topics</h2>
                        <div className="flex flex-wrap gap-2">
                            {plan.topics.map((topic, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {Array.isArray(plan.resources) && plan.resources.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Resources</h2>
                        <ul className="space-y-2">
                            {plan.resources.map((resource, index) => (
                                <li key={index} className="bg-gray-50 p-2 rounded">
                                    <a
                                        href={resource}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {resource}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-4 text-sm text-gray-500">
                    <div>Created: {formatDateString(plan.createdAt)}</div>
                    <div>Last updated: {formatDateString(plan.updatedAt)}</div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={() => navigate('/plans')}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Back to Plans
                </button>
                {plan.shared && (
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded">
                        This plan is shared with the community
                    </span>
                )}
            </div>
        </div>
    );
}