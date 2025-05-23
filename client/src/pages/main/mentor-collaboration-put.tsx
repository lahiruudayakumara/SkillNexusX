import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Define types
interface Mentor {
  id: number;
  name: string;
  expertise: string[];
}

interface CollaborationFormData {
  mentorId: number;
  userId: number;
  scheduledTime: string;
  durationInMinutes: number;
  topic: string;
}

interface FormErrors {
  mentorId?: string;
  scheduledTime?: string;
  durationInMinutes?: string;
  topic?: string;
}

interface CollaborationResponse {
  id: number;
  mentorId: number;
  userId: number;
  scheduledTime: string;
  durationInMinutes: number;
  topic: string;
  status: string;
}

// Simple icon components using unicode or HTML entities
const Icons = {
  User: () => <span className="text-lg">👤</span>,
  Calendar: () => <span className="text-lg">📅</span>,
  Lightbulb: () => <span className="text-lg">💡</span>,
  Clock: () => <span className="text-lg">⏱️</span>
};

const MentorCollaborationUpdate: React.FC = () => {
  const navigate = useNavigate();
  const { collaborationId } = useParams<{ collaborationId: string }>();

  // Current user ID would typically come from authentication context
  const currentUserId = 201; // This would be dynamic in a real app

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>(
    `http://localhost:8082/api/mentor-collaboration/${collaborationId}`
  );
  const [selectedMentorDetails, setSelectedMentorDetails] = useState<Mentor | null>(null);

  const [formData, setFormData] = useState<CollaborationFormData>({
    mentorId: 0,
    userId: currentUserId,
    scheduledTime: "",
    durationInMinutes: 60,
    topic: "",
  });

  const [originalData, setOriginalData] = useState<CollaborationResponse | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Fetch original collaboration data
  useEffect(() => {
    const fetchCollaborationData = async () => {
      setFetchingData(true);
      try {
        const response = await fetch(`http://localhost:8082/api/mentor-collaboration/collaboration/${collaborationId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch collaboration data: ${response.status}`);
        }

        const data: CollaborationResponse = await response.json();
        setOriginalData(data);
        
        // Populate form with existing data
        setFormData({
          mentorId: data.mentorId,
          userId: data.userId,
          scheduledTime: new Date(data.scheduledTime).toISOString().slice(0, 16), // Format for datetime-local input
          durationInMinutes: data.durationInMinutes,
          topic: data.topic
        });
      } catch (err) {
        console.error("Error fetching collaboration data:", err);
        setError(err instanceof Error ? err.message : "Failed to load collaboration data");
      } finally {
        setFetchingData(false);
      }
    };

    if (collaborationId) {
      fetchCollaborationData();
    }
  }, [collaborationId]);

  // Fetch mentors data
  useEffect(() => {
    // Simulating mentor data - replace with actual API call
    const mockMentors: Mentor[] = [
      {
        id: 101,
        name: "Jane Smith",
        expertise: ["Java", "Python", "Data Structures"],
      },
      {
        id: 102,
        name: "John Doe",
        expertise: ["JavaScript", "React", "Node.js"],
      },
      {
        id: 103,
        name: "Alice Johnson",
        expertise: ["Machine Learning", "Python", "Statistics"],
      },
    ];

    setMentors(mockMentors);
  }, []);

  // When mentor is selected, update the selected mentor details
  useEffect(() => {
    if (formData.mentorId) {
      const selectedMentor = mentors.find(mentor => mentor.id === formData.mentorId) || null;
      setSelectedMentorDetails(selectedMentor);
    } else {
      setSelectedMentorDetails(null);
    }
  }, [formData.mentorId, mentors]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Check if mentor is selected
    if (!formData.mentorId) {
      newErrors.mentorId = "Please select a mentor";
    }

    // Check if scheduledTime is provided and in the future
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = "Please select a date and time";
    } else {
      const selectedTime = new Date(formData.scheduledTime);
      const now = new Date();

      if (selectedTime <= now) {
        newErrors.scheduledTime = "Selected time must be in the future";
      }
    }

    // Check duration constraints
    if (!formData.durationInMinutes) {
      newErrors.durationInMinutes = "Please select a duration";
    } else if (
      formData.durationInMinutes < 30 ||
      formData.durationInMinutes > 180
    ) {
      newErrors.durationInMinutes =
        "Duration must be between 30 and 180 minutes";
    }

    // Check if topic is provided
    if (!formData.topic.trim()) {
      newErrors.topic = "Please enter a topic for the session";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "mentorId" || name === "durationInMinutes"
          ? Number(value)
          : value,
    }));
  };

  // Corrected handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a properly formatted data object for the API
      const apiData = {
        mentorId: formData.mentorId,
        userId: formData.userId,
        scheduledTime: formData.scheduledTime,
        durationInMinutes: formData.durationInMinutes,
        topic: formData.topic
      };

      // Make the API request with PUT method for update
      const response = await fetch(`http://localhost:8082/api/mentor-collaboration/${collaborationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        let errorMessage = "Failed to update collaboration session";

        // Try to get more specific error from response body
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }

          // Check for field-specific validation errors
          if (errorData.errors && typeof errorData.errors === "object") {
            const fieldErrors: FormErrors = {};
            Object.entries(errorData.errors).forEach(([field, message]) => {
              if (field in formData) {
                fieldErrors[field as keyof FormErrors] = message as string;
              }
            });

            if (Object.keys(fieldErrors).length > 0) {
              setErrors((prev) => ({ ...prev, ...fieldErrors }));
            }
          }
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
        }

        throw new Error(errorMessage);
      }

      // Parse successful response
      const data = await response.json();
      
      // Handle successful response
      setSuccess(true);

      // Redirect to a collaboration details after a short delay
      setTimeout(() => {
        navigate('/mentor-collaboration-get');
      }, 2000);
    } catch (err) {
      console.error("Error during update:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date-time for the scheduler (current time + 1 hour)
  const getMinDateTime = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16); // Format: "YYYY-MM-DDThh:mm"
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.mentorId) {
      setErrors({ mentorId: "Please select a mentor to continue" });
      return;
    }
    
    if (currentStep === 2 && !formData.scheduledTime) {
      setErrors({ scheduledTime: "Please select a date and time to continue" });
      return;
    }
    
    if (currentStep === 3 && !formData.topic.trim()) {
      setErrors({ topic: "Please enter a topic to continue" });
      return;
    }
    
    setCurrentStep(currentStep + 1);
    setErrors({});
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  // Format date for display
  const formatDateTime = (dateTimeStr: string): string => {
    if (!dateTimeStr) return "";
    
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Check if the form has been modified
  const hasFormChanged = (): boolean => {
    if (!originalData) return false;
    
    return (
      formData.mentorId !== originalData.mentorId ||
      formData.scheduledTime !== new Date(originalData.scheduledTime).toISOString().slice(0, 16) ||
      formData.durationInMinutes !== originalData.durationInMinutes ||
      formData.topic !== originalData.topic
    );
  };

  if (fetchingData) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <span className="ml-3 text-lg text-gray-700">Loading collaboration data...</span>
        </div>
      </div>
    );
  }

  if (!originalData) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <div className="flex items-center">
            <span className="text-red-500 mr-3">⚠️</span>
            <p>Collaboration session not found or you don't have permission to edit it.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/mentor-collaboration-get")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Back to Collaborations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Update Mentoring Session</h1>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-lg
                  ${currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'}`}
              >
                {step === 1 && <Icons.User />}
                {step === 2 && <Icons.Calendar />}
                {step === 3 && <Icons.Lightbulb />}
                {step === 4 && <Icons.Clock />}
              </div>
              <div className={`text-sm mt-2 ${currentStep >= step ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {step === 1 && "Mentor"}
                {step === 2 && "Schedule"}
                {step === 3 && "Topic"}
                {step === 4 && "Confirm"}
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-1">
          <div className="h-1 bg-gray-200 rounded-full">
            <div 
              className="h-1 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Success and error messages */}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md mb-6 animate-pulse">
          <div className="flex">
            <span className="text-green-500 mr-3">✓</span>
            <p>Session updated successfully! Redirecting to details...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-red-500 mr-3">⚠️</span>
              <p>{error}</p>
            </div>
            <button
              className="text-red-500 hover:text-red-700 focus:outline-none"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Mentor Selection */}
        {currentStep === 1 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Mentor Selection</h2>
            <p className="text-gray-600 mb-6">
              Current mentor: {selectedMentorDetails?.name || "Loading..."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mentors.map((mentor) => (
                <div 
                  key={mentor.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
                    ${formData.mentorId === mentor.id 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, mentorId: mentor.id }))}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                      {mentor.name.charAt(0)}
                    </div>
                    <h3 className="ml-3 font-medium">{mentor.name}</h3>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {errors.mentorId && (
              <p className="text-red-500 text-sm mt-2">{errors.mentorId}</p>
            )}
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/mentor-collaboration-get')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Schedule Selection */}
        {currentStep === 2 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Date & Time</h2>
            <p className="text-gray-600 mb-6">
              Current scheduled time: {originalData ? formatDateTime(originalData.scheduledTime) : "Loading..."}
            </p>
            
            {selectedMentorDetails && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  {selectedMentorDetails.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{selectedMentorDetails.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedMentorDetails.expertise.join(", ")}
                  </p>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="scheduledTime" className="block text-gray-700 font-medium mb-2">
                Select New Date & Time
              </label>
              <input
                type="datetime-local"
                id="scheduledTime"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                min={getMinDateTime()}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.scheduledTime && (
                <p className="text-red-500 text-sm mt-2">{errors.scheduledTime}</p>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Topic */}
        {currentStep === 3 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Discussion Topic</h2>
            <p className="text-gray-600 mb-6">
              Current topic: {originalData?.topic ? 
                <span className="font-medium italic">"{originalData.topic}"</span> : "No topic specified"}
            </p>
            
            <div className="mb-6">
              <label htmlFor="topic" className="block text-gray-700 font-medium mb-2">
                Updated Session Topic
              </label>
              <textarea
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., I need help with React hooks and state management. Specifically, I'm struggling with useContext and Redux integration..."
                className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.topic && (
                <p className="text-red-500 text-sm mt-2">{errors.topic}</p>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Duration & Confirmation */}
        {currentStep === 4 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Duration & Confirm Changes</h2>
            <p className="text-gray-600 mb-6">
              Current duration: {originalData ? 
                (originalData.durationInMinutes === 60 ? "1 hour" : 
                originalData.durationInMinutes === 90 ? "1.5 hours" :
                originalData.durationInMinutes === 120 ? "2 hours" :
                originalData.durationInMinutes === 180 ? "3 hours" :
                `${originalData.durationInMinutes} minutes`) : "Loading..."}
            </p>
            
            <div className="mb-6">
              <label htmlFor="durationInMinutes" className="block text-gray-700 font-medium mb-2">
                Session Duration
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[30, 45, 60, 90, 120, 180].map(duration => (
                  <div 
                    key={duration}
                    onClick={() => setFormData(prev => ({ ...prev, durationInMinutes: duration }))}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-colors
                      ${formData.durationInMinutes === duration 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'hover:bg-gray-50 border-gray-300'}`}
                  >
                    <span className="inline-block mr-2">⏱️</span>
                    {duration === 60 && "1 hour"}
                    {duration === 90 && "1.5 hours"}
                    {duration === 120 && "2 hours"}
                    {duration === 180 && "3 hours"}
                    {(duration < 60) && `${duration} minutes`}
                  </div>
                ))}
              </div>
              {errors.durationInMinutes && (
                <p className="text-red-500 text-sm mt-2">{errors.durationInMinutes}</p>
              )}
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Updated Session Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mentor:</span>
                  <span className="font-medium">
                    {selectedMentorDetails?.name || "Not selected"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {formData.scheduledTime ? formatDateTime(formData.scheduledTime) : "Not selected"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {formData.durationInMinutes === 60 && "1 hour"}
                    {formData.durationInMinutes === 90 && "1.5 hours"}
                    {formData.durationInMinutes === 120 && "2 hours"}
                    {formData.durationInMinutes === 180 && "3 hours"}
                    {(formData.durationInMinutes < 60) && `${formData.durationInMinutes} minutes`}
                  </span>
                </div>
                
                <div className="pt-2">
                  <span className="text-gray-600 block mb-1">Topic:</span>
                  <div className="bg-white p-3 border border-gray-200 rounded-md">
                    {formData.topic || "Not specified"}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                className={`${
                  hasFormChanged() 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white font-bold py-2 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors`}
                disabled={loading || !hasFormChanged()}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Updating...
                  </>
                ) : hasFormChanged() ? (
                  "Save Changes"
                ) : (
                  "No Changes Made"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MentorCollaborationUpdate;