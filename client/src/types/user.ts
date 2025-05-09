export interface User {
    id: number;
    email: string;
    username: string;
    provider: string;
    providerId?: string;
    fullName: string;
    password: string;
    enabled: boolean;
    verified: boolean;
    verificationToken?: string;
    followers: Follow[];
    following: Follow[];
    profilePic?: string;
    coverPhoto?: string;
}

export interface Follow {
    id: number;
    name: string;
    avatar: string;
  }
  