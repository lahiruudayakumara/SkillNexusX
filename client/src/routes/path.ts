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
<<<<<<< HEAD
import ProgressDashboard from "@/pages/progress/dashboard";
import CreateProgress from "@/pages/progress/create-progress";
import UpdateProgress from "@/pages/progress/update-progress";
import ViewProgress from "@/pages/progress/view-progress";
=======
import CreatePlanPage from "@/pages/plan/create-plan";
import UpdatePlanPage from "@/pages/plan/update-plan";
import ViewPlanPage from "@/pages/plan/view-plan";
import PlansListPage from "@/pages/plan/plans-list";
>>>>>>> 66583b05e4e6be6eb2056535789415984ac84fb9
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
                Component: NotificationPage,
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
                        Component: ProfilePage,
                    },
                    {
                        path: "settings",
<<<<<<< HEAD
                        Component: SettingsPage,
                    },
                ],
            },
            {
                path: "/progress",
                children: [
                    {
                        index: true,
                        Component: ProgressDashboard, // Progress Dashboard
                    },
                    {
                        path: "create",
                        Component: CreateProgress, // Create Progress
                    },
                    {
                        path: "update/:id",
                        Component: UpdateProgress, // Update Progress
                    },
                    {
                        path: "view/:id",
                        Component: ViewProgress, // View Progress
                    },
                ],
            },
        ],
    },
=======
                        Component: SettingsPage
                    }
                ]
            },
            // Learning Plan Routes
            {
                path: "/plans",
                children: [
                    {
                        index: true,
                        Component: PlansListPage
                    },
                    
                    {
                        path: "create",
                        Component: CreatePlanPage
                    },
                    {
                        path: ":id",
                        Component: ViewPlanPage
                    },
                    {
                        path: ":id/edit",
                        Component: UpdatePlanPage
                    }
                ]
            }
        ]
    }
>>>>>>> 66583b05e4e6be6eb2056535789415984ac84fb9
]);