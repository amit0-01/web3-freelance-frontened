class StorageService {
    private static instance: StorageService;
  
    private constructor() {}
  
    // Singleton pattern - Ensure only one instance
    public static getInstance(): StorageService {
      if (!StorageService.instance) {
        StorageService.instance = new StorageService();
      }
      return StorageService.instance;
    }
    // Save item (localStorage)
    setItem(key: string, value: any) {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  
    // Get item (localStorage)
    getItem<T>(key: string): T | null {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      return null;
    }
  
    // Remove item
    removeItem(key: string) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    }
  
    // Clear all storage
    clearStorage() {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    }
  
    // Save item in cookies (for SSR)
    setCookie(key: string, value: any, days: number = 7) {
      if (typeof document !== "undefined") {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${key}=${encodeURIComponent(
          JSON.stringify(value)
        )}; expires=${expires.toUTCString()}; path=/`;
      }
    }
  
    // Get cookie
    getCookie(key: string): string | null {
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
          const [cookieKey, cookieValue] = cookie.split("=");
          if (cookieKey === key) {
            return decodeURIComponent(cookieValue);
          }
        }
      }
      return null;
    }
  
    // Remove cookie
    removeCookie(key: string) {
      this.setCookie(key, "", -1);
    }
  }
  
  // Export singleton instance
  export const storageService = StorageService.getInstance();
  