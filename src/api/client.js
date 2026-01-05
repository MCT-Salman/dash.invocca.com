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
 * PUT /client/events/songs/:songId
 */
export const updateSong = async (songId, songData) => {
  try {
    const response = await api.put(`/client/events/songs/${songId}`, songData)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * DELETE - حذف أغنية
 * DELETE /client/events/songs/:songId
 */
export const deleteSong = async songId => {
  try {
    const response = await api.delete(`/client/events/songs/${songId}`)
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

  // Reports
  getClientReports,
}
