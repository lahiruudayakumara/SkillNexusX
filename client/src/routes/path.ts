import HomePage from "@/pages/main/home";
import LoginPage from "@/pages/auth/login";
import Main from "./section/main-section";
import NewPostPage from "@/pages/main/new-post";
import NotificationPage from "@/pages/main/notifications";
import OAuth2Callback from "@/pages/auth/callback";
import ProfilePage from "@/pages/account/setting";
import RegisterPage from "@/pages/auth/register";
import SettingsPage from "@/pages/account/profile";
import SignUpPage from "@/pages/auth/sign-up";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/sign-up",
        Component: SignUpPage,
    },
    {
        path: "register",
        Component: RegisterPage,
    },
    {
        path: "/callback",
        Component: OAuth2Callback,
    },
    {
        path: "/",
        Component: Main,
        children: [
            {
                index: true,
                Component: HomePage,
            },
            {
                path: "/notifications",
                Component: NotificationPage
            },
            {
                path: "/new-post",
                Component: NewPostPage,
            },
            {
                path: "/me",
                children: [
                    {
                        index: true,
                        Component: ProfilePage
                    },
                    {
                        path: "settings",
                        Component: SettingsPage
                    }
                ]
            }
        ]
    }
]);