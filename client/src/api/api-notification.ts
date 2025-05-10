import API from "@/api/api-instance";

interface Notification {
    recipientId: number;
    actorId: number;
    type: "FOLLOW" | "LIKE" | "COMMENT" | "MENTION"; // Add other possible types if needed
    message: string;
  }
  

  export const createNotification = async (
    notificationData: Notification
  ): Promise<{ message: string; notificationId: string }> => {
    const response = await API.post<{ message: string; notificationId: string }>(
      "/notifications",
      notificationData
    );
    return response.data;
  };
  