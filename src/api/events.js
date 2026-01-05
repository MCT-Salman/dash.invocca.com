// src\api\events.js
import api from './apiClient'

/**
 * Events Management APIs
 * إدارة الفعاليات - مشترك بين Manager و Client
 */

// ==================== Manager Events APIs ====================

/**
 * GET - عرض جميع الفعاليات (للمدير)
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
 * GET - تفاصيل فعالية (للمدير)
 * GET /manager/events/:id
 */
export const getManagerEventById = async (eventId) => {
  try {
    const response = await api.get(`/manager/events/${eventId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة فعالية جديدة (للمدير)
 * POST /manager/events
 */
export const createManagerEvent = async (eventData) => {
  try {
    const response = await api.post('/manager/events', eventData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل فعالية (للمدير)
 * PUT /manager/events/:id
 */
export const updateManagerEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/manager/events/${eventId}`, eventData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف فعالية (للمدير)
 * DELETE /manager/events/:id
 */
export const deleteManagerEvent = async (eventId) => {
  try {
    const response = await api.delete(`/manager/events/${eventId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Client Events APIs ====================

/**
 * GET - عرض فعاليات العميل
 * GET /client/events
 */
export const getClientEvents = async (params = {}) => {
  try {
    // Only use params if it's a plain object with query parameters
    // Ignore React Query's internal parameters (queryKey, signal, etc.)
    const queryParams = params && typeof params === 'object' && !Array.isArray(params) && !params.queryKey && !params.signal
      ? params
      : {}
    const response = await api.get('/client/events', { params: queryParams })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل فعالية (للعميل)
 * GET /client/events/:id
 */
export const getClientEventById = async (eventId) => {
  try {
    const response = await api.get(`/client/events/${eventId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Event Types & Categories ====================

/**
 * Get event types
 * الحصول على أنواع الفعاليات
 */
export const getEventTypes = () => {
  return [
    { value: 'wedding', label: 'حفل زفاف', icon: '💍' },
    { value: 'engagement', label: 'حفل خطوبة', icon: '💐' },
    { value: 'birthday', label: 'عيد ميلاد', icon: '🎂' },
    { value: 'graduation', label: 'حفل تخرج', icon: '🎓' },
    { value: 'corporate', label: 'فعالية شركات', icon: '🏢' },
    { value: 'conference', label: 'مؤتمر', icon: '📊' },
    { value: 'party', label: 'حفلة', icon: '🎉' },
    { value: 'other', label: 'أخرى', icon: '🎪' }
  ]
}

/**
 * Get event statuses
 * الحصول على حالات الفعاليات
 */
export const getEventStatuses = () => {
  return [
    { value: 'pending', label: 'قيد الانتظار', color: 'warning' },
    { value: 'confirmed', label: 'مؤكد', color: 'info' },
    { value: 'in_progress', label: 'جاري', color: 'primary' },
    { value: 'completed', label: 'مكتمل', color: 'success' },
    { value: 'cancelled', label: 'ملغي', color: 'error' }
  ]
}

// Export all functions
export default {
  // Manager
  getManagerEvents,
  getManagerEventById,
  createManagerEvent,
  updateManagerEvent,
  deleteManagerEvent,
  
  // Client
  getClientEvents,
  getClientEventById,
  
  // Helpers
  getEventTypes,
  getEventStatuses
}

