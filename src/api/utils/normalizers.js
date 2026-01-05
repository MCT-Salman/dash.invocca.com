// src\api\utils\normalizers.js
/**
 * Data Normalization Utilities
 * دوال توحيد البيانات القادمة من API
 * تجنب التكرار في admin.js و manager.js
 */

import { toYMDDamascus } from '@/utils/helpers'

// ═══════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════

/**
 * Convert value to number safely
 * @param {*} value - Value to convert
 * @returns {number} Number or 0
 */
function toNumber(value) {
    return typeof value === 'number' ? value : Number(value) || 0
}

/**
 * Pick first available key from object
 * @param {Object} obj - Object to search
 * @param {Array} keys - Array of possible keys
 * @returns {string|undefined} First found key
 */
function pickKey(obj, keys) {
    return keys.find(k => obj && obj[k] !== undefined)
}

/**
 * Get array from value (handles different API response formats)
 * @param {*} value - Value to convert
 * @returns {Array} Array
 */
function toArray(value) {
    if (Array.isArray(value)) return value
    if (value && Array.isArray(value.items)) return value.items
    if (value && Array.isArray(value.data)) return value.data
    return []
}

// ═══════════════════════════════════════════════════════════
// Dashboard Statistics Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize dashboard statistics
 * Works for both admin and manager dashboards
 * @param {Object} data - Raw API response
 * @returns {Object} Normalized statistics
 */
export function normalizeDashboardStats(data) {
    if (!data) return {}

    // Handle nested stats object
    const root = data.stats && typeof data.stats === 'object' ? data.stats : data

    // Find keys for different statistics
    const totalHallsKey = pickKey(root, ['totalHalls', 'total_halls', 'hallsCount'])
    const totalUsersKey = pickKey(root, ['totalUsers', 'total_users', 'usersCount'])
    const totalEventsKey = pickKey(root, ['totalEvents', 'total_events', 'eventsCount'])
    const todayBookingsKey = pickKey(root, ['todayBookings', 'today_bookings', 'bookingsToday', 'todayEvents'])
    const activeBookingsKey = pickKey(root, ['activeBookings', 'active_bookings', 'bookingsActive', 'activeEvents'])
    const totalClientsKey = pickKey(root, ['totalClients', 'total_clients', 'clientsCount'])
    const monthlyRevenueKey = pickKey(root, ['monthlyRevenue', 'monthly_revenue', 'revenueMonthly'])
    const recentKey = pickKey(root, ['recentActivities', 'recent_activities', 'recentBookings', 'recent_bookings', 'recent'])
    const hallKey = pickKey(root, ['hallInfo', 'hall_info', 'hall'])

    // Normalize recent activities/bookings
    const recentRaw = recentKey ? root[recentKey] : []
    const recentActivities = normalizeRecentActivities(recentRaw)

    // Normalize hall info (for manager dashboard)
    const hallRaw = hallKey ? root[hallKey] : null
    const hallInfo = hallRaw ? normalizeHallInfo(hallRaw) : undefined

    return {
        totalHalls: toNumber(root[totalHallsKey]),
        totalUsers: toNumber(root[totalUsersKey]),
        totalEvents: toNumber(root[totalEventsKey]),
        todayBookings: toNumber(root[todayBookingsKey]),
        activeBookings: toNumber(root[activeBookingsKey]),
        totalClients: toNumber(root[totalClientsKey]),
        monthlyRevenue: toNumber(root[monthlyRevenueKey]),
        recentActivities,
        hallInfo,
    }
}

/**
 * Normalize recent activities/bookings
 * @param {Array|Object} data - Raw activities data
 * @returns {Array} Normalized activities
 */
export function normalizeRecentActivities(data) {
    const items = toArray(data)

    return items.map(item => ({
        id: item.id || item._id,
        title: item.title || item.eventName || item.event_name || '',
        clientName: item.clientName || item.client_name || item.client || item.customerName || item.customer_name || item.userName || item.user_name || item.name || '',
        eventType: item.eventType || item.event_type || item.type || item.action || '',
        date: extractDate(item),
        status: item.status || item.state || '',
        address: item.address || item.location || item.hallAddress || item.hall_address || '',
        peopleCount: item.numOfPeople ?? item.num_of_people ?? item.peopleCount ?? item.chairsCount ?? item.chairs_count ?? null,
        phone: item.phone || item.clientPhone || item.client_phone || '',
        startTime: item.startTime || item.start_time || '',
        endTime: item.endTime || item.end_time || '',
        templateName: item.templateName || item.template_name || '',
    }))
}

/**
 * Normalize hall information
 * @param {Object} data - Raw hall data
 * @returns {Object} Normalized hall info
 */
export function normalizeHallInfo(data) {
    if (!data) return null

    return {
        id: data.id || data._id,
        name: data.name || '',
        location: data.location || '',
        capacity: toNumber(data.capacity),
        tables: data.tables ?? data.tablesCount ?? data.tables_count ?? 0,
        chairs: data.chairs ?? data.chairsCount ?? data.chairs_count ?? 0,
        maxEmployees: toNumber(data.maxEmployees ?? data.max_employees),
        defaultPrices: data.defaultPrices ?? data.default_prices ?? data.prices ?? 0,
        description: data.description || '',
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        wings: data.wings ?? data.sections ?? [],
    }
}

// ═══════════════════════════════════════════════════════════
// Event/Booking Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize event/booking data
 * @param {Object} data - Raw event data
 * @returns {Object} Normalized event
 */
export function normalizeEvent(data) {
    if (!data) return null

    return {
        id: data.id || data._id,
        eventName: data.eventName || data.event_name || data.name || '',
        eventType: data.eventType || data.event_type || data.type || '',
        eventDate: data.eventDate || data.event_date || data.date || null,
        startTime: data.startTime || data.start_time || '',
        endTime: data.endTime || data.end_time || '',
        status: data.status || '',
        clientName: data.clientName || data.client_name || data.client || '',
        clientPhone: data.clientPhone || data.client_phone || data.phone || '',
        numOfPeople: data.numOfPeople ?? data.num_of_people ?? data.chairsCount ?? data.chairs_count ?? 0,
        chairsCount: data.chairsCount ?? data.chairs_count ?? data.numOfPeople ?? data.num_of_people ?? 0,
        templateId: data.templateId || data.template_id || null,
        templateName: data.templateName || data.template_name || '',
        hallId: data.hallId || data.hall_id || null,
        hallName: data.hallName || data.hall_name || '',
        address: data.address || data.location || '',
        notes: data.notes || '',
        createdAt: data.createdAt || data.created_at || null,
        updatedAt: data.updatedAt || data.updated_at || null,
    }
}

/**
 * Normalize events list
 * @param {Array|Object} data - Raw events data
 * @returns {Array} Normalized events
 */
export function normalizeEvents(data) {
    const items = toArray(data)
    return items.map(normalizeEvent)
}

// ═══════════════════════════════════════════════════════════
// User Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize user data
 * @param {Object} data - Raw user data
 * @returns {Object} Normalized user
 */
export function normalizeUser(data) {
    if (!data) return null

    return {
        id: data.id || data._id,
        name: data.name || data.fullName || data.full_name || '',
        phone: data.phone || '',
        email: data.email || '',
        role: data.role || '',
        isActive: data.isActive ?? data.is_active ?? true,
        hallId: data.hallId || data.hall_id || null,
        hallName: data.hallName || data.hall_name || '',
        createdAt: data.createdAt || data.created_at || null,
        lastLogin: data.lastLogin || data.last_login || null,
    }
}

/**
 * Normalize users list
 * @param {Array|Object} data - Raw users data
 * @returns {Array} Normalized users
 */
export function normalizeUsers(data) {
    const items = toArray(data)
    return items.map(normalizeUser)
}

// ═══════════════════════════════════════════════════════════
// Hall Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize hall data
 * @param {Object} data - Raw hall data
 * @returns {Object} Normalized hall
 */
export function normalizeHall(data) {
    if (!data) return null

    return {
        id: data.id || data._id,
        name: data.name || '',
        location: data.location || '',
        capacity: toNumber(data.capacity),
        tables: toNumber(data.tables ?? data.tablesCount ?? data.tables_count),
        chairs: toNumber(data.chairs ?? data.chairsCount ?? data.chairs_count),
        maxEmployees: toNumber(data.maxEmployees ?? data.max_employees),
        defaultPrices: data.defaultPrices ?? data.default_prices ?? data.prices ?? {},
        description: data.description || '',
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        images: Array.isArray(data.images) ? data.images : [],
        managerId: data.managerId || data.manager_id || null,
        managerName: data.managerName || data.manager_name || '',
        managerPhone: data.managerPhone || data.manager_phone || '',
        isActive: data.isActive ?? data.is_active ?? true,
        createdAt: data.createdAt || data.created_at || null,
    }
}

/**
 * Normalize halls list
 * @param {Array|Object} data - Raw halls data
 * @returns {Array} Normalized halls
 */
export function normalizeHalls(data) {
    const items = toArray(data)
    return items.map(normalizeHall)
}

// ═══════════════════════════════════════════════════════════
// Template Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize template data
 * @param {Object} data - Raw template data
 * @returns {Object} Normalized template
 */
export function normalizeTemplate(data) {
    if (!data) return null

    return {
        id: data.id || data._id,
        name: data.templateName || data.name || '',
        description: data.description || '',
        imageUrl: data.imageUrl || data.image_url || data.image || '',
        category: data.category || '',
        isActive: data.isActive ?? data.is_active ?? true,
        createdAt: data.createdAt || data.created_at || null,
        hallId: data.hallId || null,
    }
}

/**
 * Normalize templates list
 * @param {Array|Object} data - Raw templates data
 * @returns {Array} Normalized templates
 */
export function normalizeTemplates(data) {
    const items = toArray(data)
    return items.map(normalizeTemplate)
}

// ═══════════════════════════════════════════════════════════
// Service Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize service data
 * @param {Object} data - Raw service data
 * @returns {Object} Normalized service
 */
export function normalizeService(data) {
    if (!data) return null

    return {
        id: data.id || data._id,
        name: data.name || '',
        category: data.category || '',
        basePrice: toNumber(data.basePrice ?? data.base_price),
        description: data.description || '',
        unit: data.unit || 'item',
        isActive: data.isActive ?? data.is_active ?? true,
        createdAt: data.createdAt || data.created_at || null,
    }
}

/**
 * Normalize services list
 * @param {Array|Object} data - Raw services data
 * @returns {Array} Normalized services
 */
export function normalizeServices(data) {
    const items = toArray(data)
    return items.map(normalizeService)
}

// ═══════════════════════════════════════════════════════════
// Complaint Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize complaint data
 * @param {Object} data - Raw complaint data
 * @returns {Object} Normalized complaint
 */
export function normalizeComplaint(data) {
    if (!data) return null

    return {
        id: data.id || data._id,
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        userId: data.userId || data.user_id || null,
        userName: data.userName || data.user_name || '',
        userPhone: data.userPhone || data.user_phone || '',
        hallId: data.hallId || data.hall_id || null,
        hallName: data.hallName || data.hall_name || '',
        response: data.response || '',
        createdAt: data.createdAt || data.created_at || null,
        updatedAt: data.updatedAt || data.updated_at || null,
        resolvedAt: data.resolvedAt || data.resolved_at || null,
    }
}

/**
 * Normalize complaints list
 * @param {Array|Object} data - Raw complaints data
 * @returns {Array} Normalized complaints
 */
export function normalizeComplaints(data) {
    const items = toArray(data)
    return items.map(normalizeComplaint)
}

// ═══════════════════════════════════════════════════════════
// Reports Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize reports data
 * @param {Object} data - Raw reports data
 * @returns {Object} Normalized reports
 */
export function normalizeReports(data) {
    if (!data) return {}

    // Normalize invitation stats
    const invRaw = data.invitationStats || {}
    const totalInvitations = toNumber(invRaw.totalInvitations)
    const usedInvitations = toNumber(invRaw.usedInvitations)
    const totalGuests = toNumber(invRaw.totalGuests)
    const attendanceRate = totalInvitations > 0
        ? ((usedInvitations / totalInvitations) * 100).toFixed(2) + '%'
        : '0%'

    return {
        period: data.period || 'month',
        hallsWithDetails: toArray(data.hallsWithDetails),
        usersByRole: toArray(data.usersByRole),
        eventsByHall: toArray(data.eventsByHall),
        monthlyRevenueByHall: toArray(data.monthlyRevenueByHall),
        recentActivities: toArray(data.recentActivities),
        events: toArray(data.events),
        revenueByPeriod: toArray(data.revenueByPeriod),
        invitationStats: {
            totalInvitations,
            usedInvitations,
            totalGuests,
            attendanceRate,
        },
    }
}

// ═══════════════════════════════════════════════════════════
// Pagination Normalization
// ═══════════════════════════════════════════════════════════

/**
 * Normalize pagination data
 * @param {Object} data - Raw pagination data
 * @returns {Object} Normalized pagination
 */
export function normalizePagination(data) {
    if (!data) return null

    return {
        currentPage: toNumber(data.currentPage ?? data.current_page ?? data.page ?? 1),
        totalPages: toNumber(data.totalPages ?? data.total_pages ?? data.pages ?? 1),
        totalItems: toNumber(data.totalItems ?? data.total_items ?? data.total ?? data.count ?? 0),
        itemsPerPage: toNumber(data.itemsPerPage ?? data.items_per_page ?? data.limit ?? data.perPage ?? 10),
        hasNextPage: data.hasNextPage ?? data.has_next_page ?? false,
        hasPrevPage: data.hasPrevPage ?? data.has_prev_page ?? false,
    }
}

// ═══════════════════════════════════════════════════════════
// Helper: Extract Date
// ═══════════════════════════════════════════════════════════

/**
 * Extract date from various possible fields
 * @param {Object} item - Item with date field
 * @returns {string|null} Extracted date
 */
function extractDate(item) {
    return item.date ||
        item.eventDate ||
        item.event_date ||
        item.createdAt ||
        item.created_at ||
        null
}

// ═══════════════════════════════════════════════════════════
// Fallback Computations
// ═══════════════════════════════════════════════════════════

/**
 * Compute missing dashboard statistics from events
 * @param {Array} events - Events array
 * @returns {Object} Computed statistics
 */
export function computeStatsFromEvents(events) {
    if (!Array.isArray(events) || events.length === 0) {
        return {
            todayBookings: 0,
            activeBookings: 0,
            totalEvents: 0,
        }
    }

    const todayStr = toYMDDamascus(new Date())
    const getDate = (e) => extractDate(e)
    const status = (s) => (s || '').toLowerCase()

    return {
        totalEvents: events.length,
        todayBookings: events.filter(e => toYMDDamascus(getDate(e)) === todayStr).length,
        activeBookings: events.filter(e =>
            ['confirmed', 'active', 'ongoing'].includes(status(e.status))
        ).length,
    }
}

/**
 * Get recent bookings from events
 * @param {Array} events - Events array
 * @param {number} limit - Number of recent items
 * @returns {Array} Recent bookings
 */
export function getRecentBookingsFromEvents(events, limit = 5) {
    if (!Array.isArray(events) || events.length === 0) {
        return []
    }

    const toTime = (v) => {
        const d = new Date(v)
        return isNaN(d) ? 0 : d.getTime()
    }

    return [...events]
        .sort((a, b) => toTime(extractDate(b)) - toTime(extractDate(a)))
        .slice(0, limit)
        .map(normalizeEvent)
}
