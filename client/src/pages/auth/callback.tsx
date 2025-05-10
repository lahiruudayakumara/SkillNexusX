import { useEffect, useState } from "react";

import { AppDispatch } from "@/stores/store";
import { socialLogin } from "@/stores/slices/auth/auth-actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OAuth2Callback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      token: params.get("token"),
      code: params.get("code"),
      state: params.get("state"),
    };
  };

  useEffect(() => {
    const { token, code, state } = getQueryParams();
    console.log("OAuth2Callback - token:", token, "code:", code, "state:", state);

    if (token) {
      dispatch(socialLogin(token))
        .unwrap()
        .then(() => {
          setLoading(false);
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("OAuth2 callback failed:", err);
          setError(err.message || "Authentication failed");
          setLoading(false);
        });
    } else if (code) {
      fetch(`http://localhost:8082/api/auth/oauth2/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Authentication failed");
          return response.json();
        })
        .then((data) => {
          if (!data.token) throw new Error("No access token received");
          dispatch(socialLogin(data.token))
            .unwrap()
            .then(() => {
              setLoading(false);
              navigate("/", { replace: true });
            });
        })
        .catch((err) => {
          console.error("OAuth2 callback failed:", err);
          setError(err.message || "Authentication failed");
          setLoading(false);
        });
    } else {
      setError("Missing token or code in URL");
      setLoading(false);
    }
  }, [navigate, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="flex flex-col justify-center mx-auto w-full h-screen my-auto">
        <p className="text-center text-2xl font-semibold">{error}</p>
        <p className="text-center text font-semibold">Please Try Again Later</p>
        <button className="bg-primary text-white cursor-pointer max-w-40 mx-auto p-2 mt-4 rounded" onClick={() => navigate("/login")}>Back to Login</button>
      </div>
    );

  return <div>Authentication successful, redirecting...</div>;
};

export default OAuth2Callback;
