// src\api\manager.js
import api from './apiClient'

// ==================== Hall Management ====================

/**
 * GET - عرض معلومات القاعة
 * GET /manager/hall
 */
export const getManagerHall = async () => {
  try {
    const response = await api.get('/manager/hall')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تحديث معلومات القاعة
 * PUT /manager/hall
 */
export const updateHallInfo = async (id, hallData) => {
  try {
    // If hallData is the first argument (backward compatibility)
    if (id && typeof id === 'object' && !hallData) {
      const response = await api.put('/manager/hall', id)
      return response.data
    }
    // Normal usage: updateHallInfo(id, data) or updateHallInfo(null, data)
    const dataToSend = hallData || id || {}
    const response = await api.put('/manager/hall', dataToSend)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة خدمة للقاعة
 * POST /manager/hall/services
 */
export const addHallService = async (serviceData) => {
  try {
    const response = await api.post('/manager/hall/services', serviceData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل خدمة القاعة
 * PUT /manager/hall/services/:id
 */
export const updateHallService = async (serviceId, serviceData) => {
  try {
    const response = await api.put(`/manager/hall/services/${serviceId}`, serviceData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف خدمة من القاعة
 * DELETE /manager/hall/services/:id
 */
export const deleteHallService = async (serviceId) => {
  try {
    const response = await api.delete(`/manager/hall/services/${serviceId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Clients Management ====================

/**
 * DELETE - حذف عميل
 * DELETE /manager/clients/:id
 */
export const deleteClient = async (clientId) => {
  try {
    const response = await api.delete(`/manager/clients/${clientId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Staff Management ====================

/**
 * GET - عرض الموظفين
 * GET /manager/staff
 */
export const getStaff = async () => {
  try {
    const response = await api.get('/manager/staff')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة موظف
 * POST /manager/staff
 */
export const addStaff = async (staffData) => {
  try {
    const response = await api.post('/manager/staff', staffData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل موظف
 * PUT /manager/staff/:id
 */
export const updateStaff = async (staffId, staffData) => {
  try {
    const response = await api.put(`/manager/staff/${staffId}`, staffData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف موظف
 * DELETE /manager/staff/:id
 */
export const deleteStaff = async (staffId) => {
  try {
    const response = await api.delete(`/manager/staff/${staffId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Templates Management ====================

/**
 * GET - عرض القوالب
 * GET /manager/templates
 */
export const listManagerTemplates = async () => {
  try {
    const response = await api.get('/manager/templates')
    // نفس طريقة admin - إرجاع response.data مباشرة
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة قالب
 * POST /manager/templates/add
 */
export const addManagerTemplate = async (formData) => {
  try {
    const response = await api.post('/manager/templates/add', formData, {
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
 * PUT /manager/templates/edit/:id
 */
export const editManagerTemplate = async (templateId, formData) => {
  try {
    const response = await api.put(`/manager/templates/edit/${templateId}`, formData, {
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
 * DELETE /manager/templates/delete/:id
 */
export const deleteManagerTemplate = async (templateId) => {
  try {
    // Ensure templateId is a string and trim it
    const id = String(templateId || '').trim()
    if (!id) {
      throw new Error('Template ID is required')
    }
    
    const response = await api.delete(`/manager/templates/delete/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Invoices Management ====================

/**
 * GET - عرض الفواتير
 * GET /manager/financial/invoices
 */
export const getManagerInvoices = async () => {
  try {
    const response = await api.get('/manager/financial/invoices')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة فاتورة
 * POST /manager/financial/invoices
 */
export const createManagerInvoice = async (invoiceData) => {
  try {
    const response = await api.post('/manager/financial/invoices', invoiceData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل فاتورة
 * PUT /manager/financial/invoices/:id
 */
export const updateManagerInvoice = async (id, invoiceData) => {
  try {
    const response = await api.put(`/manager/financial/invoices/${id}`, invoiceData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - تسجيل دفعة للفاتورة
 * POST /manager/financial/invoices/:id/payment
 */
export const recordInvoicePayment = async (id, paymentData) => {
  try {
    const response = await api.post(`/manager/financial/invoices/${id}/payment`, paymentData)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Transactions Management ====================

/**
 * POST - إضافة معاملة
 * POST /manager/financial/transactions
 */
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/manager/financial/transactions', transactionData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل معاملة
 * PUT /manager/financial/transactions/:id
 */
export const updateTransaction = async (transactionId, transactionData) => {
  try {
    const response = await api.put(`/manager/financial/transactions/${transactionId}`, transactionData)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Events Management ====================

/**
 * GET - عرض جميع الفعاليات
 * GET /manager/events
 */
export const getManagerEvents = async (params = {}) => {
  try {
    const response = await api.get('/manager/events', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل فعالية
 * GET /manager/events/:id
 */
export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/manager/events/${eventId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة فعالية جديدة
 * POST /manager/events
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/manager/events', eventData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل فعالية
 * PUT /manager/events/:id
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/manager/events/${eventId}`, eventData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف فعالية
 * DELETE /manager/events/:id
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/manager/events/${eventId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Event Scanners Management ====================

/**
 * POST - إضافة ماسحات للفعالية (bulk)
 * POST /manager/events/:eventId/scanners/bulk
 */
export const addEventScanners = async (eventId, scannersData) => {
  try {
    const response = await api.post(`/manager/events/${eventId}/scanners/bulk`, scannersData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - عرض الماسحات المرتبطة بالفعالية
 * GET /manager/events/:eventId/scanners
 */
export const getEventScanners = async (eventId) => {
  try {
    const response = await api.get(`/manager/events/${eventId}/scanners`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف ماسح من الفعالية
 * DELETE /manager/events/scanners/:assignmentId
 */
export const removeEventScanner = async (assignmentId) => {
  try {
    const response = await api.delete(`/manager/events/scanners/${assignmentId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Clients Management ====================

/**
 * GET - عرض جميع العملاء
 * GET /manager/clients
 */
export const getClients = async (params = {}) => {
  try {
    const response = await api.get('/manager/clients', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل عميل
 * GET /manager/clients/:id
 */
export const getClientById = async (clientId) => {
  try {
    const response = await api.get(`/manager/clients/${clientId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة عميل جديد
 * POST /manager/clients
 */
export const createClient = async (clientData) => {
  try {
    const response = await api.post('/manager/clients', clientData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل عميل
 * PUT /manager/clients/:id
 */
export const updateClient = async (clientId, clientData) => {
  try {
    const response = await api.put(`/manager/clients/${clientId}`, clientData)
    return response.data
  } catch (error) {
    throw error
  }
}


// ==================== Complaints Management ====================

/**
 * GET - عرض الشكاوى
 * GET /manager/complaints
 */
export const getManagerComplaints = async (params = {}) => {
  try {
    const response = await api.get('/manager/complaints', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل شكوى
 * GET /manager/complaints/:id
 */
export const getComplaintById = async (complaintId) => {
  try {
    const response = await api.get(`/manager/complaints/${complaintId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة شكوى
 * POST /manager/complaints
 */
export const createComplaint = async (complaintData) => {
  try {
    const response = await api.post('/manager/complaints', complaintData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تحديث شكوى
 * PUT /manager/complaints/:id
 */
export const updateComplaint = async (complaintId, complaintData) => {
  try {
    const response = await api.put(`/manager/complaints/${complaintId}`, complaintData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف شكوى
 * DELETE /manager/complaints/:id
 */
export const deleteComplaint = async (complaintId) => {
  try {
    const response = await api.delete(`/manager/complaints/${complaintId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Dashboard ====================

/**
 * GET - لوحة التحكم
 * GET /manager/dashboard
 */
export const getManagerDashboard = async () => {
  try {
    const response = await api.get('/manager/dashboard')
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Reports ====================

/**
 * GET - التقارير
 * GET /manager/reports
 */
export const getManagerReports = async (params = {}) => {
  try {
    const response = await api.get('/manager/reports', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// Export all functions
export default {
  // Hall
  getManagerHall,
  updateHallInfo,
  addHallService,
  updateHallService,
  deleteHallService,

  // Events
  getManagerEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  
  // Event Scanners
  addEventScanners,
  getEventScanners,
  removeEventScanner,

  // Clients
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,

  // Staff
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,

  // Templates
  listManagerTemplates,
  addManagerTemplate,
  editManagerTemplate,
  deleteManagerTemplate,

  // Invoices
  getManagerInvoices,
  createManagerInvoice,
  updateManagerInvoice,
  recordInvoicePayment,

  // Transactions
  createTransaction,
  updateTransaction,

  // Complaints
  getManagerComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint,

  // Dashboard
  getManagerDashboard,

  // Reports
  getManagerReports
}