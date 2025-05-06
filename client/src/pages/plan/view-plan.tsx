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

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto p-6">
                <p>Loading...</p>
            </div>
            <Footer />
        </div>
    );

    if (error || !plan) return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto p-6">
                <p className="text-red-500">{error || "Plan not found."}</p>
            </div>
            <Footer />
        </div>
    );

    // Calculate progress
    const totalResources = plan.resources?.length || 0;
    const completedCount = completedResources.length;
    const progressPercentage = totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto p-6">
                {/* Back button */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/plans')}
                        className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Learning Plans
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Plan Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
                                <p className="text-gray-600">{plan.description}</p>
                            </div>
                            <div className="flex gap-2">
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

                        {/* Progress bar */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Plan metadata */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Start Date</p>
                                <p>{plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">End Date</p>
                                <p>{plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Resources</p>
                                <p>{completedCount}/{totalResources} Completed</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Shared</p>
                                <p>{plan.shared ? "Yes" : "No"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Plan content */}
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3">Topics</h3>
                            {plan.topics && plan.topics.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {plan.topics.map((topic, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No topics listed.</p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">Resources</h3>
                            {plan.resources && plan.resources.length > 0 ? (
                                <div className="space-y-2">
                                    {plan.resources.map((resource, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={completedResources.includes(resource)}
                                                onChange={() => toggleResource(resource)}
                                                className="h-5 w-5 text-blue-600 rounded"
                                                title={`Mark resource as ${completedResources.includes(resource) ? "incomplete" : "complete"}`}
                                            />
                                            <a
                                                href={resource}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`hover:underline flex-1 ${completedResources.includes(resource) ? "line-through text-gray-500" : "text-blue-600"}`}
                                            >
                                                {resource}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No resources added.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Header Component
const Header = () => {
    return (
        <div>
            
            <div className="bg-blue-600 text-white py-4 px-6">
                <h1 className="text-xl font-bold">SkillNexus</h1>
                <p className="text-sm">Connect. Learn. Grow.</p>
            </div>
        </div>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className="bg-white py-4 text-center text-sm text-gray-600 mt-8">
            © 2025 SkillNexus. All rights reserved.
        </footer>
    );
};

export default ViewPlanPage;