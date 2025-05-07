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
            try {
                await updateLearningPlan(id, formData);
                alert("Plan updated successfully.");
                navigate(`/plans/${id}`);
            } catch (error) {
                console.error("Update failed:", error);
            }
        }
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Update Learning Plan</h2>
                    <button
                        onClick={() => navigate('/plans')}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Back to Plans
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description || ""}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Description"
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
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="shared"
                                    checked={formData.shared || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Share this plan with others</span>
                            </label>
                        </div>

                        {/* Topics */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
                            <div className="space-y-2">
                                {(formData.topics || []).map((topic, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => handleArrayChange(idx, e.target.value, "topics")}
                                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter topic"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem("topics", idx)}
                                            className="p-2 text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem("topics")}
                                    className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Topic
                                </button>
                            </div>
                        </div>

                        {/* Resources */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resources</label>
                            <div className="space-y-2">
                                {(formData.resources || []).map((res, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={res}
                                            onChange={(e) => handleArrayChange(idx, e.target.value, "resources")}
                                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter resource"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem("resources", idx)}
                                            className="p-2 text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem("resources")}
                                    className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Resource
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                            >
                                Save Plan
                            </button>
                            <button
                                onClick={() => navigate(`/plans/${id}`)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-200 py-4">
                <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                    © 2025 SkillNexus. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default UpdatePlanPage;