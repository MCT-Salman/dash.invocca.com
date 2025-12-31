import api from './apiClient'

/**
 * Songs Management APIs
 * إدارة الأغاني للأحداث
 */

// ═══════════════════════════════════════════════════════════
// Manager Songs APIs - إدارة الأغاني للمدير
// ═══════════════════════════════════════════════════════════

/**
 * Get list of songs for an event
 * الحصول على قائمة الأغاني لحدث معين
 */
export const listEventSongs = (eventId) => {
    return api.get(`/manager/events/${eventId}/songs`).then(r => ({
        songs: r.data?.songs || r.data?.data || r.data || [],
        event: r.data?.event || null
    }))
}

/**
 * Get song details
 * الحصول على تفاصيل أغنية
 */
export const getSong = (songId) => {
    return api.get(`/manager/events/songs/${songId}`).then(r => r.data?.song || r.data)
}

/**
 * Add a new song to an event
 * إضافة أغنية جديدة لحدث
 */
export const addSong = (eventId, payload) => {
    const body = {
        title: payload.title,
        artist: payload.artist || '',
        duration: payload.duration || '',
        category: payload.category || 'general', // opening, dance, slow, general
        order: payload.order || 0,
        notes: payload.notes || ''
    }
    return api.post(`/manager/events/${eventId}/songs`, body).then(r => r.data)
}

/**
 * Update song details
 * تحديث تفاصيل أغنية
 */
export const updateSong = (songId, payload) => {
    const body = {
        title: payload.title,
        artist: payload.artist,
        duration: payload.duration,
        category: payload.category,
        order: payload.order,
        notes: payload.notes
    }
    return api.put(`/manager/events/songs/${songId}`, body).then(r => r.data)
}

/**
 * Delete a song
 * حذف أغنية
 */
export const deleteSong = (songId) => {
    return api.delete(`/manager/events/songs/${songId}`).then(r => r.data)
}

// ═══════════════════════════════════════════════════════════
// Client Songs APIs - إدارة الأغاني للعميل
// ═══════════════════════════════════════════════════════════

/**
 * Reorder songs for an event
 * إعادة ترتيب الأغاني لحدث
 */
export const reorderSongs = (eventId, songOrders) => {
    const body = {
        songOrders: Array.isArray(songOrders) ? songOrders : []
    }
    return api.post(`/client/events/${eventId}/songs/reorder`, body).then(r => r.data)
}

/**
 * Get list of songs for client's event
 * الحصول على قائمة الأغاني لحدث العميل
 */
export const getClientEventSongs = (eventId) => {
    return api.get(`/client/events/${eventId}/songs`).then(r => ({
        songs: r.data?.songs || r.data?.data || r.data || []
    }))
}

/**
 * Add a new song to an event (Client)
 * إضافة أغنية جديدة لحدث (للعميل)
 */
export const addClientSong = (eventId, payload) => {
    return api.post(`/client/events/${eventId}/songs`, payload).then(r => r.data)
}

/**
 * Get client song details
 * الحصول على تفاصيل الأغنية (للعميل)
 */
export const getClientSong = (songId) => {
    return api.get(`/client/events/songs/${songId}`).then(r => r.data?.data || r.data)
}

// ═══════════════════════════════════════════════════════════
// Helper Functions - دوال مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * Get song categories
 * الحصول على فئات الأغاني
 */
export const getSongCategories = () => {
    return [
        { value: 'opening', label: 'افتتاحية' },
        { value: 'dance', label: 'رقص' },
        { value: 'slow', label: 'هادئة' },
        { value: 'romantic', label: 'رومانسية' },
        { value: 'traditional', label: 'تراثية' },
        { value: 'general', label: 'عامة' }
    ]
}
