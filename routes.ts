// Define routes that require authentication
export const privateRoutes = ["/dashboard", "/profile", "/settings"]

// Define routes that are only accessible to unauthenticated users
export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify"]

// Default redirect URLs
export const DEFAULT_REDIRECT_LOGIN_URL = "/login"
export const DEFAULT_REDIRECT_HOME_URL = "/dashboard"

