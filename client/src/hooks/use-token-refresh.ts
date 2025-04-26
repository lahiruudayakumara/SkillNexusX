import { AppDispatch, RootState } from "@stores/store";
import { useDispatch, useSelector } from "react-redux";

import Logger from "@/utils/logger";
import { logout } from "@/stores/slices/auth/auth-slice";
import { refreshUserToken } from "@stores/slices/auth/auth-actions";
import { useEffect } from "react";

const TokenRefreshChecker = () => {
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const checkAndRefreshToken = async () => {
            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    Logger.error("Refresh token not found. Logging out.");
                    dispatch(logout());
                    return;
                }

                const result = await dispatch(refreshUserToken()).unwrap();

                if (!result.token) {
                    Logger.error("Token refresh failed. Logging out.");
                    dispatch(logout());
                } else {
                    Logger.info("Token refreshed successfully");
                }
            } catch (err) {
                Logger.error("Token refresh failed:", err);
                dispatch(logout());
            }
        };

        checkAndRefreshToken();
        const intervalId = setInterval(checkAndRefreshToken, 55 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [dispatch]);

    return null;
};

export default TokenRefreshChecker;
