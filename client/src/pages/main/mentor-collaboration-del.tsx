import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

// Configuration for API endpoints - should come from environment variables in production
const API_CONFIG = {
  // In production, this would be your actual API URL from environment variables
  baseUrl: process.env.REACT_APP_API_URL || "/api" 
};

const MentorCollaborationCancel: React.FC = () => {
  const navigate = useNavigate();
  const { collaborationId } = useParams<{ collaborationId: string }>();
  
  // Current user ID would come from authentication context in a real app
  const currentUserId = 201; // This would be dynamic in a real app
  
  const [collaboration, setCollaboration] = useState<Collaboration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false);

  // Fetch collaboration details
  useEffect(() => {
    const fetchCollaboration = async () => {
      if (!collaborationId) {
        setError("Session ID is missing");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // In a production app, make an API call to your backend
        const response = await fetch(
          `${API_CONFIG.baseUrl}/mentor-collaboration/${collaborationId}?userId=${currentUserId}`,
          {
            headers: {
              "Accept": "application/json",
              // Authorization header would be included here in a real app
            }
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to load session details. Please try again.");
        }
        
        const data = await response.json();
        setCollaboration(data);
      } catch (err) {
        console.error("Error fetching collaboration:", err);
        setError("Unable to load session details. Please refresh or try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollaboration();
  }, [collaborationId, currentUserId]);

  const handleCancelCollaboration = async () => {
    if (!collaborationId) {
      setError("Session ID is missing");
      return;
    }
    
    setCancelling(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/mentor-collaboration/${collaborationId}?userId=${currentUserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            // Authorization header would be included here in a real app
          }
        }
      );
      
      if (!response.ok) {
        // Get error message from server response if available
        let errorMessage = "We couldn't cancel your session at this time.";
        
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseErr) {
          // If JSON parsing fails, use status-based error messages
          if (response.status === 403) {
            errorMessage = "You don't have permission to cancel this session.";
          } else if (response.status === 404) {
            errorMessage = "This session doesn't exist or has already been cancelled.";
          } else if (response.status === 409) {
            errorMessage = "This session can't be cancelled. It may have already been completed.";
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Handle successful response
      setSuccess(true);
      
      // Redirect to the collaborations list after a short delay
      setTimeout(() => {
        navigate('/mentor-collaborations');
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

  // Get relative time description (e.g., "Tomorrow at 2:00 PM", "In 3 days")
  const getRelativeTimeDescription = (dateTimeStr: string): string => {
    if (!dateTimeStr) return "";
    
    const sessionDate = new Date(dateTimeStr);
    const now = new Date();
    
    // Calculate difference in days
    const diffTime = sessionDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const timeString = sessionDate.toLocaleString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    if (diffDays === 0) return `Today at ${timeString}`;
    if (diffDays === 1) return `Tomorrow at ${timeString}`;
    if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
    
    return formatDateTime(dateTimeStr);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cancel Mentoring Session</h1>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Your session has been cancelled successfully. Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setError(null)}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-52">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading session details...</span>
        </div>
      ) : collaboration ? (
        <div>
          {/* Session Details Card */}
          <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Session with {collaboration.mentorName}</h2>
                <p className="text-gray-500 text-sm">
                  ID: {collaboration.id}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                collaboration.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                collaboration.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                collaboration.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {collaboration.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-gray-700">{formatDateTime(collaboration.scheduledTime)}</div>
                  <div className="text-sm text-blue-600 font-medium">
                    {getRelativeTimeDescription(collaboration.scheduledTime)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">
                  {collaboration.durationInMinutes === 60 && "1 hour"}
                  {collaboration.durationInMinutes === 90 && "1 hour 30 minutes"}
                  {collaboration.durationInMinutes === 120 && "2 hours"}
                  {collaboration.durationInMinutes === 180 && "3 hours"}
                  {collaboration.durationInMinutes !== 60 && 
                   collaboration.durationInMinutes !== 90 && 
                   collaboration.durationInMinutes !== 120 && 
                   collaboration.durationInMinutes !== 180 && 
                   `${collaboration.durationInMinutes} minutes`}
                </span>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Topic:</span>
                </div>
                <div className="pl-7 text-gray-700">{collaboration.topic}</div>
              </div>
            </div>
          </div>
          
          {/* Cancellation UI */}
          {collaboration.status === 'SCHEDULED' && (
            <div>
              {!confirmCancel ? (
                <div className="text-center py-4">
                  <p className="text-gray-700 mb-6">
                    Would you like to cancel this mentoring session?
                  </p>
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate('/mentor-collaborations')}
                      className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Keep Session
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(true)}
                      className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel Session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-6 mt-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">
                          Please confirm your cancellation
                        </h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            The mentor will be notified that you've cancelled this session. 
                            This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(false)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={cancelling}
                    >
                      Go Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCancelCollaboration}
                      className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      disabled={cancelling}
                    >
                      {cancelling ? (
                        <div className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Cancelling...
                        </div>
                      ) : (
                        "Yes, Cancel Session"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Already cancelled/completed session UI */}
          {collaboration.status !== 'SCHEDULED' && (
            <div className="text-center py-6 border-t border-gray-200 mt-6">
              <p className="text-gray-700 mb-4">
                This session {collaboration.status === 'CANCELLED' ? 'has already been cancelled' : 'is already completed'} and cannot be modified.
              </p>
              <button
                type="button"
                onClick={() => navigate('/mentor-collaborations')}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to My Sessions
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No session found</h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find the mentoring session you're looking for.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/mentor-collaborations')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Sessions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorCollaborationCancel;