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

    const [formData, setFormData] = useState<Partial<LearningPlan>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getLearningPlanById(id)
                .then((data) => setFormData(data))
                .catch((err) => console.error("Failed to load plan", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                type="text"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
                placeholder="Start Date"
            />
            <input
                type="text"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                placeholder="End Date"
            />
            <div className="flex gap-4">
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
