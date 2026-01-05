// src\api\apiClient.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't follow redirects automatically - we'll handle them as auth errors
  maxRedirects: 0,
  // Include credentials for CORS if needed
  withCredentials: false,
})

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true

  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.')
    if (parts.length !== 3) return false

    // Decode the payload (second part)
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))

    // Check expiration
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    }

    return false
  } catch {
    return false
  }
}

// Request interceptor - add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')

    if (token) {
      // Check if token is expired
      const expired = isTokenExpired(token)

      if (expired) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')

        // Don't add expired token to request
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(new Error('Token expired'))
      }

      // Remove any surrounding quotes from token (safety measure)
      const cleanToken = String(token).replace(/^["']|["']$/g, '').trim()

      if (cleanToken) {
        config.headers.Authorization = `Bearer ${cleanToken}`
      }
    }

    // If the request data is FormData, remove Content-Type header
    // to let axios set it automatically with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  response => {
    return response
  },
  error => {

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      // DISABLED: 302 redirect handling - this was causing data load to trigger logout
      /*
      // Handle 302 redirects as authentication failures
      // Many backends redirect to login instead of returning 401
      if (status === 302 || status === 301) {
        const redirectLocation = headers?.location || data?.location || '/auth/login'
        // Removed console.log for production

        // If redirecting to login, treat as auth failure
        if (redirectLocation.includes('/auth/login') || redirectLocation.includes('/login')) {
          // Removed console.warn for production

          // Clear authentication data
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')

          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }

          // Return a proper error
          const authError = new Error('جلسة العمل منتهية. يرجى تسجيل الدخول مرة أخرى')
          authError.status = 401
          authError.isAuthError = true
          return Promise.reject(authError)
        }
      }
      */

      // Handle authentication errors (401)
      if (status === 401) {

        // Token expired or invalid
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')

        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }

        const authError = new Error('غير مصرح. يرجى تسجيل الدخول مرة أخرى')
        authError.status = 401
        authError.isAuthError = true
        return Promise.reject(authError)
      }

      // Handle forbidden errors (403)
      if (status === 403) {
        const forbiddenError = new Error(data?.error || data?.message || 'غير مصرح لك بالوصول إلى هذا المورد')
        forbiddenError.status = 403
        return Promise.reject(forbiddenError)
      }

      // Handle other errors
      const errorMessage = data?.error || data?.message || error.message || 'حدث خطأ غير متوقع'

      // Attach error message to error object
      error.message = errorMessage
      error.errorCode = data?.errorCode
      error.errors = data?.errors

    } else if (error.request) {
      // Request made but no response
      error.message = 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت.'
    } else {
      // Something else happened
      error.message = error.message || 'حدث خطأ غير متوقع'
    }

    return Promise.reject(error)
  }
)

export default api
