import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useState } from "react";

const ProfilePage = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <>
      <Helmet>
        <title>Profile : SkillNexus</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="space-y-4">
          {/* Toggle Menu for My Learning Plans */}
          <div className="border rounded shadow">
            <button
              onClick={() => toggleSection("plans")}
              className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold"
            >
              My Learning Plans
            </button>
            {openSection === "plans" && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  View and manage your learning plans.
                </p>
                <Link
                  to="/plans"
                  className="text-blue-600 hover:underline"
                >
                  Go to My Learning Plans
                </Link>
              </div>
            )}
          </div>

          {/* Toggle Menu for My Posts */}
          <div className="border rounded shadow">
            <button
              onClick={() => toggleSection("posts")}
              className="w-full text-left px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-bold"
            >
              My Posts
            </button>
            {openSection === "posts" && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  View and manage your shared posts.
                </p>
                <Link
                  to="/posts"
                  className="text-green-600 hover:underline"
                >
                  Go to My Posts
                </Link>
              </div>
            )}
          </div>

          {/* Toggle Menu for Account Settings */}
          <div className="border rounded shadow">
            <button
              onClick={() => toggleSection("settings")}
              className="w-full text-left px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-bold"
            >
              Account Settings
            </button>
            {openSection === "settings" && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  Update your account information.
                </p>
                <Link
                  to="/account/settings"
                  className="text-yellow-600 hover:underline"
                >
                  Go to Account Settings
                </Link>
              </div>
            )}
          </div>

          {/* Toggle Menu for Completion Updates */}
          <div className="border rounded shadow">
            <button
              onClick={() => toggleSection("completions")}
              className="w-full text-left px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold"
            >
              Completion Updates
            </button>
            {openSection === "completions" && (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  View your progress completion updates.
                </p>
                <Link
                  to="/progress/completions"
                  className="text-purple-600 hover:underline"
                >
                  Go to Completion Updates
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;