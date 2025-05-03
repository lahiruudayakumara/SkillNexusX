import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// Define types
interface Collaboration {
  id: number;
  mentorId: number;
  mentorName: string;
  userId: number;
  scheduledTime: string;
  durationInMinutes: number;
  topic: string;
  status: string;
}

const MentorCollaborationCancel: React.FC = () => {
  const navigate = useNavigate();
  const { collaborationId } = useParams<{ collaborationId: string }>();
  const [searchParams] = useSearchParams();
  
  // Current user ID would typically come from authentication context
  const currentUserId = 201; // This would be dynamic in a real app
  
  const [collaboration, setCollaboration] = useState<Collaboration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false);
  
  const apiUrl = `http://localhost:8082/api/mentor-collaboration`;

  // Fetch collaboration details
  useEffect(() => {
    const fetchCollaboration = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, you would make an API call to get collaboration details
        // For demonstration, we'll use mock data
        const mockCollaboration: Collaboration = {
          id: parseInt(collaborationId || "0"),
          mentorId: 102,
          mentorName: "John Doe",
          userId: currentUserId,
          scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          durationInMinutes: 60,
          topic: "React Hooks and Context API",
          status: "SCHEDULED"
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCollaboration(mockCollaboration);
      } catch (err) {
        console.error("Error fetching collaboration:", err);
        setError("Failed to load collaboration details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (collaborationId) {
      fetchCollaboration();
    } else {
      setError("Collaboration ID is missing");
      setLoading(false);
    }
  }, [collaborationId, currentUserId]);

  const handleCancelCollaboration = async () => {
    if (!collaborationId) {
      setError("Collaboration ID is missing");
      return;
    }
    
    setCancelling(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${apiUrl}/${collaborationId}?userId=${currentUserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        }
      );
      
      if (!response.ok) {
        let errorMessage = "Failed to cancel collaboration session";
        
        // Get HTTP status code specific messages
        if (response.status === 400) {
          errorMessage = "Invalid request. Please try again.";
        } else if (response.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to cancel this session.";
        } else if (response.status === 404) {
          errorMessage = "Collaboration session not found.";
        } else if (response.status === 409) {
          errorMessage = "Cannot cancel this session. It may have already been completed or cancelled.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        // Try to get more specific error from response body
        try {
          const errorText = await response.text();
          
          if (errorText) {
            try {
              const errorData = JSON.parse(errorText);
              if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.error) {
                errorMessage = errorData.error;
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
      
      // Handle successful response
      setSuccess(true);
      
      // Redirect to the collaborations list after a short delay
      setTimeout(() => {
        navigate('/mentor-collaboration-get');
      }, 2000);
    } catch (err) {
      console.error("Error during cancellation:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setCancelling(false);
    }
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
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Cancel Mentoring Session</h1>
      
      {/* Success and error messages */}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md mb-6 animate-pulse">
          <div className="flex">
            <span className="text-green-500 mr-3">✓</span>
            <p>Session cancelled successfully! Redirecting to your collaborations...</p>
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
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin text-4xl text-blue-600">⟳</div>
          <span className="ml-3 text-gray-600">Loading collaboration details...</span>
        </div>
      ) : collaboration ? (
        <div>
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Session ID:</span>
                <span className="font-medium">{collaboration.id}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Mentor:</span>
                <span className="font-medium">{collaboration.mentorName}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Scheduled Time:</span>
                <span className="font-medium">{formatDateTime(collaboration.scheduledTime)}</span>
              </div>
              
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {collaboration.durationInMinutes === 60 && "1 hour"}
                  {collaboration.durationInMinutes === 90 && "1.5 hours"}
                  {collaboration.durationInMinutes === 120 && "2 hours"}
                  {collaboration.durationInMinutes === 180 && "3 hours"}
                  {(collaboration.durationInMinutes < 60) && `${collaboration.durationInMinutes} minutes`}
                </span>
              </div>
              
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  collaboration.status === 'SCHEDULED' ? 'text-green-600' :
                  collaboration.status === 'COMPLETED' ? 'text-blue-600' :
                  collaboration.status === 'CANCELLED' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {collaboration.status}
                </span>
              </div>
              
              <div className="pt-2">
                <span className="text-gray-600 block mb-2">Topic:</span>
                <div className="bg-white p-3 border border-gray-200 rounded-md">
                  {collaboration.topic}
                </div>
              </div>
            </div>
          </div>
          
          {collaboration.status === 'SCHEDULED' && (
            <div className="border-t border-gray-200 pt-6">
              {!confirmCancel ? (
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to cancel this mentoring session?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/mentor-collaboration-get')}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
                    >
                      No, Keep Session
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(true)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                    >
                      Yes, Cancel Session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                    <p className="text-amber-800 font-medium mb-2">⚠️ Final Confirmation</p>
                    <p className="text-gray-700">
                      This action cannot be undone. The mentor will be notified that you've cancelled this session.
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
                      disabled={cancelling}
                    >
                      Go Back
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCollaboration}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={cancelling}
                    >
                      {cancelling ? (
                        <>
                          <span className="inline-block animate-spin mr-2">⟳</span>
                          Cancelling...
                        </>
                      ) : (
                        "Confirm Cancellation"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {collaboration.status !== 'SCHEDULED' && (
            <div className="text-center border-t border-gray-200 pt-6">
              <p className="text-gray-700 mb-4">
                This session cannot be cancelled because its status is {collaboration.status.toLowerCase()}.
              </p>
              <button
                type="button"
                onClick={() => navigate('/mentor-collaboration-get')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                Back to Collaborations
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No collaboration found with the provided ID.</p>
          <button
            type="button"
            onClick={() => navigate('/mentor-collaboration-get')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            View All Collaborations
          </button>
        </div>
      )}
    </div>
  );
};

export default MentorCollaborationCancel;