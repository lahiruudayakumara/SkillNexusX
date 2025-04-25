import { Helmet } from "react-helmet";
import { useState } from "react";

// Define proper types for your form data and collaborations
interface FormData {
  mentorId: string;
  sessionDate: string;
  duration: number;
  resources: File | null;
}

interface Collaboration {
  id: string;
  mentorId: string;
  mentorName: string;
  sessionDate: string;
  duration: number;
  resources: string[];
  createdBy: string;
}

const MentorCollaborationPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [formData, setFormData] = useState<FormData>({
    mentorId: "",
    sessionDate: "",
    duration: 60,
    resources: null,
  });
  const [selectedCollabId, setSelectedCollabId] = useState<string | null>(null);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([
    {
      id: "collab-1",
      mentorId: "mentor-123",
      mentorName: "Jane Smith",
      sessionDate: "2025-05-15T14:00",
      duration: 60,
      resources: ["Introduction.pdf"],
      createdBy: "current-user"
    },
    {
      id: "collab-2",
      mentorId: "mentor-456",
      mentorName: "John Doe",
      sessionDate: "2025-05-20T10:00",
      duration: 90,
      resources: [],
      createdBy: "mentor-456"
    }
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      
      setFormData({
        ...formData,
        [name]: files?.[0] || null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    // Reset messages
    setError("");
    setSuccess("");

    // Validate mentor ID
    if (!formData.mentorId) {
      setError("Please select a valid mentor.");
      return false;
    }

    // Validate session date is in the future
    const sessionDate = new Date(formData.sessionDate);
    const now = new Date();
    if (sessionDate <= now) {
      setError("Session date must be in the future.");
      return false;
    }

    // Validate duration (30 min - 3 hours)
    if (formData.duration < 30 || formData.duration > 180) {
      setError("Duration must be between 30 minutes and 3 hours.");
      return false;
    }

    return true;
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send this to an API
      const newCollaboration = {
        id: `collab-${Date.now()}`,
        mentorId: formData.mentorId,
        mentorName: formData.mentorId === "mentor-123" ? "Jane Smith" : "John Doe",
        sessionDate: formData.sessionDate,
        duration: parseInt(formData.duration.toString()),
        resources: formData.resources ? [formData.resources.name] : [],
        createdBy: "current-user"
      };

      setCollaborations([...collaborations, newCollaboration]);
      setSuccess("Mentor collaboration created successfully!");
      
      // Reset form
      setFormData({
        mentorId: "",
        sessionDate: "",
        duration: 60,
        resources: null
      });
    }
  };

  const handleUpdate = (id: string) => {
    if (!id) {
      setError("Please select a collaboration to update.");
      return;
    }
    
    if (validateForm()) {
      const updatedCollaborations = collaborations.map(collab => {
        if (collab.id === id) {
          return {
            ...collab,
            mentorId: formData.mentorId || collab.mentorId,
            sessionDate: formData.sessionDate || collab.sessionDate,
            duration: parseInt(formData.duration.toString()) || collab.duration,
            resources: formData.resources 
              ? [...collab.resources, formData.resources.name]
              : collab.resources
          };
        }
        return collab;
      });
      
      setCollaborations(updatedCollaborations);
      setSuccess("Collaboration updated successfully!");
      setSelectedCollabId(null);
      
      // Reset form
      setFormData({
        mentorId: "",
        sessionDate: "",
        duration: 60,
        resources: null
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this collaboration?")) {
      const collab = collaborations.find(c => c.id === id);
      
      // Check if collaboration exists
      if (!collab) {
        setError("Collaboration not found.");
        return;
      }
      
      // Check if user is authorized to delete
      if (collab.createdBy !== "current-user") {
        setError("Only the user who initiated the collaboration can cancel it.");
        return;
      }
      
      const filteredCollaborations = collaborations.filter(
        collaboration => collaboration.id !== id
      );
      
      setCollaborations(filteredCollaborations);
      setSuccess("Collaboration canceled successfully!");
    }
  };

  return (
    <>
      <Helmet>
        <title>SkillNexus - Mentor Collaboration</title>
      </Helmet>
      
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-blue-700 text-white py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">SkillNexus</h1>
            <p className="text-blue-100">Connect. Learn. Grow.</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Mentor Collaboration Management</h2>
            
            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
              <button 
                className={`px-4 py-2 font-medium ${activeTab === "create" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("create")}
              >
                Create
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === "read" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("read")}
              >
                View
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === "update" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("update")}
              >
                Update
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === "delete" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("delete")}
              >
                Delete
              </button>
            </div>
            
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            
            {/* Create Tab */}
            {activeTab === "create" && (
              <div>
                <p className="mb-4 text-gray-600">
                  Send a mentor request or create a mentor collaboration session.
                  Session date must be in the future, and duration must be between 30 minutes and 3 hours.
                </p>
                
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Select Mentor</label>
                    <select 
                      name="mentorId"
                      value={formData.mentorId}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    >
                      <option value="">Select a mentor</option>
                      <option value="mentor-123">Jane Smith - Web Development</option>
                      <option value="mentor-456">John Doe - Data Science</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Session Date & Time</label>
                    <input 
                      type="datetime-local"
                      name="sessionDate"
                      value={formData.sessionDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Duration (minutes)</label>
                    <input 
                      type="number"
                      name="duration"
                      min="30"
                      max="180"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                  >
                    Create Collaboration
                  </button>
                </form>
              </div>
            )}
            
            {/* Read Tab */}
            {activeTab === "read" && (
              <div>
                <p className="mb-4 text-gray-600">
                  View mentor collaborations you are part of.
                  Collaboration visibility is restricted to users involved in the session.
                </p>
                
                {collaborations.length > 0 ? (
                  <div className="space-y-4">
                    {collaborations.map(collab => (
                      <div key={collab.id} className="border rounded p-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-lg">{collab.mentorName}</h3>
                          <span className="text-gray-500">
                            {new Date(collab.sessionDate).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600">Duration: {collab.duration} minutes</p>
                        <div className="mt-2">
                          <p className="font-medium">Resources:</p>
                          {collab.resources.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {collab.resources.map((resource, index) => (
                                <li key={index} className="text-blue-600">{resource}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No resources available</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No collaborations found.</p>
                )}
              </div>
            )}
            
            {/* Update Tab */}
            {activeTab === "update" && (
              <div>
                <p className="mb-4 text-gray-600">
                  Update details such as meeting schedule and shared resources.
                  Schedule cannot be in the past, and only mentors/admins can upload resources.
                </p>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Select a collaboration to update:</h3>
                  <div className="space-y-2">
                    {collaborations.map(collab => (
                      <div 
                        key={collab.id} 
                        className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setFormData({
                            mentorId: collab.mentorId,
                            sessionDate: collab.sessionDate,
                            duration: collab.duration,
                            resources: null
                          });
                          setSelectedCollabId(collab.id);
                        }}
                      >
                        <p className="font-medium">{collab.mentorName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(collab.sessionDate).toLocaleString()} ({collab.duration} mins)
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Update Session Date & Time</label>
                    <input 
                      type="datetime-local"
                      name="sessionDate"
                      value={formData.sessionDate}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Update Duration (minutes)</label>
                    <input 
                      type="number"
                      name="duration"
                      min="30"
                      max="180"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Upload Resources</label>
                    <input 
                      type="file"
                      name="resources"
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Only mentors and admins can upload resources
                    </p>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => handleUpdate(selectedCollabId!)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                  >
                    Update Collaboration
                  </button>
                </form>
              </div>
            )}
            
            {/* Delete Tab */}
            {activeTab === "delete" && (
              <div>
                <p className="mb-4 text-gray-600">
                  Cancel mentorship collaborations. Confirmation is required before cancellation.
                  Only the user who initiated the collaboration can cancel it.
                </p>
                
                <div className="space-y-4">
                  {collaborations.map(collab => (
                    <div 
                      key={collab.id} 
                      className="border rounded p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium">{collab.mentorName}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(collab.sessionDate).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(collab.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
        
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 SkillNexus. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MentorCollaborationPage;