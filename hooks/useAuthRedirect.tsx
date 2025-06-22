import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";  // Import react-toastify

export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicRoutes = ["/", "/auth/login", "/auth/register", "/about", "/auth/join"];

    if (publicRoutes.includes(pathname)) {
      return;
    }

    const token = Cookies.get("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if( Date.now() > Number(expiry) && expiry!=null){
        toast.error("Token expired. Please log in again.");
        }
    if (!token || !expiry || Date.now() > Number(expiry)) {
      // Show toast notification when token is expired
      Cookies.remove("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("user");
      router.push("/auth/login");
    }
  }, [pathname]);
};
