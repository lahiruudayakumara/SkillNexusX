import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Removed: import { FaCalendarAlt, FaClock, FaLightbulb, FaUser } from "react-icons/fa";

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

// Simple icon components using unicode or HTML entities instead of react-icons
const Icons = {
  User: () => <span className="text-lg">👤</span>,
  Calendar: () => <span className="text-lg">📅</span>,
  Lightbulb: () => <span className="text-lg">💡</span>,
  Clock: () => <span className="text-lg">⏱️</span>
};

const MentorCollaborationForm: React.FC = () => {
  const navigate = useNavigate();

  // Current user ID would typically come from authentication context
  const currentUserId = 201; // This would be dynamic in a real app

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>(
    "http://localhost:8082/api/mentor-collaboration"
  );
  const [selectedMentorDetails, setSelectedMentorDetails] = useState<Mentor | null>(null);

  const [formData, setFormData] = useState<CollaborationFormData>({
    mentorId: 0,
    userId: currentUserId,
    scheduledTime: "",
    durationInMinutes: 60,
    topic: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Mock function to fetch mentors - in a real app, this would be an API call
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Make the API request with updated URL
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create collaboration session";

        // Get HTTP status code specific messages
        if (response.status === 400) {
          errorMessage = "Invalid request data. Please check your form inputs.";
        } else if (response.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to schedule this session.";
        } else if (response.status === 404) {
          errorMessage = "Mentor not found or service unavailable.";
        } else if (response.status === 409) {
          errorMessage =
            "Schedule conflict. This time slot may not be available.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }

        // Try to get more specific error from response body
        try {
          const responseClone = response.clone();
          const errorText = await responseClone.text();

          if (errorText) {
            try {
              const errorData = JSON.parse(errorText);
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
              console.error("Error parsing error response JSON:", jsonError);
            }
          }
        } catch (textError) {
          console.error("Error getting response text:", textError);
        }

        throw new Error(errorMessage);
      }

      let data: CollaborationResponse;
      try {
        const responseClone = response.clone();
        const responseText = await responseClone.text();

        if (!responseText.trim()) {
          throw new Error("Empty response received");
        }

        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Error parsing success response:", jsonError);
        throw new Error("Invalid response from server: Unable to parse JSON");
      }

      // Handle successful response
      setSuccess(true);

      // Redirect to a success page or collaboration details after a short delay
      setTimeout(() => {
        navigate('/mentor-collaboration-get');
      }, 2000);
    } catch (err) {
      console.error("Error during submission:", err);
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

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Schedule a Mentoring Session</h1>

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
            <p>Session scheduled successfully! Redirecting to details...</p>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Mentor</h2>
            <p className="text-gray-600 mb-6">
              Choose the mentor who best fits your learning goals and expertise requirements.
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
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Schedule Selection */}
        {currentStep === 2 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose a Date & Time</h2>
            <p className="text-gray-600 mb-6">
              Select a date and time that works for your schedule. Sessions must be booked at least 1 hour in advance.
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
                Select Date & Time
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
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Topic */}
        {currentStep === 3 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What would you like to discuss?</h2>
            <p className="text-gray-600 mb-6">
              Describe the topics you want to cover during your session with the mentor.
              Being specific helps your mentor prepare appropriately.
            </p>
            
            <div className="mb-6">
              <label htmlFor="topic" className="block text-gray-700 font-medium mb-2">
                Session Topic
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
              
              <div className="mt-3 text-sm text-gray-500">
                <p>Tips for a productive session:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Be specific about what you want to learn</li>
                  <li>Mention any relevant background knowledge you have</li>
                  <li>Include any specific questions you'd like answered</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Duration & Confirmation */}
        {currentStep === 4 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Duration & Confirmation</h2>
            <p className="text-gray-600 mb-6">
              Select how long you'd like your session to be and review your details before confirming.
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
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Session Summary</h3>
              
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
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Scheduling...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default MentorCollaborationForm;