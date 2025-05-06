import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    getLearningPlanById,
    deleteLearningPlan,
    LearningPlan,
} from "../../api/learning-plan-api";

const ViewPlanPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [plan, setPlan] = useState<LearningPlan | null>(null);

    useEffect(() => {
        if (id) {
            getLearningPlanById(id)
                .then(setPlan)
                .catch((err) => console.error("Failed to load plan", err));
        }
    }, [id]);

    const handleDelete = async () => {
        if (id && window.confirm("Are you sure you want to delete this plan?")) {
            try {
                await deleteLearningPlan(id);
                alert("Plan deleted successfully.");
                navigate("/plans");
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    if (!plan) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-4 shadow rounded bg-white">
            <h2 className="text-2xl font-bold mb-4">View Learning Plan</h2>
            <p><strong>Title:</strong> {plan.title}</p>
            <p><strong>Description:</strong> {plan.description}</p>
            <p><strong>Start Date:</strong> {plan.startDate}</p>
            <p><strong>End Date:</strong> {plan.endDate}</p>
            <div className="flex gap-4 mt-4">
                <Link
                    to={`/plans/${plan.id}/edit`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ViewPlanPage;
