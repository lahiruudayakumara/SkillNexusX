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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-4 shadow rounded bg-white">
            <h2 className="text-2xl font-bold mb-4">Update Learning Plan</h2>

            <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Title"
            />

            <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Description"
            />

            <input
                type="date"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Start Date"
            />

            <input
                type="date"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                placeholder="End Date"
            />

            <div className="mb-4">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="shared"
                        checked={formData.shared || false}
                        onChange={handleChange}
                    />
                    Shared
                </label>
            </div>

            {/* Topics */}
            <div className="mb-4">
                <label className="font-semibold">Topics</label>
                {(formData.topics || []).map((topic, idx) => (
                    <div key={idx} className="flex gap-2 my-1">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => handleArrayChange(idx, e.target.value, "topics")}
                            className="flex-1 p-2 border rounded"
                            placeholder="Enter topic"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem("topics", idx)}
                            className="text-red-500"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem("topics")}
                    className="mt-2 text-blue-600"
                >
                    + Add Topic
                </button>
            </div>

            {/* Resources */}
            <div className="mb-4">
                <label className="font-semibold">Resources</label>
                {(formData.resources || []).map((res, idx) => (
                    <div key={idx} className="flex gap-2 my-1">
                        <input
                            type="text"
                            value={res}
                            onChange={(e) => handleArrayChange(idx, e.target.value, "resources")}
                            className="flex-1 p-2 border rounded"
                            placeholder="Enter resource"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem("resources", idx)}
                            className="text-red-500"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem("resources")}
                    className="mt-2 text-blue-600"
                >
                    + Add Resource
                </button>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Save
                </button>
                <button
                    onClick={() => navigate(`/plans/${id}`)}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default UpdatePlanPage;
