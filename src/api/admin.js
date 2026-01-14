// src\api\admin.js
import api from './apiClient'

// ==================== Halls Management ====================

/**
 * GET - عرض جميع قاعات/صالات
 * GET /admin/halls
 */
export const getAllHalls = async () => {
  try {
    const response = await api.get('/admin/halls')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - عرض قاعات/صالات مع الترقيم
 * GET /admin/halls/list
 */
export const getHallsList = async (params = {}) => {
  try {
    const response = await api.get('/admin/halls/list', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة قاعة/صالة جديدة
 * POST /admin/halls/
 */
export const createHall = async (hallData) => {
  try {
    const response = await api.post('/admin/halls/', hallData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل قاعة/صالة
 * PUT /admin/halls/edit/:id
 */
export const updateHall = async (id, hallData) => {
  try {
    const response = await api.put(`/admin/halls/edit/${id}`, hallData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف قاعة/صالة
 * DELETE /admin/halls/:id
 */
export const deleteHall = async (id) => {
  try {
    const response = await api.delete(`/admin/halls/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة خدمة لقاعة/صالة
 * POST /admin/halls/:id/services
 */
export const addHallService = async (hallId, serviceData) => {
  try {
    const response = await api.post(`/admin/halls/${hallId}/services`, serviceData)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Services Management ====================

/**
 * GET - عرض الخدمات حسب الفئة
 * GET /admin/category/:category
 */
export const getServicesByCategory = async (category) => {
  try {
    const response = await api.get(`/admin/category/${category}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل الخدمة
 * GET /admin/services/:id
 */
export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/admin/services/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export const getServiceCategories = async () => {
  try {
    const response = await api.get('/admin/services/categories')
    return response.data
  } catch (error) {
    throw error
  }
}

export const getServicesList = async () => {
  try {
    const response = await api.get(`/admin/services`)
    return response.data
  } catch (error) {
    throw error
  }
}



/**
 * POST - إضافة خدمة جديدة
 * POST /admin/services
 */
export const createService = async (serviceData) => {
  try {
    const response = await api.post('/admin/services', serviceData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل خدمة
 * PUT /admin/services/:id
 */
export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/admin/services/${id}`, serviceData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف خدمة
 * DELETE /admin/services/:id
 */
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/admin/services/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Users Management ====================

/**
 * GET - عرض جميع المستخدمين
 * GET /admin/users
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل مستخدم
 * GET /admin/users/:id
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة مستخدم جديد
 * POST /admin/users
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل مستخدم
 * PUT /admin/users/:id
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تفعيل/تعطيل المستخدم
 * PUT /admin/users/:id/activate
 */
export const toggleUserStatus = async (id) => {
  try {
    const response = await api.put(`/admin/users/${id}/activate`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف مستخدم
 * DELETE /admin/users/:id
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Managers Management ====================

/**
 * GET - عرض جميع المدراء
 * GET /admin/managers
 */
export const getManagers = async () => {
  try {
    const response = await api.get('/admin/managers')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة مدير جديد
 * POST /admin/managers/add
 */
export const createManager = async (managerData) => {
  try {
    const response = await api.post('/admin/managers/add', managerData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل مدير
 * PUT /admin/managers/edit/:id
 */
export const updateManager = async (id, managerData) => {
  try {
    const response = await api.put(`/admin/managers/edit/${id}`, managerData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف مدير
 * DELETE /admin/managers/delete/:id
 */
export const deleteManager = async (id) => {
  try {
    const response = await api.delete(`/admin/managers/delete/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - تفعيل/إلغاء تفعيل مدير
 * POST /admin/managers/:id/activate
 */
export const toggleManagerStatus = async (id) => {
  try {
    const response = await api.post(`/admin/managers/${id}/activate`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Templates Management ====================

/**
 * GET - عرض جميع القوالب
 * GET /admin/templates
 */
/**
 * GET - get templates assigned to hall
 * GET /admin/halls/:hallId/templates
 */
export const getHallTemplates = async (hallId) => {
  if (!hallId) return null
  try {
    const response = await api.get(`/admin/halls/${hallId}/templates`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - assign template to hall
 * POST /admin/templates/:templateId/assign
 */
export const assignTemplateToHall = async (templateId, hallId) => {
  if (!templateId || !hallId) return null
  try {
    const response = await api.post(`/admin/templates/${templateId}/assign`, { hallId })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - unassign template from hall
 * DELETE /admin/templates/:templateId/halls/:hallId
 */
export const unassignTemplateFromHall = async (templateId, hallId) => {
  if (!templateId || !hallId) return null
  try {
    const response = await api.delete(`/admin/templates/${templateId}/halls/${hallId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getTemplates = async () => {
  try {
    const response = await api.get('/admin/templates')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة قالب جديد
 * POST /admin/templates/add
 */
export const createTemplate = async (formData) => {
  try {
    const response = await api.post('/admin/templates/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل قالب
 * PUT /admin/templates/edit/:id
 */
export const updateTemplate = async (templateId, formData) => {
  try {
    const response = await api.put(`/admin/templates/edit/${templateId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف قالب
 * DELETE /admin/templates/delete/:id
 */
export const deleteTemplate = async (templateId) => {
  try {
    const response = await api.delete(`/admin/templates/delete/${templateId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Reports Management ====================

/**
 * GET - عرض التقارير
 * GET /admin/reports
 */
export const getReports = async (params = {}) => {
  try {
    const response = await api.get('/admin/reports', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Dashboard & Statistics ====================

/**
 * GET - لوحة التحكم
 * GET /admin/dashboard
 */
export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/admin/dashboard')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - الإحصائيات
 * GET /admin/stats
 */
export const getAdminStats = async () => {
  try {
    const response = await api.get('/admin/stats')
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Events Management ====================

/**
 * GET - عرض جميع الفعاليات (للأدمن)
 * GET /admin/events/list
 */
export const getAdminEvents = async (params = {}) => {
  try {
    const response = await api.get('/admin/events/list', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف فعالية (للأدمن)
 * DELETE /admin/events/:id
 */
export const deleteAdminEvent = async (id) => {
  try {
    const response = await api.delete(`/admin/events/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}


// ==================== Complaint Management ====================

/**
 * GET - عرض جميع الشكاوى
 * GET /admin/complaints
 */
export const getComplaints = async (params = {}) => {
  try {
    const response = await api.get('/admin/complaints', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - عرض شكوى محددة
 * GET /admin/complaints/:id
 */
export const getComplaintById = async (id) => {
  try {
    const response = await api.get(`/admin/complaints/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تحديث حالة الشكوى
 * PUT /admin/complaints/:id/status
 */
export const updateComplaintStatus = async (id, statusData) => {
  try {
    const response = await api.put(`/admin/complaints/${id}/status`, statusData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة رد على الشكوى
 * POST /admin/complaints/:id/response
 */
export const addComplaintResponse = async (id, responseData) => {
  try {
    const response = await api.post(`/admin/complaints/${id}/response`, responseData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف شكوى
 * DELETE /admin/complaints/:id
 */
export const deleteComplaint = async (id) => {
  try {
    const response = await api.delete(`/admin/complaints/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Financial Management ====================

/**
 * GET - عرض الفواتير
 * GET /admin/financial/invoices
 */
export const getFinancialInvoices = async () => {
  try {
    const response = await api.get('/admin/financial/invoices')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - عرض لوحة التحكم المالية
 * GET /admin/financial/dashboard
 */
export const getFinancialDashboard = async () => {
  try {
    const response = await api.get('/admin/financial/dashboard')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - عرض المعاملات المالية
 * GET /admin/financial/transactions
 */
export const getFinancialTransactions = async () => {
  try {
    const response = await api.get('/admin/financial/transactions')
    return response.data
  } catch (error) {
    throw error
  }
}

// Export all functions
export default {
  // Halls
  getAllHalls,
  getHallsList,
  createHall,
  updateHall,
  deleteHall,
  addHallService,

  // Services
  getServicesByCategory,
  getServiceById,
  getServiceCategories,
  getServicesList,
  createService,
  updateService,
  deleteService,

  // Users
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,

  // Managers
  getManagers,
  createManager,
  updateManager,
  deleteManager,
  toggleManagerStatus,

  // Templates
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getHallTemplates,
  assignTemplateToHall,
  unassignTemplateFromHall,

  // Reports
  getReports,

  // Dashboard & Stats
  getAdminDashboard,
  getAdminStats,

  // Events
  getAdminEvents,
  deleteAdminEvent,

  // Complaints
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addComplaintResponse,
  deleteComplaint,

  // financial
  getFinancialInvoices,
  getFinancialDashboard,
  getFinancialTransactions
}