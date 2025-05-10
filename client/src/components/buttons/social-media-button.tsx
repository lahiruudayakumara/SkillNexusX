// import { Facebook, Github, Linkedin, LogIn, Mail, Twitter } from "lucide-react";
import Google from '@assets/icons/google-icon-logo-svgrepo-com.svg'
import Facebbok from '@assets/icons/facebook-color-svgrepo-com.svg'
import Github from '@assets/icons/github-142-svgrepo-com.svg'
import X from '@assets/icons/x-social-media-logo-icon.svg'
import Linkein from '@assets/icons/linkedin-linked-in-svgrepo-com.svg'

import React from "react";

interface SocialMediaButtonProps {
  provider: "google" | "facebook" | "github" | "twitter" | "linkedin" | "email";
  variant?: "signin" | "signup";
  onClick: () => void;
  className?: string;
}

const providerConfig = {
  google: { name: "Google", color: "bg-red-500", icon: Google  },
  facebook: { name: "Facebook", color: "bg-blue-600", icon: Facebbok },
  github: { name: "GitHub", color: "bg-gray-900", icon: Github },
  twitter: { name: "X", color: "bg-blue-400", icon: X },
  linkedin: { name: "LinkedIn", color: "bg-blue-700", icon: Linkein },
  email: { name: "Email", color: "bg-gray-600", icon: Facebbok },
};

const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({ provider, variant = "signin", onClick, className = "" }) => {
  const { name, color, icon } = providerConfig[provider];

  return (
    <button
      onClick={onClick}
      className={`flex items-center border border-slate-200 cursor-pointer justify-center gap-2 w-full py-2 px-4 text-white font-medium rounded-md shadow hover:shadow-md hover:opacity-90 transition-all}`}
    >
      <img src={icon} className='w-4 h-4' />
      <span className='text-primary'>{variant === "signup" ? `Sign up with ${name}` : `Sign in with ${name}`}</span>
    </button>
  );
};

export default SocialMediaButton;
