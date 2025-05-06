import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLearningPlans } from "@/api/learning-plan-api";
import { LearningPlan } from "@../../stores/slices/learning-plan/learning-slice";

const PlansListPage = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
          {plans.map((plan) => (
            <li key={plan.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{plan.title}</h3>
              <p>{plan.description}</p>
              {plan.startDate && <p>Start: {new Date(plan.startDate).toLocaleDateString()}</p>}
              {plan.endDate && <p>End: {new Date(plan.endDate).toLocaleDateString()}</p>}
              {plan.shared && <p className="text-green-600">Shared</p>}
              <button
                onClick={() => navigate(`/plans/${plan.id}`)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Plan
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlansListPage;
