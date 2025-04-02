import { Facebook, Github, Linkedin, LogIn, Mail, Twitter } from "lucide-react";

import React from "react";

interface SocialMediaButtonProps {
  provider: "google" | "facebook" | "github" | "twitter" | "linkedin" | "email";
  variant?: "signin" | "signup";
  onClick: () => void;
  className?: string;
}

const providerConfig = {
  google: { name: "Google", color: "bg-red-500", icon: <LogIn size={18} /> },
  facebook: { name: "Facebook", color: "bg-blue-600", icon: <Facebook size={18} /> },
  github: { name: "GitHub", color: "bg-gray-900", icon: <Github size={18} /> },
  twitter: { name: "Twitter", color: "bg-blue-400", icon: <Twitter size={18} /> },
  linkedin: { name: "LinkedIn", color: "bg-blue-700", icon: <Linkedin size={18} /> },
  email: { name: "Email", color: "bg-gray-600", icon: <Mail size={18} /> },
};

const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({ provider, variant = "signin", onClick, className = "" }) => {
  const { name, color, icon } = providerConfig[provider];

  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer justify-center gap-2 w-full py-2 px-4 text-white font-medium rounded-md shadow-md hover:opacity-90 transition-all ${color} ${className}`}
    >
      {icon}
      <span>{variant === "signup" ? `Sign up with ${name}` : `Sign in with ${name}`}</span>
    </button>
  );
};

export default SocialMediaButton;
