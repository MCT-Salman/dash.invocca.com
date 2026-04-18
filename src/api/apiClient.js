// src\api\apiClient.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 0,
  withCredentials: false,
})

// ─── Refresh Token Queue ─────────────────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const redirectToLogin = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

// Helper: decode JWT and check expiry
const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    if (payload.exp) {
      return payload.exp < Math.floor(Date.now() / 1000)
    }
    return false
  } catch {
    return false
  }
}

// ─── Request Interceptor ─────────────────────────────────
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')

    if (token) {
      if (isTokenExpired(token)) {
        // Don't reject here — let the response interceptor handle refresh
        // just attach the expired token so we get a 401 back
      }
      const cleanToken = String(token).replace(/^[\"']|[\"']$/g, '').trim()
      if (cleanToken) {
        config.headers.Authorization = `Bearer ${cleanToken}`
      }
    }

    // Let axios set multipart boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  },
  error => Promise.reject(error)
)

// ─── Response Interceptor ────────────────────────────────
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response) {
      const { status, data } = error.response

      // ── 401: Try refresh token ──
      if (status === 401 && !originalRequest._retry) {
        const refreshToken = localStorage.getItem('refresh_token')

        if (refreshToken && !isRefreshing) {
          originalRequest._retry = true
          isRefreshing = true

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_BASE}/auth/refresh`,
              { refreshToken },
              { headers: { 'Content-Type': 'application/json' } }
            )

            const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken || res.data?.token || res.data?.access_token
            const newRefreshToken = res.data?.data?.refreshToken || res.data?.refreshToken
            if (!newAccessToken) throw new Error('No access token in refresh response')

            localStorage.setItem('access_token', newAccessToken)
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken)
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
            processQueue(null, newAccessToken)
            isRefreshing = false

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            return api(originalRequest)
          } catch (refreshError) {
            processQueue(refreshError, null)
            isRefreshing = false
            redirectToLogin()
            return Promise.reject(refreshError)
          }
        } else if (isRefreshing) {
          // Queue request until refresh finishes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          }).catch(err => Promise.reject(err))
        } else {
          // No refresh token available
          redirectToLogin()
          const authError = new Error('غير مصرح. يرجى تسجيل الدخول مرة أخرى')
          authError.status = 401
          authError.isAuthError = true
          return Promise.reject(authError)
        }
      }

      if (status === 403) {
        const forbiddenError = new Error(data?.error || data?.message || 'غير مصرح لك بالوصول إلى هذا المورد')
        forbiddenError.status = 403
        return Promise.reject(forbiddenError)
      }

      // Extract backend error message for all other errors
      const errorMessage = data?.error || data?.message || error.message || 'حدث خطأ غير متوقع'
      error.message = errorMessage
      error.errorCode = data?.errorCode
      error.errors = data?.errors

    } else if (error.request) {
      error.message = 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت.'
    } else {
      error.message = error.message || 'حدث خطأ غير متوقع'
    }

    return Promise.reject(error)
  }
)

export default api
