import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getLearningPlanById,
    updateLearningPlan,
    LearningPlan,
} from "../../api/learning-plan-api";

const UpdatePlanPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Partial<LearningPlan>>({
        topics: [],
        resources: [],
    });
    const [loading, setLoading] = useState(true);
    const [dateError, setDateError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            getLearningPlanById(id)
                .then((data) => setFormData(data))
                .catch((err) => console.error("Failed to load plan", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        // Validate end date when it changes
        if (name === "endDate") {
            const startDate = new Date(formData.startDate || "");
            const endDate = new Date(value);

            if (endDate <= startDate) {
                setDateError("End date must be after start date");
            } else {
                setDateError(null);
            }
        }

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleArrayChange = (
        index: number,
        value: string,
        field: "topics" | "resources"
    ) => {
        const updated = [...(formData[field] || [])];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const addArrayItem = (field: "topics" | "resources") => {
        const updated = [...(formData[field] || []), ""];
        setFormData({ ...formData, [field]: updated });
    };

    const removeArrayItem = (field: "topics" | "resources", index: number) => {
        const updated = [...(formData[field] || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, [field]: updated });
    };

    const handleUpdate = async () => {
        if (id) {
            // Check if end date is valid before submitting
            if (dateError) {
                alert("Please fix the date error before updating.");
                return;
            }

            try {
                await updateLearningPlan(id, formData);
                alert("Plan updated successfully.");
                navigate(`/plans/${id}`);
            } catch (error) {
                console.error("Update failed:", error);
            }
        }
    };

    // Calculate minimum end date (day after start date)
    const getMinEndDate = () => {
        if (!formData.startDate) return "";

        const startDate = new Date(formData.startDate);
        startDate.setDate(startDate.getDate() + 1); // Add one day
        return startDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-gray-600">Loading...</p>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4">
                <div className="container mx-auto flex items-center px-4">
                    <div className="flex-1">
                        <h1 className="text-xl font-bold">SkillNexus</h1>
                        <p className="text-sm text-blue-200">Connect. Learn. Grow.</p>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate('/plans')}
                            className="mr-2 text-gray-500"
                        >
                            ←
                        </button>
                        <h2 className="text-lg font-medium">Update Learning Plan</h2>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <p className="text-sm text-blue-800">
                            Create a structured learning path using community resources. Set clear milestones, track your progress, and share your journey with others looking to develop the same skills
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Learning Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter a title for your learning plan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Learning Details</label>
                            <textarea
                                name="description"
                                value={formData.description || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Describe what you'll be learning"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate || ""}
                                    disabled={true}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Start date cannot be changed</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate || ""}
                                    onChange={handleChange}
                                    min={getMinEndDate()}
                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${dateError ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {dateError && (
                                    <p className="text-xs text-red-500 mt-1">{dateError}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="shared"
                                    checked={formData.shared || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    title="Share with community"
                                    placeholder="Share with community"
                                />
                                <span className="ml-2 text-sm text-gray-700">Share with community</span>
                            </div>
                        </div>

                        {/* Resources */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resources</label>
                            <div className="space-y-2">
                                {(formData.resources || []).map((res, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Post</span>
                                        <input
                                            type="text"
                                            value={res}
                                            onChange={(e) => handleArrayChange(idx, e.target.value, "resources")}
                                            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter resource"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem("resources", idx)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem("resources")}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    + Add Resource
                                </button>
                            </div>
                        </div>

                        {/* Topics */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(formData.topics || []).map((topic, idx) => (
                                    <div key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                                        {topic}
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem("topics", idx)}
                                            className="ml-1 text-blue-800 hover:text-blue-900"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Add a topic and press Enter"
                                    className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addArrayItem("topics");
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem("topics")}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-r"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
                            >
                                update Plan
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UpdatePlanPage;