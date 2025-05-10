import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Define types
interface MentorCollaboration {
  id: number;
  mentorId: number;
  mentorName?: string;
  userId: number;
  userName?: string;
  scheduledTime: string;
  durationInMinutes: number;
  topic: string;
  status: string;
  createdAt?: string;
}

const MentorCollaborationList: React.FC = () => {
  const [collaborations, setCollaborations] = useState<MentorCollaboration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl] = useState<string>(
    "http://localhost:8082/api/mentor-collaboration/all"
  );
  
  useEffect(() => {
    const fetchCollaborations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Accept": "application/json"
          },
        });

        if (!response.ok) {
          let errorMessage = "Failed to fetch collaboration sessions";
          
          if (response.status === 401) {
            errorMessage = "Authentication required. Please log in again.";
          } else if (response.status === 403) {
            errorMessage = "You don't have permission to access this data.";
          } else if (response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        setCollaborations(data);
      } catch (err) {
        console.error("Error fetching collaborations:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollaborations();
  }, [apiUrl]);

  // Add this function to handle deletion
  const handleDelete = async (id: number, userId: number) => {
    if (window.confirm("Are you sure you want to delete this collaboration session?")) {
      try {
        const response = await fetch(`http://localhost:8082/api/mentor-collaboration/${id}?userId=${userId}`, {
          method: "DELETE",
          headers: {
            "Accept": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete collaboration session");
        }

        // Remove the deleted item from state
        setCollaborations(collaborations.filter(collab => collab.id !== id));
      } catch (err) {
        console.error("Error deleting collaboration:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred while deleting"
        );
      }
    }
  };

  // Format date for display
  const formatDateTime = (dateTimeStr: string): string => {
    if (!dateTimeStr) return "N/A";
    
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

  // Format duration for display
  const formatDuration = (minutes: number): string => {
    if (minutes === 60) return "1 hour";
    if (minutes === 90) return "1.5 hours";
    if (minutes === 120) return "2 hours";
    if (minutes === 180) return "3 hours";
    return `${minutes} minutes`;
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="m-10 max-w-7xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">All Mentoring Sessions</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md mb-6">
          <div className="flex items-center">
            <span className="text-red-500 mr-3">⚠️</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : collaborations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No collaboration sessions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Time</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {collaborations.map((collab) => (
                <tr key={collab.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">{collab.id}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    {collab.mentorName || `Mentor ID: ${collab.mentorId}`}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    {collab.userName || `User ID: ${collab.userId}`}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(collab.scheduledTime)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(collab.durationInMinutes)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 max-w-xs truncate">
                    {collab.topic}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(collab.status)}`}>
                      {collab.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    <Link 
                      to={`/mentor-collaboration-put/${collab.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Update
                    </Link>
                    <button
                      onClick={() => handleDelete(collab.id, collab.userId)}
                      className="text-red-600 hover:text-red-900 font-medium"
                      aria-label="Delete collaboration"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MentorCollaborationList;