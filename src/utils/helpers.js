// src\utils\helpers.js
/**
 * Utility Functions
 * دوال مساعدة قابلة لإعادة الاستخدام
 */

import dayjs from 'dayjs'
import { DATE_FORMATS, TIME_FORMATS, TIMEZONE } from '@/config/constants'
import clsx from 'clsx'

// ═══════════════════════════════════════════════════════════
// ClassName Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Merge classNames with clsx
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
    return clsx(inputs)
}

// ═══════════════════════════════════════════════════════════
// Date & Time Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Format date to display format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (optional)
 * @returns {string} Formatted date
 */
export function formatDate(date, format = DATE_FORMATS.DISPLAY) {
    if (!date) return ''
    return dayjs(date).format(format)
}

/**
 * Format time to display format
 * @param {string|Date} time - Time to format
 * @param {string} format - Format string (optional)
 * @returns {string} Formatted time
 */
export function formatTime(time, format = TIME_FORMATS.DISPLAY) {
    if (!time) return ''
    return dayjs(time).format(format)
}

/**
 * Format date and time together
 * @param {string|Date} dateTime - DateTime to format
 * @returns {string} Formatted date and time
 */
export function formatDateTime(dateTime) {
    if (!dateTime) return ''
    return dayjs(dateTime).format(DATE_FORMATS.DISPLAY_WITH_TIME)
}

/**
 * Convert date to Damascus timezone YYYY-MM-DD format
 * @param {string|Date} dateLike - Date to convert
 * @returns {string|null} Formatted date or null
 */
export function toYMDDamascus(dateLike) {
    if (!dateLike) return null

    try {
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: TIMEZONE,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        return formatter.format(new Date(dateLike))
    } catch {
        return null
    }
}

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
    if (!date) return false
    return toYMDDamascus(date) === toYMDDamascus(new Date())
}

/**
 * Get relative time (e.g., "منذ ساعتين")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
    if (!date) return ''

    const now = dayjs()
    const then = dayjs(date)
    const diffMinutes = now.diff(then, 'minute')
    const diffHours = now.diff(then, 'hour')
    const diffDays = now.diff(then, 'day')

    if (diffMinutes < 1) return 'الآن'
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`
    if (diffHours < 24) return `منذ ${diffHours} ساعة`
    if (diffDays < 7) return `منذ ${diffDays} يوم`

    return formatDate(date)
}

// ═══════════════════════════════════════════════════════════
// Number & Currency Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
    if (num === null || num === undefined) return '0'
    return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format currency (Syrian Pound)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: SYP)
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0 ل.س'

    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)

    return `${formatted} ل.س`
}

/**
 * Parse number from string
 * @param {string} str - String to parse
 * @returns {number} Parsed number or 0
 */
export function parseNumber(str) {
    const num = Number(str)
    return isNaN(num) ? 0 : num
}

// ═══════════════════════════════════════════════════════════
// String Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength, suffix = '...') {
    if (!str) return ''
    if (str.length <= maxLength) return str
    return str.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert string to slug (URL-friendly)
 * @param {string} str - String to convert
 * @returns {string} Slug string
 */
export function slugify(str) {
    if (!str) return ''

    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// ═══════════════════════════════════════════════════════════
// Validation Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Validate phone number (Syrian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function isValidPhone(phone) {
    if (!phone) return false
    return /^(09|07)\d{8}$/.test(phone)
}

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
    if (!email) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with strength level
 */
export function validatePassword(password) {
    if (!password) {
        return { isValid: false, strength: 'weak', message: 'كلمة المرور مطلوبة' }
    }

    if (password.length < 6) {
        return { isValid: false, strength: 'weak', message: 'كلمة المرور قصيرة جداً' }
    }

    if (password.length < 8) {
        return { isValid: true, strength: 'medium', message: 'كلمة مرور متوسطة' }
    }

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length

    if (strength >= 3) {
        return { isValid: true, strength: 'strong', message: 'كلمة مرور قوية' }
    }

    return { isValid: true, strength: 'medium', message: 'كلمة مرور متوسطة' }
}

// ═══════════════════════════════════════════════════════════
// Array Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Remove duplicates from array
 * @param {Array} arr - Array to process
 * @param {string} key - Key to use for comparison (optional)
 * @returns {Array} Array without duplicates
 */
export function removeDuplicates(arr, key = null) {
    if (!Array.isArray(arr)) return []

    if (key) {
        const seen = new Set()
        return arr.filter(item => {
            const value = item[key]
            if (seen.has(value)) return false
            seen.add(value)
            return true
        })
    }

    return [...new Set(arr)]
}

/**
 * Sort array by key
 * @param {Array} arr - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export function sortBy(arr, key, order = 'asc') {
    if (!Array.isArray(arr)) return []

    return [...arr].sort((a, b) => {
        const aVal = a[key]
        const bVal = b[key]

        if (aVal < bVal) return order === 'asc' ? -1 : 1
        if (aVal > bVal) return order === 'asc' ? 1 : -1
        return 0
    })
}

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export function groupBy(arr, key) {
    if (!Array.isArray(arr)) return {}

    return arr.reduce((result, item) => {
        const groupKey = item[key]
        if (!result[groupKey]) {
            result[groupKey] = []
        }
        result[groupKey].push(item)
        return result
    }, {})
}

// ═══════════════════════════════════════════════════════════
// Object Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    try {
        return JSON.parse(JSON.stringify(obj))
    } catch {
        // If JSON.stringify fails (circular reference), return a shallow copy
        if (Array.isArray(obj)) {
            return [...obj]
        }
        return { ...obj }
    }
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export function isEmpty(obj) {
    if (obj === null || obj === undefined) return true
    if (Array.isArray(obj)) return obj.length === 0
    if (typeof obj === 'object') return Object.keys(obj).length === 0
    return false
}

/**
 * Pick specific keys from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object} New object with picked keys
 */
export function pick(obj, keys) {
    if (!obj || !Array.isArray(keys)) return {}

    return keys.reduce((result, key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = obj[key]
        }
        return result
    }, {})
}
/**
 * Omit specific keys from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to omit
 * @returns {Object} New object without omitted keys
 */
export function omit(obj, keys) {
    if (!obj || !Array.isArray(keys)) return obj

    const result = { ...obj }
    keys.forEach(key => delete result[key])
    return result
}

// ═══════════════════════════════════════════════════════════
// File Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Format file size to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
export function getFileExtension(filename) {
    if (!filename) return ''
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * Check if file is image
 * @param {File|string} file - File object or filename
 * @returns {boolean} True if image
 */
export function isImageFile(file) {
    if (!file) return false

    if (typeof file === 'string') {
        const ext = getFileExtension(file).toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
    }

    return file.type?.startsWith('image/')
}

// ═══════════════════════════════════════════════════════════
// URL Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Get full image URL
 * @param {string} path - Image path
 * @returns {string} Full URL
 */
export function getImageUrl(path) {
    if (!path) return ''
    if (path.startsWith('http')) return path
    if (path.startsWith('data:')) return path
    if (path.startsWith('blob:')) return path

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    // Use API_CONFIG.BASE_URL directly if possible, otherwise rely on import
    const baseUrl = import.meta.env.VITE_API_BASE || 'http://82.137.244.167:5001'

    return `${baseUrl}/uploads/${cleanPath}`
}

/**
 * Format empty/null/undefined values to display text
 * @param {any} value - Value to format
 * @param {string} fallback - Fallback text (default: '—')
 * @returns {string} Formatted value or fallback
 */
export function formatEmptyValue(value, fallback = '—') {
    if (value === null || value === undefined || value === '' || value === 'N/A' || value === 'غير محدد' || value === 'غير متوفر' || value === 'لا يوجد') {
        return fallback
    }
    return value
}

/**
 * Format value with fallback for empty values
 * @param {any} value - Value to format
 * @param {string} fallback - Fallback text (default: '—')
 * @returns {string} Formatted value or fallback
 */
export function getValueOrFallback(value, fallback = '—') {
    return formatEmptyValue(value, fallback)
}

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export function buildQueryString(params) {
    if (!params || isEmpty(params)) return ''

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value)
        }
    })

    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ''
}

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {Object} Parameters object
 */
export function parseQueryString(queryString) {
    if (!queryString) return {}

    const params = new URLSearchParams(queryString)
    const result = {}

    for (const [key, value] of params.entries()) {
        result[key] = value
    }

    return result
}

// ═══════════════════════════════════════════════════════════
// Storage Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Safe localStorage get
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export function getStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key)
        if (!item) return defaultValue
        try {
            return JSON.parse(item)
        } catch {
            // If JSON.parse fails, return the raw string
            return item
        }
    } catch {
        return defaultValue
    }
}

/**
 * Safe localStorage set
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export function setStorageItem(key, value) {
    try {
        // Only stringify if value is not already a string and is serializable
        if (typeof value === 'string') {
            localStorage.setItem(key, value)
        } else {
            // Try to stringify, but catch circular reference errors
            try {
                localStorage.setItem(key, JSON.stringify(value))
            } catch {
                // If stringify fails, convert to string representation
                localStorage.setItem(key, String(value))
            }
        }
    } catch {
        // Error saving to localStorage - silently fail
    }
}

/**
 * Safe localStorage remove
 * @param {string} key - Storage key
 */
export function removeStorageItem(key) {
    try {
        localStorage.removeItem(key)
    } catch {
        // Error removing from localStorage - silently fail
    }
}

// ═══════════════════════════════════════════════════════════
// Miscellaneous Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Generate random ID
 * @param {number} length - ID length (default: 8)
 * @returns {string} Random ID
 */
export function generateId(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
    let inThrottle

    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


export const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`
    }
    return phone
}

export const generateExportFileName = (type) => {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-')
    return `${type}_${dateStr}_${timeStr}.xlsx`
}

/**
 * تقصير النص وإضافة نقاط إذا كان طويلاً
 * @param {string} text - النص المراد تقصيره
 * @param {number} maxLength - الحد الأقصى لطول النص
 * @returns {string} النص المقصوص
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || typeof text !== 'string') return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

/**
 * Translate permission to Arabic
 * ترجمة الصلاحية إلى العربية
 * @param {string} permission - Permission string (e.g., "manage_users", "view_reports")
 * @returns {string} Arabic translation
 */
export function translatePermission(permission) {
    if (!permission) return ''
    
    const permissionMap = {
        // User Management
        'manage_users': 'إدارة المستخدمين',
        'view_users': 'عرض المستخدمين',
        'create_users': 'إنشاء مستخدمين',
        'edit_users': 'تعديل المستخدمين',
        'delete_users': 'حذف المستخدمين',
        'manage_managers': 'إدارة المدراء',
        
        // Hall Management
        'manage_halls': 'إدارة الصالات',
        'view_halls': 'عرض الصالات',
        'create_halls': 'إنشاء صالات',
        'edit_halls': 'تعديل الصالات',
        'delete_halls': 'حذف الصالات',
        'view_hall_clients': 'عرض عملاء القاعة',
        'view_hall_complaints': 'عرض شكاوى القاعة',
        'manage_hall_templates': 'إدارة قوالب القاعة',
        
        // Event Management
        'manage_events': 'إدارة الفعاليات',
        'view_events': 'عرض الفعاليات',
        'create_events': 'إنشاء فعاليات',
        'edit_events': 'تعديل الفعاليات',
        'delete_events': 'حذف الفعاليات',
        'view_own_events': 'عرض فعالياتي',
        
        // Reports
        'view_reports': 'عرض التقارير',
        'view_financial_reports': 'عرض التقارير المالية',
        'view_event_reports': 'عرض تقارير الفعاليات',
        'view_user_reports': 'عرض تقارير المستخدمين',
        'view_all_stats': 'عرض جميع الإحصائيات',
        
        // Services
        'manage_services': 'إدارة الخدمات',
        'view_services': 'عرض الخدمات',
        'create_services': 'إنشاء خدمات',
        'edit_services': 'تعديل الخدمات',
        'delete_services': 'حذف الخدمات',
        
        // Templates
        'manage_templates': 'إدارة القوالب',
        'view_templates': 'عرض القوالب',
        'create_templates': 'إنشاء قوالب',
        'edit_templates': 'تعديل القوالب',
        'delete_templates': 'حذف القوالب',
        
        // Staff Management
        'manage_staff': 'إدارة الموظفين',
        'view_staff': 'عرض الموظفين',
        'create_staff': 'إنشاء موظفين',
        'edit_staff': 'تعديل الموظفين',
        'delete_staff': 'حذف الموظفين',
        
        // Clients Management
        'manage_clients': 'إدارة العملاء',
        'view_clients': 'عرض العملاء',
        'create_clients': 'إنشاء عملاء',
        'edit_clients': 'تعديل العملاء',
        'delete_clients': 'حذف العملاء',
        
        // Complaints
        'manage_complaints': 'إدارة الشكاوى',
        'view_complaints': 'عرض الشكاوى',
        'respond_complaints': 'الرد على الشكاوى',
        
        // Financial
        'manage_financial': 'إدارة المالية',
        'view_financial': 'عرض المالية',
        'create_invoices': 'إنشاء فواتير',
        'edit_invoices': 'تعديل الفواتير',
        'delete_invoices': 'حذف الفواتير',
        
        // Invitations
        'manage_invitations': 'إدارة الدعوات',
        'view_invitations': 'عرض الدعوات',
        'create_invitations': 'إنشاء دعوات',
        'edit_invitations': 'تعديل الدعوات',
        'delete_invitations': 'حذف الدعوات',
        
        // Scanner
        'scan_qr': 'مسح QR',
        'scan_qr_codes': 'مسح رموز QR',
        'view_scanner': 'عرض الماسح',
        'view_event_invitations': 'عرض دعوات الفعاليات',
        
        // Admin
        'admin_access': 'وصول إداري',
        'full_access': 'وصول كامل',
    }
    
    // Resource translations
    const resourceMap = {
        'managers': 'المدراء',
        'manager': 'المدراء',
        'all_stats': 'جميع الإحصائيات',
        'all stats': 'جميع الإحصائيات',
        'own_events': 'فعالياتي',
        'own events': 'فعالياتي',
        'hall_templates': 'قوالب القاعة',
        'hall templates': 'قوالب القاعة',
        'hall_clients': 'عملاء القاعة',
        'hall clients': 'عملاء القاعة',
        'hall_complaints': 'شكاوى القاعة',
        'hall complaints': 'شكاوى القاعة',
        'templates': 'القوالب',
        'template': 'القوالب',
    }
    
    // Check if exact match exists
    if (permissionMap[permission]) {
        return permissionMap[permission]
    }
    
    // Try to match by pattern
    const lowerPermission = permission.toLowerCase().trim()
    
    // Helper function to translate resource
    const translateResource = (resource) => {
        const cleanResource = resource.trim().toLowerCase()
        if (resourceMap[cleanResource]) {
            return resourceMap[cleanResource]
        }
        // Try with underscores
        const withUnderscores = cleanResource.replace(/\s+/g, '_')
        if (resourceMap[withUnderscores]) {
            return resourceMap[withUnderscores]
        }
        // Try with spaces
        const withSpaces = cleanResource.replace(/_/g, ' ')
        if (resourceMap[withSpaces]) {
            return resourceMap[withSpaces]
        }
        // Default: capitalize first letter of each word
        return resource.split(/[\s_]+/).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
    }
    
    // Check for common patterns
    if (lowerPermission.startsWith('manage_') || lowerPermission.startsWith('manage ')) {
        const resource = lowerPermission.replace(/^manage[_ ]/, '').trim()
        const translatedResource = translateResource(resource)
        return `إدارة ${translatedResource}`
    }
    
    if (lowerPermission.startsWith('view_') || lowerPermission.startsWith('view ')) {
        const resource = lowerPermission.replace(/^view[_ ]/, '').trim()
        const translatedResource = translateResource(resource)
        return `عرض ${translatedResource}`
    }
    
    if (lowerPermission.startsWith('create_') || lowerPermission.startsWith('create ')) {
        const resource = lowerPermission.replace(/^create[_ ]/, '').trim()
        const translatedResource = translateResource(resource)
        return `إنشاء ${translatedResource}`
    }
    
    if (lowerPermission.startsWith('edit_') || lowerPermission.startsWith('edit ')) {
        const resource = lowerPermission.replace(/^edit[_ ]/, '').trim()
        const translatedResource = translateResource(resource)
        return `تعديل ${translatedResource}`
    }
    
    if (lowerPermission.startsWith('delete_') || lowerPermission.startsWith('delete ')) {
        const resource = lowerPermission.replace(/^delete[_ ]/, '').trim()
        const translatedResource = translateResource(resource)
        return `حذف ${translatedResource}`
    }
    
    // Check if it's just a resource name
    if (resourceMap[lowerPermission] || resourceMap[lowerPermission.replace(/_/g, ' ')]) {
        return resourceMap[lowerPermission] || resourceMap[lowerPermission.replace(/_/g, ' ')]
    }
    
    // Fallback: format as readable text
    return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}