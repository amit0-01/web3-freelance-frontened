import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { storageService } from "@/services/storageService";

export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const publicRoutes = ["/", "/auth/login", "/auth/register", "/about", "/auth/join", "/auth/callback"];

    // Handle OAuth callback
    if (pathname === "/auth/callback") {
      console.log('🔵 Callback page hit');
      
      // Try to get encoded data first (new format)
      const encodedData = searchParams.get("data");
      // Fallback to token (old format)
      const token = searchParams.get("token");
      
      console.log('📦 Encoded data:', encodedData ? 'exists' : 'null');
      console.log('🎫 Token:', token ? 'exists' : 'null');
      
      // NEW FORMAT: Full response data
      if (encodedData) {
        try {
          console.log('✅ Processing encoded data');
          const response = JSON.parse(atob(encodedData));
          console.log('📋 Decoded response:', response);
          
          if (response.success && response.accessToken && response.user) {
            const { accessToken } = response;
            
            // Decode JWT to get expiry
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const expiryTime = payload.exp * 1000;

            console.log('💾 Storing user data:', response);

            // Store in r
            storageService.setItem('user', response);
            localStorage.setItem('tokenExpiry', expiryTime.toString());

            toast.success(response.message || "Successfully logged in with Google!");
            
            // Redirect to dashboard
            router.push('/dashboard');
            return;
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error) {
          console.error('❌ Error processing OAuth callback:', error);
          toast.error("Authentication failed. Please try again.");
          router.push('/auth/login');
          return;
        }
      } 
      // OLD FORMAT: Just token (fallback for backwards compatibility)
      else if (token) {
        try {
          console.log('⚠️ Processing legacy token format');
          
          // Decode JWT to get user data and expiry
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('📋 JWT Payload:', payload);
          
          const userData = {
            accessToken: token,
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            walletAddress: payload.walletAddress,
            name: payload.name || payload.email?.split('@')[0]
          };

          console.log('💾 Storing user data (legacy):', userData);

          // Store token and user data
          storageService.setItem('user', userData);
          
          // Store token expiry (exp is in seconds, convert to milliseconds)
          const expiryTime = payload.exp * 1000;
          localStorage.setItem('tokenExpiry', expiryTime.toString());

          toast.success("Successfully logged in with Google!");
          
          // Redirect to dashboard
          router.push('/dashboard');
          return;
        } catch (error) {
          console.error('❌ Error processing OAuth token:', error);
          toast.error("Authentication failed. Please try again.");
          router.push('/auth/login');
          return;
        }
      } 
      // NO DATA FOUND
      else {
        console.error('❌ No data or token found in URL');
        toast.error("No authentication data received.");
        router.push('/auth/login');
        return;
      }
    }

    // Skip auth check for public routes
    if (publicRoutes.includes(pathname)) {
      return;
    }

    // Check authentication for protected routes
    const userData: any = storageService.getItem("user");
    const token = userData?.accessToken;
    const expiry = localStorage.getItem("tokenExpiry");

    if (Date.now() > Number(expiry) && expiry != null) {
      toast.error("Token expired. Please log in again.");
    }

    if (!token || !expiry || Date.now() > Number(expiry)) {
      // Clear expired/invalid data
      storageService.removeItem("user");
      localStorage.removeItem("tokenExpiry");
      
      router.push("/auth/login");
    }
  }, [pathname, searchParams, router]);
};