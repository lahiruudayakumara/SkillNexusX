import { AppDispatch, RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Logger from "@/utils/logger";
import { LoginRequest } from "@/types/auth-types";
import Logo from "@assets/logo.png";
import ReusableLink from "@/components/link/reusable-link";
import SocialMediaButton from "@/components/buttons/social-media-button";
import TextField from "@/components/input-fields/text-inputs/text-input";
import { login } from "@/stores/slices/auth/auth-actions";
import { useNavigate } from "react-router-dom";

const LoginView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState<LoginRequest>({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  const handleSignIn = async () => {
    try {
      await dispatch(login(credentials)).unwrap();
    } catch (err: any) {
      Logger.error(err.message);
      // toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `http://localhost:8082/oauth2/authorization/${provider}`;
  };

  return (
    <div className="flex h-screen bg-gray-100 flex-col items-center justify-center">
      <form className="mt-1 w-96 bg-white p-6 rounded shadow-md">
        <img src={Logo} alt="Logo" className="w-44 h-auto ml-auto mr-auto" />
        <h1 className="text-2xl font-bold text-center"> Welcome Back!</h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Please login to your account
        </p>
        <div className="mb-4">
          <TextField
            value={credentials.emailOrUsername}
            onChange={handleChange}
            type="text"
            name="emailOrUsername"
            label="Email"
            required
          />
        </div>
        <div className="mb-4">
          <TextField
            value={credentials.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            name="password"
            label="Password"
            required
          />
        </div>
        <button
          type="button"
          onClick={handleSignIn}
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary cursor-pointer"
        >
          Login
        </button>
        <ReusableLink
          to="/forgot-password"
          text="Forgot Password?"
          className="text-center"
          color="blue"
          ariaLabel="Forgot your password? Click here to reset it"
        />
        <ReusableLink
          to="/register"
          text="Create an Account"
          className="w-full"
          color="blue"
          isExternal={true}
          ariaLabel="Create an account with us"
        />
        <hr className="my-4 border-slate-300" />
        <div className="flex flex-col gap-3 w-80 mx-auto">
          <SocialMediaButton
            variant="signin"
            provider="google"
            onClick={() => handleSocialLogin("google")}
          />
          <SocialMediaButton
            variant="signin"
            provider="facebook"
            onClick={() => handleSocialLogin("facebook")}
          />
          <SocialMediaButton
            variant="signin"
            provider="github"
            onClick={() => handleSocialLogin("fitHub")}
          />
          <SocialMediaButton
            variant="signin"
            provider="linkedin"
            onClick={() => handleSocialLogin("linkedIn")}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginView;
