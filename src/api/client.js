// src\api\client.js
import api from './apiClient'

// ==================== Invitations Management ====================

/**
 * GET - عرض الدعوات
 * GET /client/invitations
 */
export const getInvitations = async () => {
  try {
    const response = await api.get('/client/invitations')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة دعوة
 * POST /client/invitations/add
 */
export const createInvitation = async invitationData => {
  try {
    const response = await api.post('/client/invitations/add', invitationData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل دعوة
 * PUT /client/invitations/edit/:id
 */
export const updateInvitation = async (invitationId, invitationData) => {
  try {
    const response = await api.put(`/client/invitations/edit/${invitationId}`, invitationData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف دعوة
 * DELETE /client/invitations/delete/:id
 */
export const deleteInvitation = async invitationId => {
  try {
    const response = await api.delete(`/client/invitations/delete/${invitationId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Songs Management ====================

/**
 * GET - عرض أغاني القاعة المتاحة
 * GET /client/events/songs
 */
export const getHallSongsForClient = async () => {
  try {
    const response = await api.get('/client/events/songs')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - عرض أغاني الحدث
 * GET /client/events/:eventId/songs
 */
export const getEventSongs = async eventId => {
  try {
    const response = await api.get(`/client/events/${eventId}/songs`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة أغنية
 * POST /client/events/:eventId/songs
 */
export const addSong = async (eventId, songData) => {
  try {
    const response = await api.post(`/client/events/${eventId}/songs`, songData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Helper function to handle both eventId as first param or in data object
export const addSongToEvent = async (eventIdOrData, songData) => {
  // If first param is an object, it's the old format { eventId, ...data }
  if (typeof eventIdOrData === 'object' && eventIdOrData.eventId) {
    const { eventId, ...data } = eventIdOrData
    return addSong(eventId, data)
  }
  // Otherwise, it's the new format: eventId, songData
  return addSong(eventIdOrData, songData)
}

/**
 * GET - تفاصيل أغنية
 * GET /client/events/songs/:songId
 */
export const getSongById = async songId => {
  try {
    const response = await api.get(`/client/events/songs/${songId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل أغنية
 * PUT /client/events/:eventId/songs/:songId
 */
export const updateSong = async (eventId, songId, songData) => {
  try {
    const response = await api.put(`/client/events/${eventId}/songs/${songId}`, songData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف أغنية من قائمة تشغيل فعالية
 * DELETE /client/events/:eventId/songs/:playlistItemId
 */
export const deleteSong = async (eventId, playlistItemId) => {
  try {
    const response = await api.delete(`/client/events/${eventId}/songs/${playlistItemId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إعادة ترتيب الأغاني
 * POST /client/events/:eventId/songs/reorder
 */
export const reorderSongs = async (eventId, songOrders) => {
  try {
    const response = await api.post(`/client/events/${eventId}/songs/reorder`, { songOrders })
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Bookings Management ====================

/**
 * GET - عرض الحجوزات
 * GET /client/bookings
 */
export const getBookings = async (params = {}) => {
  try {
    // Only use params if it's a plain object with query parameters
    // Ignore React Query's internal parameters (queryKey, signal, etc.)
    const queryParams =
      params &&
      typeof params === 'object' &&
      !Array.isArray(params) &&
      !params.queryKey &&
      !params.signal
        ? params
        : {}
    const response = await api.get('/client/bookings', { params: queryParams })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تفاصيل حجز
 * GET /client/bookings/:id
 */
export const getBookingById = async bookingId => {
  try {
    const response = await api.get(`/client/bookings/${bookingId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة حجز جديد
 * POST /client/bookings
 */
export const createBooking = async bookingData => {
  try {
    const response = await api.post('/client/bookings', bookingData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل حجز
 * PUT /client/bookings/:id
 */
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await api.put(`/client/bookings/${bookingId}`, bookingData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف حجز
 * DELETE /client/bookings/:id
 */
export const deleteBooking = async bookingId => {
  try {
    const response = await api.delete(`/client/bookings/${bookingId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Dashboard ====================

/**
 * GET - لوحة التحكم
 * GET /client/dashboard
 */
export const getClientDashboard = async () => {
  try {
    const response = await api.get('/client/dashboard')
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Event Ratings (Client) ====================

/**
 * GET - عرض تقييم الفعالية
 * GET /client/events/:eventId/rating
 */
export const getEventRating = async (eventId) => {
  if (!eventId) throw new Error('eventId is required to get rating')
  try {
    const response = await api.get(`/client/events/${eventId}/rating`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * POST - إضافة تقييم للفعالية
 * POST /client/events/:eventId/rating
 */
export const addEventRating = async (eventId, ratingData) => {
  if (!eventId) throw new Error('eventId is required to add rating')
  try {
    const response = await api.post(`/client/events/${eventId}/rating`, ratingData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * PUT - تعديل تقييم الفعالية
 * PUT /client/events/:eventId/rating
 */
export const updateEventRating = async (eventId, ratingData) => {
  if (!eventId) throw new Error('eventId is required to update rating')
  try {
    const response = await api.put(`/client/events/${eventId}/rating`, ratingData)
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Templates Management ====================

/**
 * GET - جلب قالب واحد بالـ ID
 * GET /manager/templates/:id or /admin/templates/:id
 * أو جلب جميع القوالب والبحث عن القالب المطلوب
 */
export const getTemplateById = async (templateId) => {
  if (!templateId) return null
  
  // Try manager endpoint first (client may have access to their hall's templates)
  try {
    const response = await api.get(`/manager/templates/${templateId}`)
    return response.data
  } catch {
    // Try admin endpoint as fallback
    try {
      const response = await api.get(`/admin/templates/${templateId}`)
      return response.data
    } catch {
      // If single template endpoint doesn't work, try to get all templates and find the one we need
      try {
        const response = await api.get('/manager/templates')
        const templates = response.data?.templates || response.data?.data?.templates || response.data?.data || []
        if (Array.isArray(templates)) {
          const foundTemplate = templates.find(t => {
            const tId = t._id || t.id
            return tId && tId.toString() === templateId.toString()
          })
          if (foundTemplate) {
            return { template: foundTemplate, data: foundTemplate }
          }
        }
      } catch {
        // Try admin templates as last resort
        try {
          const response = await api.get('/admin/templates')
          const templates = response.data?.templates || response.data?.data?.templates || response.data?.data || []
          if (Array.isArray(templates)) {
            const foundTemplate = templates.find(t => {
              const tId = t._id || t.id
              return tId && tId.toString() === templateId.toString()
            })
            if (foundTemplate) {
              return { template: foundTemplate, data: foundTemplate }
            }
          }
        } catch (error) {
          console.warn(`Template ${templateId} not found:`, error)
          return null
        }
      }
      return null
    }
  }
}

/**
 * GET - عرض القوالب الخاصة بالدعوات/الفعالية
 * GET /client/templates
 * GET /client/events/:eventId/templates
 */
export const getClientTemplates = async () => {
  try {
    // Try different possible endpoints - client may have access to manager templates
    const endpoints = [
      '/client/templates',
      '/client/invitations/templates',
      '/client/events/templates',
      '/manager/templates', // Client may have access to manager templates for their hall
    ]
    
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint)
        console.log(`✅ Templates found at: ${endpoint}`, response.data)
        return response.data
      } catch {
        // Try next endpoint
        continue
      }
    }
    
    // If all endpoints fail, return empty array
    console.warn('Client templates endpoint not available. Tried:', endpoints)
    return { templates: [], data: { templates: [] } }
  } catch (error) {
    // If endpoint doesn't exist, return empty array
    console.warn('Client templates endpoint not available:', error)
    return { templates: [], data: { templates: [] } }
  }
}

// ==================== Reports ====================

/**
 * GET - التقارير
 * GET /client/reports
 */
export const getClientReports = async (params = {}) => {
  try {
    const response = await api.get('/client/reports', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// Export all functions
export default {
  // Invitations
  getInvitations,
  createInvitation,
  updateInvitation,
  deleteInvitation,

  // Songs
  getHallSongsForClient,
  getEventSongs,
  addSong,
  getSongById,
  updateSong,
  deleteSong,
  reorderSongs,

  // Bookings
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,

  // Dashboard
  getClientDashboard,
  getEventRating,
  addEventRating,
  updateEventRating,

  // Templates
  getClientTemplates,
  getTemplateById,

  // Reports
  getClientReports,
}
