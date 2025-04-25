import { Helmet } from "react-helmet";
import { use, useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    mentorRequests: true,
    sessionReminders: true,
    systemUpdates: false,
    marketing: false
  });

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Full-stack developer with 5 years of experience in React and Node.js.",
    timezone: "America/New_York",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    profileVisibility: "public"
  });
  const [privacy, setPrivacy] = useState({
    shareActivity: true,
    showSkills: true,
    allowMessaging: true,
    showCompletedSessions: true
  });
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [subscriptionPlan, setSubscriptionPlan] = useState("basic");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications({
      ...notifications,
      [name]: checked
    });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrivacy({
      ...privacy,
      [name]: checked
    });
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
      e.preventDefault();
      if (!profile.skills.includes((e.target as HTMLInputElement).value.trim())) {
        setProfile({
          ...profile,
          skills: [...profile.skills, (e.target as HTMLInputElement).value.trim()]
        });
      }
      (e.target as HTMLInputElement).value = "";
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const saveSettings = (settingType: string) => {
    // In a real app, this would send data to an API
    setMessage({ 
      text: `${settingType} settings saved successfully!`, 
      type: "success" 
    });
    
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 3000);
  };

  const deleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, this would send a request to delete the user's account
      setMessage({ 
        text: "Account deletion request submitted. You will receive an email confirmation.", 
        type: "info" 
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path); // Navigate to the specified path
  };


  return (
    <>
      <Helmet>
        <title>Settings : SkillNexus</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-700 text-white py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">SkillNexus</h1>
            <p className="text-blue-100">Connect. Learn. Grow.</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Sidebar */}
              <div className="bg-gray-50 md:w-64 p-6">
                <h2 className="text-xl font-semibold mb-6">Settings</h2>
                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className={`block w-full text-left px-4 py-2 rounded ${activeTab === "profile" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
                  >
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => setActiveTab("account")}
                    className={`block w-full text-left px-4 py-2 rounded ${activeTab === "account" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
                  >
                    Account Preferences
                  </button>
                  <button 
                    onClick={() => setActiveTab("notifications")}
                    className={`block w-full text-left px-4 py-2 rounded ${activeTab === "notifications" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
                  >
                    Notification Settings
                  </button>
                  <button 
                    onClick={() => setActiveTab("privacy")}
                    className={`block w-full text-left px-4 py-2 rounded ${activeTab === "privacy" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
                  >
                    Privacy & Security
                  </button>
                  <button 
                    onClick={() => setActiveTab("billing")}
                    className={`block w-full text-left px-4 py-2 rounded ${activeTab === "billing" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"}`}
                  >
                    Billing & Subscription
                  </button>
                      {/* New Tabs */}
                      <button
                    onClick={() => handleNavigation("/plans")}
                    className="block w-full text-left px-4 py-2 rounded text-gray-700 hover:bg-gray-200"
                  >
                    My Learning Plans
                  </button>
                  <button
                    onClick={() => handleNavigation("/progress/view")}
                    className="block w-full text-left px-4 py-2 rounded text-gray-700 hover:bg-gray-200"
                  >
                    My Learning Progress
                  </button>
                </nav>
              </div>

              {/* Main Settings Area */}
              <div className="p-6 flex-1">
                {message.text && (
                  <div className={`mb-6 p-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {message.text}
                  </div>
                )}

                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          <img src="client/src/assets/user.png" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                            Upload New Photo
                          </button>
                          <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. Max size 1MB.</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 mb-2">Full Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Email Address</label>
                          <input 
                            type="email" 
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Phone Number</label>
                          <input 
                            type="tel" 
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Time Zone</label>
                          <select 
                            name="timezone"
                            value={profile.timezone}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          >
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">London (GMT)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Bio</label>
                        <textarea
                          name="bio"
                          value={profile.bio}
                          onChange={handleProfileChange}
                          rows={4}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profile.skills.map(skill => (
                            <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center">
                              {skill}
                              <button 
                                onClick={() => handleSkillRemove(skill)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                        <input 
                          type="text" 
                          placeholder="Type a skill and press Enter"
                          onKeyDown={handleSkillAdd}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Profile Visibility</label>
                        <select 
                          name="profileVisibility"
                          value={profile.profileVisibility}
                          onChange={handleProfileChange}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                          <option value="public">Public - Visible to everyone</option>
                          <option value="connections">Connections Only - Visible to your connections</option>
                          <option value="private">Private - Only visible to you</option>
                        </select>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={() => saveSettings('Profile')}
                          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Preferences */}
                {activeTab === "account" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Account Preferences</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Theme</h3>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="theme" 
                              value="light"
                              checked={theme === "light"}
                              onChange={() => setTheme("light")}
                              className="mr-2"
                            />
                            Light
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="theme" 
                              value="dark"
                              checked={theme === "dark"}
                              onChange={() => setTheme("dark")}
                              className="mr-2"
                            />
                            Dark
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="theme" 
                              value="system"
                              checked={theme === "system"}
                              onChange={() => setTheme("system")}
                              className="mr-2"
                            />
                            System Default
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Language</h3>
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full md:w-64 border border-gray-300 rounded px-3 py-2"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Password</h3>
                        <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300">
                          Change Password
                        </button>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Connected Accounts</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-bold">G</span>
                              </div>
                              <div>
                                <p className="font-medium">Google</p>
                                <p className="text-sm text-gray-500">Connected</p>
                              </div>
                            </div>
                            <button className="text-red-600 hover:text-red-800">Disconnect</button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-gray-600 font-bold">G</span>
                              </div>
                              <div>
                                <p className="font-medium">GitHub</p>
                                <p className="text-sm text-gray-500">Not connected</p>
                              </div>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800">Connect</button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={() => saveSettings('Account')}
                          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Notification Channels</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="email" 
                              checked={notifications.email}
                              onChange={handleNotificationChange}
                              className="mr-2"
                            />
                            Email Notifications
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="push" 
                              checked={notifications.push}
                              onChange={handleNotificationChange}
                              className="mr-2"
                            />
                            Push Notifications
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Notification Types</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="mentorRequests" 
                              checked={notifications.mentorRequests}
                              onChange={handleNotificationChange}
                              className="mr-2"
                            />
                            Mentor Requests
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="sessionReminders" 
                              checked={notifications.sessionReminders}
                              onChange={handleNotificationChange}
                              className="mr-2"
                            />
                            Session Reminders
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="systemUpdates" 
                              checked={notifications.systemUpdates}
                              onChange={handleNotificationChange}
                              className="mr-2"
                            />
                            System Updates
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="marketing" 
                              checked={notifications.marketing}
                              onChange={handleNotificationChange}
                              className="mr-2"
                            />
                            Marketing Communications
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={() => saveSettings('Notification')}
                          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy & Security */}
                {activeTab === "privacy" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Privacy & Security</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="shareActivity" 
                              checked={privacy.shareActivity}
                              onChange={handlePrivacyChange}
                              className="mr-2"
                            />
                            Share my activity with other users
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="showSkills" 
                              checked={privacy.showSkills}
                              onChange={handlePrivacyChange}
                              className="mr-2"
                            />
                            Show my skills and expertise on my public profile
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="allowMessaging" 
                              checked={privacy.allowMessaging}
                              onChange={handlePrivacyChange}
                              className="mr-2"
                            />
                            Allow users to message me
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              name="showCompletedSessions" 
                              checked={privacy.showCompletedSessions}
                              onChange={handlePrivacyChange}
                              className="mr-2"
                            />
                            Show completed sessions on my profile
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Security</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            <div className="flex items-center mt-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              <span className="text-gray-700">Not Enabled</span>
                            </div>
                            <button className="mt-2 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700">
                              Enable 2FA
                            </button>
                          </div>
                          <div>
                            <h4 className="font-medium">Session Management</h4>
                            <button className="mt-2 text-blue-600 hover:text-blue-800">
                              View Active Sessions
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Data & Privacy</h3>
                        <div className="space-y-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            Download Your Data
                          </button>
                          <div>
                            <button 
                              onClick={deleteAccount}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete Account
                            </button>
                            <p className="text-sm text-gray-500 mt-1">
                              This action permanently removes all your data.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={() => saveSettings('Privacy')}
                          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing & Subscription */}
                {activeTab === "billing" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Billing & Subscription</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                        <div className="bg-gray-50 border border-gray-200 rounded p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {subscriptionPlan === "basic" ? "Basic Plan" : 
                                 subscriptionPlan === "pro" ? "Professional Plan" : "Enterprise Plan"}
                              </h4>
                              <p className="text-gray-600">
                                {subscriptionPlan === "basic" ? "$9.99/month" : 
                                 subscriptionPlan === "pro" ? "$29.99/month" : "Custom pricing"}
                              </p>
                            </div>
                            <div>
                              <button className="text-blue-600 hover:text-blue-800">
                                Upgrade Plan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={() => setPaymentMethod("card")}
                                className="mr-2"
                              />
                              Credit Card
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="paypal"
                                checked={paymentMethod === "paypal"}
                                onChange={() => setPaymentMethod("paypal")}
                                className="mr-2"
                              />
                              PayPal
                            </label>
                          </div>

                          {paymentMethod === "card" && (
                            <div className="border border-gray-200 rounded p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-blue-600 font-bold">V</span>
                                  </div>
                                  <div>
                                    <p className="font-medium">Visa ending in 4242</p>
                                    <p className="text-sm text-gray-500">Expires 05/2026</p>
                                  </div>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800">Change</button>
                              </div>
                            </div>
                          )}

                          {paymentMethod === "paypal" && (
                            <div className="border border-gray-200 rounded p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-blue-600 font-bold">P</span>
                                  </div>
                                  <div>
                                    <p className="font-medium">Connected PayPal Account</p>
                                    <p className="text-sm text-gray-500">alex.johnson@example.com</p>
                                  </div>
                                </div>
                                <button className="text-blue-600 hover:text-blue-800">Change</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Billing History</h3>
                        <div className="border border-gray-200 rounded overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 15, 2025</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Monthly Subscription - Basic Plan</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$9.99</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 15, 2025</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Monthly Subscription - Basic Plan</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$9.99</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Cancellation</h3>
                        <button className="text-red-600 hover:text-red-800">
                          Cancel Subscription
                        </button>
                        <p className="text-sm text-gray-500 mt-1">
                          Your subscription will remain active until the end of your billing cycle.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 SkillNexus. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SettingsPage;