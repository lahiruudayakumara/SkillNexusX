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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [completedResources, setCompletedResources] = useState<string[]>(() => {
        const saved = localStorage.getItem(`completed-${id}`);
        return saved ? JSON.parse(saved) : [];
    });

    const toggleResource = (resource: string) => {
        const updated = completedResources.includes(resource)
            ? completedResources.filter(r => r !== resource)
            : [...completedResources, resource];

        setCompletedResources(updated);
        localStorage.setItem(`completed-${id}`, JSON.stringify(updated));
    };

    useEffect(() => {
        if (id) {
            getLearningPlanById(id)
                .then((data) => {
                    setPlan(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load plan", err);
                    setError("Failed to load learning plan.");
                    setLoading(false);
                });
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
                setError("Failed to delete the plan.");
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error || !plan) return <p className="text-red-500">{error || "Plan not found."}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{plan.title}</h2>

            <p className="mb-2">
                <strong>Description:</strong> {plan.description}
            </p>
            <p className="mb-2">
                <strong>Start Date:</strong> {new Date(plan.startDate || "").toLocaleDateString()}
            </p>
            <p className="mb-4">
                <strong>End Date:</strong> {new Date(plan.endDate || "").toLocaleDateString()}
            </p>

            <div className="mb-4">
                <strong>Topics:</strong>
                {plan.topics && plan.topics.length > 0 ? (
                    <ul className="list-disc ml-5 mt-1">
                        {plan.topics.map((topic, index) => (
                            <li key={index}>{topic}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No topics listed.</p>
                )}
            </div>

            <div className="mb-4">
                <strong>Resources:</strong>
                {plan.resources && plan.resources.length > 0 ? (
                    <ul className="list-disc ml-5 mt-1 space-y-1">
                        {plan.resources.map((resource, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={completedResources.includes(resource)}
                                    onChange={() => toggleResource(resource)}
                                    title={`Mark resource as ${completedResources.includes(resource) ? "incomplete" : "complete"}`}
                                />
                                <a
                                    href={resource}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`hover:underline ${completedResources.includes(resource) ? "line-through text-gray-500" : "text-blue-600"}`}
                                >
                                    {resource}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No resources added.</p>
                )}
            </div>

            <p className="mb-6">
                <strong>Shared with community:</strong>{" "}
                {plan.shared ? "Yes" : "No"}
            </p>

            <div className="flex gap-4">
                <Link
                    to={`/plans/${plan.id}/edit`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ViewPlanPage;
