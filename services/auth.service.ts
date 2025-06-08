
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