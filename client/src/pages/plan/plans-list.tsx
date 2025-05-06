import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLearningPlans } from "@/api/learning-plan-api";
import { LearningPlan } from "@../../stores/slices/learning-plan/learning-slice";

const PlansListPage = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getProgress = (plan: LearningPlan) => {
    const total = plan.resources?.length || 0;
    const completed = localStorage.getItem(`completed-${plan.id}`)
      ? JSON.parse(localStorage.getItem(`completed-${plan.id}`) || '[]')
      : [];
    return total > 0 ? Math.round((completed.length / total) * 100) : 0;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllLearningPlans();
        setPlans(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Learning Plans</h2>
      {plans.length === 0 ? (
        <p>No plans found.</p>
      ) : (
        <ul className="space-y-3">
          {plans.map((plan) => {
            const progress = getProgress(plan);
            return (
              <li key={plan.id} className="border p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{plan.title}</h3>
                <p>{plan.description}</p>
                {plan.startDate && <p>Start: {new Date(plan.startDate).toLocaleDateString()}</p>}
                {plan.endDate && <p>End: {new Date(plan.endDate).toLocaleDateString()}</p>}
                {plan.shared && <p className="text-green-600">Shared</p>}

                {/* Progress bar */}
                {plan.resources && plan.resources.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-700 mb-1">Progress: {progress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/plans/${plan.id}`)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Plan
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PlansListPage;
