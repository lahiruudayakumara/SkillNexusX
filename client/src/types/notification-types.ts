export interface Notification {
    id: number;
    recipientId: number;
    actorId: number;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}
