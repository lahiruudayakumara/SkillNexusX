import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // You might need to install this package
import { Calendar, Clock, Target, BookOpen, Users, Flag } from "lucide-react";

const CreatePlanView = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [goal, setGoal] = useState("");
    const [difficulty, setDifficulty] = useState("beginner");
    const [isPublic, setIsPublic] = useState(false);
    const [estimatedHours, setEstimatedHours] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [resources, setResources] = useState<string[]>([]);
    const [pendingPost, setPendingPost] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set default start date to today
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today);
    }, []);

    // Check for pending post on component mount
    useEffect(() => {
        try {
            const pendingPostData = sessionStorage.getItem('pending-post-for-plan');
            if (pendingPostData) {
                const postData = JSON.parse(pendingPostData);
                setPendingPost(postData);

                // If there's a resourceUrl, add it to resources automatically
                if (postData.resourceUrl) {
                    setResources([postData.resourceUrl]);
                }

                // Clear the pending post data
                sessionStorage.removeItem('pending-post-for-plan');
            }
        } catch (err) {
            console.error('Failed to load pending post data:', err);
        }
    }, []);

    const handleCreatePlan = () => {
        if (!title.trim()) {
            setError("Plan title is required");
            return;
        }

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            setError("End date cannot be before start date");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const newPlan = {
                id: uuidv4(),
                userId: 'current-user-id', // Mock user ID
                title: title.trim(),
                description: description.trim(),
                startDate: startDate || null,
                endDate: endDate || null,
                topics: tags, // Map tags to topics for consistency with our interface
                resources: resources,
                shared: isPublic,
                completedResources: [], // Initialize empty completedResources array
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Get existing plans or initialize empty array
            const existingPlans = JSON.parse(localStorage.getItem('learning-plans') || '[]');

            // Add new plan
            existingPlans.push(newPlan);

<<<<<<< HEAD
            navigate('/progress'); // Redirect to plans list
=======
            // Save to localStorage
            localStorage.setItem('learning-plans', JSON.stringify(existingPlans));

            // Add a slight delay to simulate saving
            setTimeout(() => {
                // If this was created from a post, return to home with success message
                if (pendingPost) {
                    navigate(`/?success=Post added to "${title}" plan!`);
                } else {
                    // Redirect to plans list page
                    navigate('/plans', { state: { success: 'Plan created successfully!' } });
                }
            }, 500);
>>>>>>> 29c0476 (refactor: enhance CreatePlanView with resource and tag management, and improve HomeView for plan selection)
        } catch (err) {
            console.error('Failed to create plan:', err);
            setError("Failed to create plan");
            setIsSubmitting(false);
        }
    };

    // Handle adding a new resource manually
    const addResource = () => {
        setResources([...resources, ""]);
    };

    // Handle updating a resource at a specific index
    const updateResource = (index: number, value: string) => {
        const updatedResources = [...resources];
        updatedResources[index] = value;
        setResources(updatedResources);
    };

    // Handle removing a resource
    const removeResource = (index: number) => {
        const updatedResources = resources.filter((_, i) => i !== index);
        setResources(updatedResources);
    };

    // Handle adding a tag
    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    // Handle tag input key press (add tag on Enter)
    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    // Handle removing a tag
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create Learning Plan</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Plan Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter plan title"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter plan description"
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <Calendar size={16} className="mr-1" />
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <Calendar size={16} className="mr-1" />
                            End Date *
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            min={startDate}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <Flag size={16} className="mr-1" />
                        Topics
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleTagKeyPress}
                            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add topics (e.g., programming, javascript)"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-r-md"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="isPublic"
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 flex items-center text-sm text-gray-700">
                        <Users size={16} className="mr-1" />
                        Make this plan public
                    </label>
                </div>

                <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <BookOpen size={16} className="mr-1" />
                        Resources
                    </label>

                    {pendingPost && pendingPost.post && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800 mb-1">
                                <span className="font-medium">Post from {pendingPost.post.username}</span> will be added to this plan
                            </p>
                            <p className="text-xs text-blue-600">
                                "{pendingPost.post.content?.substring(0, 100)}..."
                            </p>
                        </div>
                    )}

                    {resources.map((resource, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={resource}
                                onChange={(e) => updateResource(index, e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Resource URL or description"
                                readOnly={pendingPost && pendingPost.resourceUrl === resource}
                            />
                            <button
                                type="button"
                                onClick={() => removeResource(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                                disabled={pendingPost && pendingPost.resourceUrl === resource}
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addResource}
                        className="mt-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                        + Add Resource
                    </button>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreatePlan}
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center 
                            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePlanView;