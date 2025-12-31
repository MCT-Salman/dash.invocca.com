// src\api\auth.js
import api from './apiClient'
import { setStorageItem } from '@/utils/helpers'

export async function login(phone, password) {
  const res = await api.post('/auth/login', { phone, password })
  return res.data
}

export async function register(payload) {
  const res = await api.post('/auth/register', payload)
  return res.data
}

export function setPassword(phone, newPassword) {
  // Local helper until backend reset is wired
  try {
    const map = JSON.parse(localStorage.getItem('passwords') || '{}')
    map[phone] = newPassword
    localStorage.setItem('passwords', JSON.stringify(map))
  } catch {
    // Ignore errors
  }
}

// Get current user info from backend
export async function getMe() {
  const res = await api.get('/auth/me')
  return res.data
}

export async function updateProfile(payload) {
  const res = await api.put('/auth/profile', payload)
  // Update local storage with new user data
  if (res.data?.user) {
    setStorageItem('user', res.data.user)
  }
  return res.data
}

export async function changePassword(currentPassword, newPassword) {
  const res = await api.put('/auth/change-password', { currentPassword, newPassword })
  return res.data
}

export async function logout() {
  try {
    await api.get('/auth/logout')
  } catch {
    // Logout error - silently fail
  }
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

export function getToken() {
  return localStorage.getItem('access_token')
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}
