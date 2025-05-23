import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft } from "lucide-react";
import { createLearningPlan } from "@/api/learning-plan-api"; // Assuming API utility is in this path

const CreatePlanView = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [resources, setResources] = useState<Array<{ path: string, title?: string, type?: string }>>([]);
    const [pendingPost, setPendingPost] = useState<{ post?: { username: string; content?: string }; resourceUrl?: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
                    setResources([{
                        path: postData.resourceUrl,
                        title: postData.post?.title || "Shared Post",
                        type: 'post'
                    }]);
                }

                // Clear the pending post data
                sessionStorage.removeItem('pending-post-for-plan');
            }

            // Check for any post added via the addPostToExistingPlan function
            const pendingPostToAdd = sessionStorage.getItem('pendingPostToAdd');
            if (pendingPostToAdd) {
                const postToAdd = JSON.parse(pendingPostToAdd);
                setResources([{
                    path: `/comments/${postToAdd.id}`,
                    title: postToAdd.title,
                    type: postToAdd.type
                }]);

                // Clear the pending post data
                sessionStorage.removeItem('pendingPostToAdd');
            }
        } catch (err) {
            console.error('Failed to load pending post data:', err);
        }
    }, []);

    const handleCreatePlan = async () => {
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
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                topics: tags, // Map tags to topics for consistency with our interface
                resources: resources,
                shared: isPublic,
                completedResources: [], // Initialize empty completedResources array
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Create plan via API instead of localStorage
            const createdPlan = await createLearningPlan({
                ...newPlan,
                resources: newPlan.resources.map(resource => resource.path),
            });

            // Show success message
            setSuccessMessage('Plan created successfully!');

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
        } catch (err) {
            console.error('Failed to create plan:', err);
            setError("Failed to create plan");
            setIsSubmitting(false);
        }
    };

    // Handle adding a new resource manually
    const addResource = () => {
        setResources([...resources, { path: "" }]);
    };

    // Handle updating a resource at a specific index
    const updateResource = (index: number, value: string) => {
        const updatedResources = [...resources];
        updatedResources[index] = {
            ...updatedResources[index],
            path: value,
            title: value // For manually added resources, use the path as the title
        };
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
    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        <div className="w-full bg-gray-100 min-h-screen">
            {/* SkillNexus Header */}
            <div className="w-full bg-blue-600 py-6">
                <div className="container mx-auto">
                    <h1 className="text-white text-2xl font-bold px-6">SkillNexus</h1>
                    <p className="text-white text-sm px-6">Connect. Learn. Grow.</p>
                </div>
            </div>

            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
                    {successMessage}
                </div>
            )}

            <div className="container mx-auto py-8 max-w-5xl">
                {/* All content in a big card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header with back button */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <button
                            onClick={() => navigate('/plans')}
                            className="flex items-center text-gray-600 hover:text-blue-600"
                        >
                            <ArrowLeft size={18} className="mr-1" />
                            <span className="text-xl font-medium">Create Learning Plan</span>
                        </button>
                    </div>

                    <div className="px-6 py-6">
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
                                {error}
                            </div>
                        )}

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                            <p className="text-blue-800">
                                Create a structured learning path using community resources. Set clear milestones, track your progress, and share your journey with others looking to develop the same skills
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Title and Visibility in one row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label htmlFor="title" className="block text-gray-700 mb-2 font-medium">
                                        Learning Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded"
                                        placeholder="Enter the title of your learning"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Visibility
                                    </label>
                                    <div className="flex items-center h-12 mt-1">
                                        <input
                                            id="isPublic"
                                            type="checkbox"
                                            checked={isPublic}
                                            onChange={(e) => setIsPublic(e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isPublic" className="ml-2 text-gray-700">
                                            Share with community
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-gray-700 mb-2 font-medium">
                                    Learning Details
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded h-24"
                                    placeholder="Describe what you've learned, key insights, and how you plan to apply this knowledge"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-gray-700 mb-2 font-medium">
                                        Start Date
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="startDate"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded pr-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-gray-700 mb-2 font-medium">
                                        End Date
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="endDate"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded pr-10"
                                            min={startDate}
                                        />
                                    </div>
                                </div>
                            </div>

                            {pendingPost && pendingPost.post && (
                                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                                    <p className="text-sm text-blue-800 mb-1">
                                        <span className="font-medium">Post from {pendingPost.post.username}</span> will be added to this plan
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        "{pendingPost.post.content?.substring(0, 100)}..."
                                    </p>
                                </div>
                            )}

                            {/* Resources and Topics side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Resources
                                    </label>
                                    {resources.length > 0 ? (
                                        resources.map((resource, index) => (
                                            <div key={index} className="flex items-center mb-2">
                                                <div className="flex-1 p-3 border border-gray-300 rounded">
                                                    {resource.type === 'post' && resource.title ? (
                                                        <div className="flex items-center">
                                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">Post</span>
                                                            <span>{resource.title}</span>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={resource.path}
                                                            onChange={(e) => updateResource(index, e.target.value)}
                                                            className="w-full outline-none"
                                                            placeholder="Resource URL or description"
                                                            readOnly={!!(pendingPost && pendingPost.resourceUrl === resource.path)}
                                                        />
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeResource(index)}
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                    disabled={!!(pendingPost && pendingPost.resourceUrl === resource.path)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic mb-2">No resources added yet.</p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={addResource}
                                        className="mt-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded"
                                    >
                                        + Add Resource
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Topics
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
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
                                            className="flex-1 p-3 border border-gray-300 rounded"
                                            placeholder="Add a topic and press Enter"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="ml-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCreatePlan}
                                    disabled={isSubmitting}
                                    className={`px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Plan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePlanView;
