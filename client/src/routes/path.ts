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
import CreateProgress from "@/pages/progress/create-progress";
import UpdateProgress from "@/pages/progress/update-progress";
import ViewProgress from "@/pages/progress/view-progress";
import CreatePlanPage from "@/pages/plan/create-plan";
import UpdatePlanPage from "@/pages/plan/update-plan";
import ViewPlanPage from "@/pages/plan/view-plan";
import { createBrowserRouter } from "react-router-dom";
import MentorCollaborationPage from "@/pages/main/mentor-collaboration-post";
import GetAllMentorCollaborationPage from "@/pages/main/mentor-collaboration-get";
import PutMentorCollaborationPage from "@/pages/main/mentor-collaboration-put";
import PlansListPage from "@/pages/plan/plans-list";
import LandingPage from "@/pages/main/landing-page";
import PostDetailsPage from "@/pages/main/post-details";
import CommentsPage from "@/pages/main/comments";


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
        path: "/landing",
        Component: LandingPage,
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
                path: "/account/settings",
                Component: ProfilePage,
            },
            {
                path: "post/:id",
                Component: PostDetailsPage
            },
            {
                path: "comments/:id",
                Component: CommentsPage
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
                        Component: SettingsPage,
                    },
                ],
            },
            {
                path: "/progress",
                children: [
                    
                
                    {
                        path: "create",
                        Component: CreateProgress, // Create Progress
                    },
                    {
                        path: "update",
                        Component: UpdateProgress, // Update Progress
                    },
                    {
                        path: "view",
                        Component: ViewProgress, // View Progress
                    },
                ],
            },
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
            },
            {
                path: "/mentor-collaboration-post",
                Component: MentorCollaborationPage,
            },
            {
                path: "/mentor-collaboration-get",
                Component: GetAllMentorCollaborationPage,
            },
            {
                path: "mentor-collaboration-put/:collaborationId",
                Component: PutMentorCollaborationPage,
            },
            {
                path: "mentor-collaboration-del/:collaborationId",
                Component: PutMentorCollaborationPage,
            }
        ]
    }
]);

export default router;
