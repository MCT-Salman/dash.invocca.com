// src\api\scanner.js
import api from './apiClient'

/**
 * POST - تسجيل الدخول للماسح الضوئي
 * POST /scanner/login
 */
export const scannerLogin = async (loginData) => {
  try {
    const response = await api.post('/scanner/login', loginData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تسجيل الخروج
 * GET /scanner/logout
 */
export const scannerLogout = async () => {
  try {
    const response = await api.get('/scanner/logout')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - الملف الشخصي
 * GET /scanner/profile
 */
export const getScannerProfile = async () => {
  try {
    const response = await api.get('/scanner/profile')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل الملف الشخصي
 * PUT /scanner/edit-profile
 */
export const updateScannerProfile = async (profileData) => {
  try {
    const response = await api.put('/scanner/edit-profile', profileData)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Invitations Scanning ====================

/**
 * GET - عرض دعوات الحدث
 * GET /scanner/events/:eventId/invitations
 */
export const getEventInvitations = async (eventId) => {
  try {
    const response = await api.get(`/scanner/events/${eventId}/invitations`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - مسح دعوة (QR Code)
 * POST /scanner/scan
 */
export const scanInvitation = async (scanData) => {
  try {
    const response = await api.post('/scanner/scan', scanData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل دعوة
 * GET /scanner/invitations/:id
 */
export const getInvitationById = async (invitationId) => {
  try {
    const response = await api.get(`/scanner/invitations/${invitationId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تحديث حالة دعوة
 * PUT /scanner/invitations/:id/status
 */
export const updateInvitationStatus = async (invitationId, statusData) => {
  try {
    const response = await api.put(`/scanner/invitations/${invitationId}/status`, statusData)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Reports ====================

/**
 * GET - التقارير
 * GET /scanner/reports
 */
export const getScannerReports = async (params = {}) => {
  try {
    const response = await api.get('/scanner/reports', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Tasks Management ====================

/**
 * GET - عرض المهام
 * GET /employee/tasks
 */
export const getEmployeeTasks = async (params = {}) => {
  try {
    const response = await api.get('/employee/tasks', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل مهمة
 * GET /employee/tasks/:id
 */
export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/employee/tasks/${taskId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تحديث حالة مهمة
 * PUT /employee/tasks/:id/status
 */
export const updateTaskStatus = async (taskId, statusData) => {
  try {
    const response = await api.put(`/employee/tasks/${taskId}/status`, statusData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - لوحة تحكم الموظف
 * GET /employee/dashboard
 */
export const getEmployeeDashboard = async () => {
  try {
    const response = await api.get('/employee/dashboard')
    return response.data
  } catch (error) {
    throw error
  }
}

// Export all functions
export default {
  // Auth
  scannerLogin,
  scannerLogout,
  getScannerProfile,
  updateScannerProfile,

  // Invitations
  getEventInvitations,
  scanInvitation,
  getInvitationById,
  updateInvitationStatus,

  // Reports
  getScannerReports,

  // Tasks
  getEmployeeTasks,
  getTaskById,
  updateTaskStatus,
  getEmployeeDashboard
}