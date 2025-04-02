export interface LoginRequest {
    emailOrUsername: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refresh_token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export interface AuthState {
    user: AuthResponse["user"] | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }