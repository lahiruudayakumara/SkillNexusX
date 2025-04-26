// ReusableLink.tsx

import { Link } from "react-router-dom"; // Import Link from react-router-dom
import React from "react";

interface LinkProps {
  to: string; // React Router uses `to` instead of `href`
  text: string;
  className?: string;
  isExternal?: boolean;
  ariaLabel?: string;
  color?: "blue" | "green" | "red";
}

const ReusableLink: React.FC<LinkProps> = React.memo(
  ({ to, text, className = "", isExternal = false, ariaLabel, color = "blue" }) => {
    // Dynamic color based on `color` prop
    const linkColor = color === "blue" ? "text-secondary" : color === "green" ? "text-green-600" : "text-red-600";

    if (isExternal) {
      return (
        <div className={`mt-4 text-center ${className}`}>
          <a
            href={to}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkColor} text-sm hover:underline`}
            aria-label={ariaLabel || text}
          >
            {text}
          </a>
        </div>
      );
    }

    // Internal links use `Link` from react-router-dom
    return (
      <div className={`mt-4 text-center ${className}`}>
        <Link
          to={to}
          className={`${linkColor} text-sm hover:underline`}
          aria-label={ariaLabel || text}
        >
          {text}
        </Link>
      </div>
    );
  }
);

export default ReusableLink;
