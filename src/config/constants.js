// src\config\constants.js
/**
 * Application Constants
 * جميع الثوابت المستخدمة في التطبيق
 */

// ═══════════════════════════════════════════════════════════
// API Configuration
// ═══════════════════════════════════════════════════════════

export const API_CONFIG = {
  // BASE_URL: import.meta.env.VITE_API_BASE || 'https://192.168.3.11',
  BASE_URL: import.meta.env.VITE_API_BASE || 'http://82.137.244.167:5001',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}

// ═══════════════════════════════════════════════════════════
// Application Routes
// ═══════════════════════════════════════════════════════════

export const ROUTES = {
  // Public Routes
  HOME: '/',
  LANDING: '/landing',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  NOT_FOUND: '/404',

  // Auth Routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USERS_DETAILS: '/admin/users/:id',
    MANAGERS: '/admin/managers',
    MANAGERS_ADD: '/admin/managers/add',
    MANAGERS_EDIT: '/admin/managers/:id/edit',
    HALLS: '/admin/halls',
    HALLS_ADD: '/admin/halls/add',
    HALLS_EDIT: '/admin/halls/:id/edit',
    HALLS_DETAILS: '/admin/halls/:id',
    TEMPLATES: '/admin/templates',
    TEMPLATES_ADD: '/admin/templates/add',
    TEMPLATES_EDIT: '/admin/templates/:id/edit',
    SERVICES: '/admin/services',
    SERVICES_ADD: '/admin/services/add',
    SERVICES_EDIT: '/admin/services/:id/edit',
    EVENTS: '/admin/events',
    CLIENTS: '/admin/clients',
    COMPLAINTS: '/admin/complaints',
    COMPLAINTS_DETAILS: '/admin/complaints/:id',
    REPORTS: '/admin/reports',
    PROFILE: '/admin/profile',
  },

  // Manager Routes
  MANAGER: {
    DASHBOARD: '/manager/dashboard',
    HALL: '/manager/hall',
    SERVICES: '/manager/services',
    SONGS: '/manager/songs',
    EVENTS: '/manager/events',
    EVENTS_ADD: '/manager/events/add',
    EVENTS_EDIT: '/manager/events/:id/edit',
    EVENTS_DETAILS: '/manager/events/:id',
    STAFF: '/manager/staff',
    STAFF_ADD: '/manager/staff/add',
    STAFF_EDIT: '/manager/staff/:id/edit',
    CLIENTS: '/manager/clients',
    TEMPLATES: '/manager/templates',
    TEMPLATES_ADD: '/manager/templates/add',
    TEMPLATES_EDIT: '/manager/templates/:id/edit',
    COMPLAINTS: '/manager/complaints',
    COMPLAINTS_DETAILS: '/manager/complaints/:id',
    REPORTS: '/manager/reports',
    EMPLOYEES: '/manager/employees',
    PROFILE: '/manager/profile',
  },

  // Client Routes
  CLIENT: {
    DASHBOARD: '/client/dashboard',
    BOOKINGS: '/client/bookings',
    BOOKINGS_DETAILS: '/client/bookings/:id',
    INVITATIONS: '/client/invitations',
    INVITATIONS_DETAILS: '/client/invitations/:id',
    SONGS: '/client/songs',
    REPORTS: '/client/reports',
    PROFILE: '/client/profile',
  },

  // Employee Routes
  EMPLOYEE: {
    DASHBOARD: '/employee/dashboard',
    SCANNER: '/employee/scanner',
    TASKS: '/employee/tasks',
  },
}

// ═══════════════════════════════════════════════════════════
// User Roles
// ═══════════════════════════════════════════════════════════

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CLIENT: 'client',
  EMPLOYEE: 'employee',
  SCANNER: 'scanner', // Scanner is a type of employee
  GUEST: 'guest',
}

// ═══════════════════════════════════════════════════════════
// Storage Keys
// ═══════════════════════════════════════════════════════════

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  PASSWORDS: 'passwords', // For mock auth
}

// ═══════════════════════════════════════════════════════════
// Event Types
// ═══════════════════════════════════════════════════════════

export const EVENT_TYPES = {
  WEDDING: 'wedding',
  BIRTHDAY: 'birthday',
  ENGAGEMENT: 'engagement',
  CONFERENCE: 'conference',
  GRADUATION: 'graduation',
  OTHER: 'other',
}

export const EVENT_TYPE_LABELS = {
  [EVENT_TYPES.WEDDING]: 'زفاف',
  [EVENT_TYPES.BIRTHDAY]: 'عيد ميلاد',
  [EVENT_TYPES.ENGAGEMENT]: 'خطوبة',
  [EVENT_TYPES.CONFERENCE]: 'مؤتمر',
  [EVENT_TYPES.GRADUATION]: 'تخرج',
  [EVENT_TYPES.OTHER]: 'أخرى',
}

// ═══════════════════════════════════════════════════════════
// Event Status
// ═══════════════════════════════════════════════════════════

export const EVENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const EVENT_STATUS_LABELS = {
  [EVENT_STATUS.PENDING]: 'قيد الانتظار',
  [EVENT_STATUS.CONFIRMED]: 'مؤكد',
  [EVENT_STATUS.ACTIVE]: 'نشط',
  [EVENT_STATUS.ONGOING]: 'جاري',
  [EVENT_STATUS.COMPLETED]: 'مكتمل',
  [EVENT_STATUS.CANCELLED]: 'ملغي',
}

export const EVENT_STATUS_COLORS = {
  [EVENT_STATUS.PENDING]: 'warning',
  [EVENT_STATUS.CONFIRMED]: 'info',
  [EVENT_STATUS.ACTIVE]: 'success',
  [EVENT_STATUS.ONGOING]: 'primary',
  [EVENT_STATUS.COMPLETED]: 'default',
  [EVENT_STATUS.CANCELLED]: 'error',
}

// ═══════════════════════════════════════════════════════════
// Complaint Status
// ═══════════════════════════════════════════════════════════

export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
}

export const COMPLAINT_STATUS_LABELS = {
  [COMPLAINT_STATUS.PENDING]: 'قيد الانتظار',
  [COMPLAINT_STATUS.IN_PROGRESS]: 'قيد المعالجة',
  [COMPLAINT_STATUS.RESOLVED]: 'تم الحل',
  [COMPLAINT_STATUS.CLOSED]: 'مغلق',
}

// ═══════════════════════════════════════════════════════════
// Service Categories
// ═══════════════════════════════════════════════════════════

export const SERVICE_CATEGORIES = {
  SCANNER: 'scanner',
  CATERING: 'catering',
  DECORATION: 'decoration',
  ENTERTAINMENT: 'entertainment',
  PHOTOGRAPHY: 'photography',
  MUSIC: 'music',
  SECURITY: 'security',
  CLEANING: 'cleaning',
  OTHER: 'other',
}

export const SERVICE_CATEGORY_LABELS = {
  [SERVICE_CATEGORIES.SCANNER]: 'الماسح',
  [SERVICE_CATEGORIES.CATERING]: 'تقديم الطعام',
  [SERVICE_CATEGORIES.DECORATION]: 'الديكور',
  [SERVICE_CATEGORIES.ENTERTAINMENT]: 'الترفيه',
  [SERVICE_CATEGORIES.PHOTOGRAPHY]: 'التصوير',
  [SERVICE_CATEGORIES.MUSIC]: 'الموسيقى',
  [SERVICE_CATEGORIES.SECURITY]: 'الأمان',
  [SERVICE_CATEGORIES.CLEANING]: 'التنظيف',
  [SERVICE_CATEGORIES.OTHER]: 'أخرى',
}

// ═══════════════════════════════════════════════════════════
// Service Units
// ═══════════════════════════════════════════════════════════

export const SERVICE_UNITS = {
  PER_HOUR: 'per_hour',
  PER_DAY: 'per_day',
  PER_EVENT: 'per_event',
  PER_PERSON: 'per_person',
  FIXED: 'fixed',
}

export const SERVICE_UNIT_LABELS = {
  [SERVICE_UNITS.PER_HOUR]: 'لكل ساعة',
  [SERVICE_UNITS.PER_DAY]: 'لكل يوم',
  [SERVICE_UNITS.PER_EVENT]: 'لكل مناسبة',
  [SERVICE_UNITS.PER_PERSON]: 'لكل شخص',
  [SERVICE_UNITS.FIXED]: 'سعر ثابت',
}

// ═══════════════════════════════════════════════════════════
// Pagination
// ═══════════════════════════════════════════════════════════

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
}

// ═══════════════════════════════════════════════════════════
// Date & Time
// ═══════════════════════════════════════════════════════════

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
}

export const TIME_FORMATS = {
  DISPLAY: 'HH:mm',
  DISPLAY_12H: 'hh:mm A',
}

export const TIMEZONE = 'Asia/Damascus'

// ═══════════════════════════════════════════════════════════
// Validation Rules
// ═══════════════════════════════════════════════════════════

export const VALIDATION = {
  PHONE: {
    PATTERN: /^(09|07)\d{8}$/,
    MESSAGE: 'رقم الهاتف يجب أن يبدأ بـ 09 أو 07 ويتكون من 10 أرقام',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
    MESSAGE: 'كلمة المرور يجب أن تكون بين 6 و 50 حرف',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    MESSAGE: 'الاسم يجب أن يكون بين 2 و 100 حرف',
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'البريد الإلكتروني غير صالح',
  },
}

// ═══════════════════════════════════════════════════════════
// File Upload
// ═══════════════════════════════════════════════════════════

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}

// ═══════════════════════════════════════════════════════════
// Query Keys (React Query)
// ═══════════════════════════════════════════════════════════

export const QUERY_KEYS = {
  // Auth
  ME: ['auth', 'me'],

  // Admin
  ADMIN_DASHBOARD: ['admin', 'dashboard'],
  ADMIN_REPORTS: ['admin', 'reports'],
  ADMIN_USERS: ['admin', 'users'],
  ADMIN_MANAGERS: ['admin', 'managers'],
  ADMIN_HALLS: ['admin', 'halls'],
  ADMIN_TEMPLATES: ['admin', 'templates'],
  ADMIN_SERVICES: ['admin', 'services'],
  ADMIN_COMPLAINTS: ['admin', 'complaints'],

  // Manager
  MANAGER_DASHBOARD: ['manager', 'dashboard'],
  MANAGER_HALL: ['manager', 'hall'],
  MANAGER_EVENTS: ['manager', 'events'],
  MANAGER_STAFF: ['manager', 'staff'],
  MANAGER_CLIENTS: ['manager', 'clients'],
  MANAGER_TEMPLATES: ['manager', 'templates'],
  MANAGER_COMPLAINTS: ['manager', 'complaints'],
  MANAGER_REPORTS: ['manager', 'reports'],

  // Client
  CLIENT_DASHBOARD: ['client', 'dashboard'],
  CLIENT_BOOKINGS: ['client', 'bookings'],
  CLIENT_INVITATIONS: ['client', 'invitations'],
  CLIENT_SONGS: ['client', 'songs'],
  CLIENT_REPORTS: ['client', 'reports'],
  CLIENT_EVENT_RATING: ['client', 'event-rating'],

  // Employee
  EMPLOYEE_DASHBOARD: ['employee', 'dashboard'],
  EMPLOYEE_TASKS: ['employee', 'tasks'],
}

// ═══════════════════════════════════════════════════════════
// Toast/Notification Messages
// ═══════════════════════════════════════════════════════════

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'تم تسجيل الدخول بنجاح',
    LOGOUT: 'تم تسجيل الخروج بنجاح',
    REGISTER: 'تم التسجيل بنجاح',
    CREATE: 'تم الإنشاء بنجاح',
    UPDATE: 'تم التحديث بنجاح',
    DELETE: 'تم الحذف بنجاح',
    SAVE: 'تم الحفظ بنجاح',
  },
  ERROR: {
    GENERIC: 'حدث خطأ ما، يرجى المحاولة مرة أخرى',
    NETWORK: 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت',
    UNAUTHORIZED: 'غير مصرح لك بالوصول',
    NOT_FOUND: 'العنصر المطلوب غير موجود',
    VALIDATION: 'يرجى التحقق من البيانات المدخلة',
  },
  CONFIRM: {
    DELETE: 'هل أنت متأكد من الحذف؟',
    CANCEL: 'هل أنت متأكد من الإلغاء؟',
    LOGOUT: 'هل أنت متأكد من تسجيل الخروج؟',
  },
}

// ═══════════════════════════════════════════════════════════
// App Metadata
// ═══════════════════════════════════════════════════════════

export const APP_INFO = {
  NAME: 'INVOCCA',
  FULL_NAME: 'INVOCCA - تطبيق تنظيم حفلات الصالات',
  DESCRIPTION: 'تطبيق متكامل لتنظيم وإدارة حفلات الصالات - حلول ذكية لإدارة المناسبات',
  AUTHOR: 'MCT Company, Mohammad Salman',
  VERSION: '1.0.0',
  LANGUAGE: 'ar',
  DIRECTION: 'rtl',
}
