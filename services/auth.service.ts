import { LoginPayload } from "@/lib/auth.interface";
import axiosInstance from "@/lib/axiosInstance";

export const Logout = async () => {
    try {
        // Clear user session data
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");
    
        window.location.href = "auth/login"; // Adjust the path as needed
    } catch (error) {
        console.error("Logout failed:", error);
    }
    }
    
export const register = async ({ name, email, password, walletAddress, role }: LoginPayload) => {
    return axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        walletAddress,
        role
    });
}
