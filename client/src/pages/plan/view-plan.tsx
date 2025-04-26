import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LearningPlan } from '../../types/learning-type';
import { Check, ArrowLeft, Calendar } from 'lucide-react';

// Extended type to track completed resources
interface ExtendedPlan extends LearningPlan {
    completedResources?: string[];
}

export default function ViewPlanPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [plan, setPlan] = useState<ExtendedPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlan, setEditedPlan] = useState<ExtendedPlan | null>(null);

    useEffect(() => {
        async function fetchPlan() {
            if (!id) return;

            try {
                // Fetch plan from localStorage
                const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
                const foundPlan = existingPlans.find((p: LearningPlan) => p.id === id);

                if (foundPlan) {
                    // If completedResources isn't in the plan, initialize it
                    if (!foundPlan.completedResources) {
                        foundPlan.completedResources = [];
                    }
                    setPlan(foundPlan);
                    setEditedPlan(foundPlan);
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

    const handleSave = () => {
        if (!editedPlan || !id) return;

        try {
            // Update in localStorage
            const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
            const updatedPlan = {
                ...editedPlan,
                updatedAt: new Date().toISOString()
            };

            const updatedPlans = existingPlans.map((p: LearningPlan) =>
                p.id === id ? updatedPlan : p
            );

            localStorage.setItem('learning-plans', JSON.stringify(updatedPlans));
            setPlan(updatedPlan);
            setIsEditing(false);

            // Show success message
            setSuccessMessage('Plan updated successfully');
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err) {
            console.error('Failed to save plan:', err);
            setError('Failed to update learning plan. Please try again.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editedPlan) return;

        const { name, value } = e.target;
        setEditedPlan({
            ...editedPlan,
            [name]: value
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editedPlan) return;

        const { name, checked } = e.target;
        setEditedPlan({
            ...editedPlan,
            [name]: checked
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, dateField: 'startDate' | 'endDate') => {
        if (!editedPlan) return;

        setEditedPlan({
            ...editedPlan,
            [dateField]: e.target.value
        });
    };

    // Toggle resource completion status
    const toggleResourceCompletion = (resourceUrl: string) => {
        if (!plan) return;

        const isCompleted = plan.completedResources?.includes(resourceUrl);
        let updatedCompletedResources: string[];

        if (isCompleted) {
            // Remove from completed resources
            updatedCompletedResources = (plan.completedResources || []).filter(url => url !== resourceUrl);
        } else {
            // Add to completed resources
            updatedCompletedResources = [...(plan.completedResources || []), resourceUrl];
        }

        // Update the plan locally
        const updatedPlan = {
            ...plan,
            completedResources: updatedCompletedResources,
            updatedAt: new Date().toISOString()
        };

        setPlan(updatedPlan);

        // Update in localStorage
        const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');
        const updatedPlans = existingPlans.map((p: LearningPlan) =>
            p.id === id ? updatedPlan : p
        );

        localStorage.setItem('learning-plans', JSON.stringify(updatedPlans));

        // Show success message
        setSuccessMessage('Progress updated');
        setTimeout(() => setSuccessMessage(null), 2000);
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

    // Calculate progress based on completed resources
    const calculateProgress = () => {
        if (!plan || !plan.resources || plan.resources.length === 0) return 0;

        const totalResources = plan.resources.length;
        const completedCount = plan.completedResources?.length || 0;

        return Math.round((completedCount / totalResources) * 100);
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

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
                    {successMessage}
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/plans')}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeft size={18} className="mr-1" />
                        Back to Plans
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-blue-700">
                        Track your learning journey by marking resources as completed. Your progress is automatically calculated based on completed items.
                    </p>
                </div>

                {isEditing ? (
                    // Edit Form
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Learning Title</label>
                            <input
                                type="text"
                                name="title"
                                value={editedPlan?.title || ''}
                                onChange={handleInputChange}
                                placeholder="Enter the title of your learning"
                                className="w-full border rounded-md p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Visibility</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="shared"
                                    checked={editedPlan?.shared || false}
                                    onChange={handleCheckboxChange}
                                    className="mr-2"
                                    title="Shared with community"
                                />
                                <span>Share with community</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Learning Details</label>
                            <textarea
                                name="description"
                                value={editedPlan?.description || ''}
                                onChange={handleInputChange}
                                placeholder="Describe what you're learning and your goals"
                                className="w-full border rounded-md p-2 h-32"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={editedPlan?.startDate || ''}
                                    onChange={(e) => handleDateChange(e, 'startDate')}
                                    className="w-full border rounded-md p-2"
                                    title="Shared with community"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={editedPlan?.endDate || ''}
                                    onChange={(e) => handleDateChange(e, 'endDate')}
                                    className="w-full border rounded-md p-2"
                                    title="Shared with community"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    // View Mode
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">{plan.title}</h2>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Visibility</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={plan.shared || false}
                                    readOnly
                                    disabled
                                    className="mr-2"
                                    title="Shared with community"
                                />
                                <span>{plan.shared ? "Shared with community" : "Private"}</span>
                            </div>
                        </div>

                        {plan.description && (
                            <div>
                                <label className="block text-gray-700 mb-2">Learning Details</label>
                                <div className="bg-gray-50 p-3 rounded border">
                                    {plan.description}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Start Date</label>
                                <div className="flex items-center">
                                    <Calendar size={18} className="mr-2 text-gray-500" />
                                    <span>{formatDateString(plan.startDate)}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">End Date</label>
                                <div className="flex items-center">
                                    <Calendar size={18} className="mr-2 text-gray-500" />
                                    <span>{formatDateString(plan.endDate)}</span>
                                </div>
                            </div>
                        </div>

                        {Array.isArray(plan.topics) && plan.topics.length > 0 && (
                            <div>
                                <label className="block text-gray-700 mb-2">Topics</label>
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
                            <div>
                                <label className="block text-gray-700 mb-2">
                                    Learning Resources ({plan.completedResources?.length || 0}/{plan.resources.length})
                                </label>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                    <div
                                        className={`h-2.5 rounded-full ${calculateProgress() === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                        style={{ width: `${calculateProgress()}%` }}
                                    ></div>
                                </div>
                                <ul className="space-y-2">
                                    {plan.resources.map((resource, index) => {
                                        const isCompleted = plan.completedResources?.includes(resource);

                                        return (
                                            <li
                                                key={index}
                                                className={`flex items-center p-2 rounded ${isCompleted ? 'bg-green-50' : 'bg-gray-50'}`}
                                            >
                                                <button
                                                    onClick={() => toggleResourceCompletion(resource)}
                                                    className={`mr-3 w-5 h-5 flex items-center justify-center rounded border ${isCompleted
                                                        ? 'bg-green-500 border-green-600 text-white'
                                                        : 'border-gray-400 hover:bg-gray-200'
                                                        }`}
                                                    aria-label={isCompleted ? "Mark as incomplete" : "Mark as completed"}
                                                >
                                                    {isCompleted && <Check size={14} />}
                                                </button>

                                                <a
                                                    href={resource}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex-grow text-blue-600 hover:underline ${isCompleted ? 'line-through opacity-70' : ''}`}
                                                >
                                                    {resource}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        <div className="text-sm text-gray-500">
                            <div>Created: {formatDateString(plan.createdAt)}</div>
                            <div>Last updated: {formatDateString(plan.updatedAt)}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}