import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userSlice } from "../Redux/UserSlice";
import { notify } from "./Notify";

interface JwtPayload {
    exp: number;
}

// Custom hook that automatically logs the user out when the token expires:
export function useAutoLogout(): void {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Logout handler
    function handleLogout(message: string) {
        dispatch(userSlice.actions.logoutUser());
        localStorage.removeItem("token");
        sessionStorage.setItem("userLogout", "true");
        notify.error(message);
        navigate("/home");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let timeoutId: number;

        try {
            // Decode the token to extract expiration time:
            const decodedToken = jwtDecode<JwtPayload>(token);
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;

            // If token already expired - log the user out immediately
            if (timeUntilExpiration <= 0) {
                handleLogout("Your session expired. Please login again.");
                return;
            }

            // Otherwise, Schedule logout when token expires
            timeoutId = window.setTimeout(() => {
                handleLogout("Your session expired. Please login again.");
            }, timeUntilExpiration);

        } catch {
            handleLogout("Invalid session. Please login again.");
        }

        // Cleanup timeout on unmount
        return () => clearTimeout(timeoutId);

    }, [dispatch, navigate]);
}
