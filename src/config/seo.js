/**
 * SEO Configuration
 * إعدادات SEO لجميع صفحات التطبيق
 */

import { APP_INFO } from './constants'

// ═══════════════════════════════════════════════════════════
// Default SEO Configuration
// ═══════════════════════════════════════════════════════════

export const DEFAULT_SEO = {
    title: APP_INFO.FULL_NAME,
    description: APP_INFO.DESCRIPTION,
    keywords: 'تطبيق حفلات, تنظيم مناسبات, إدارة صالات, لوحة تحكم حفلات, منظم حفلات, حجز قاعات, دعوات إلكترونية',
    author: APP_INFO.AUTHOR,
    language: APP_INFO.LANGUAGE,
    direction: APP_INFO.DIRECTION,

    // Open Graph
    openGraph: {
        type: 'website',
        locale: 'ar_SA',
        siteName: APP_INFO.NAME,
        title: APP_INFO.FULL_NAME,
        description: APP_INFO.DESCRIPTION,
        // image: '/logo/invocca_og.png', // TODO: Add OG image
        // url: 'https://yourdomain.com', // TODO: Add domain
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        site: '@invocca', // TODO: Add Twitter handle
        creator: '@invocca',
        title: APP_INFO.FULL_NAME,
        description: APP_INFO.DESCRIPTION,
        // image: '/logo/invocca_twitter.png', // TODO: Add Twitter image
    },
}

// ═══════════════════════════════════════════════════════════
// Page-specific SEO Configuration
// ═══════════════════════════════════════════════════════════

export const PAGE_SEO = {
    // ─────────────────────────────────────────────────────────
    // Public Pages
    // ─────────────────────────────────────────────────────────

    landing: {
        title: 'INVOCCA - الحل الأمثل لتنظيم حفلات الصالات',
        description: 'نظام متكامل لإدارة وتنظيم حفلات الصالات بكل سهولة واحترافية. احجز قاعتك، أدر دعواتك، وتابع فعالياتك من مكان واحد',
        keywords: 'حجز قاعات, تنظيم حفلات, إدارة مناسبات, دعوات إلكترونية, قاعات أفراح, صالات مناسبات',
        canonical: '/',
    },

    privacyPolicy: {
        title: 'سياسة الخصوصية - INVOCCA',
        description: 'سياسة الخصوصية وحماية البيانات في تطبيق INVOCCA لتنظيم حفلات الصالات',
        keywords: 'سياسة الخصوصية, حماية البيانات, أمان المعلومات',
        canonical: '/privacy-policy',
    },

    termsOfService: {
        title: 'الشروط والأحكام - INVOCCA',
        description: 'شروط وأحكام استخدام تطبيق INVOCCA لتنظيم حفلات الصالات',
        keywords: 'شروط الاستخدام, أحكام الخدمة, قواعد التطبيق',
        canonical: '/terms-of-service',
    },

    notFound: {
        title: '404 - الصفحة غير موجودة | INVOCCA',
        description: 'الصفحة التي تبحث عنها غير موجودة',
        noIndex: true,
    },

    // ─────────────────────────────────────────────────────────
    // Auth Pages
    // ─────────────────────────────────────────────────────────

    login: {
        title: 'تسجيل الدخول - INVOCCA',
        description: 'سجل دخولك إلى حسابك في INVOCCA لإدارة حفلاتك ومناسباتك',
        keywords: 'تسجيل دخول, دخول الحساب, login',
        canonical: '/login',
        noIndex: true, // لا نريد فهرسة صفحات تسجيل الدخول
    },

    register: {
        title: 'إنشاء حساب جديد - INVOCCA',
        description: 'أنشئ حسابك الآن في INVOCCA وابدأ بتنظيم حفلاتك ومناسباتك بكل سهولة',
        keywords: 'إنشاء حساب, تسجيل جديد, register',
        canonical: '/register',
        noIndex: true,
    },

    forgotPassword: {
        title: 'استعادة كلمة المرور - INVOCCA',
        description: 'استعد كلمة المرور الخاصة بحسابك في INVOCCA',
        canonical: '/forgot-password',
        noIndex: true,
    },

    // ─────────────────────────────────────────────────────────
    // Admin Pages
    // ─────────────────────────────────────────────────────────

    adminDashboard: {
        title: 'لوحة تحكم الأدمن - INVOCCA',
        description: 'لوحة التحكم الرئيسية للمدير العام',
        noIndex: true,
    },

    adminUsers: {
        title: 'إدارة المستخدمين - INVOCCA',
        description: 'إدارة جميع مستخدمي النظام',
        noIndex: true,
    },

    adminManagers: {
        title: 'إدارة المديرين - INVOCCA',
        description: 'إدارة مديري القاعات',
        noIndex: true,
    },

    adminHalls: {
        title: 'إدارة القاعات - INVOCCA',
        description: 'إدارة جميع القاعات والصالات',
        noIndex: true,
    },

    adminTemplates: {
        title: 'إدارة القوالب - INVOCCA',
        description: 'إدارة قوالب الدعوات',
        noIndex: true,
    },

    adminServices: {
        title: 'إدارة الخدمات - INVOCCA',
        description: 'إدارة الخدمات المتاحة',
        noIndex: true,
    },

    adminComplaints: {
        title: 'إدارة الشكاوى - INVOCCA',
        description: 'متابعة ومعالجة الشكاوى',
        noIndex: true,
    },

    adminReports: {
        title: 'التقارير - INVOCCA',
        description: 'تقارير وإحصائيات شاملة',
        noIndex: true,
    },

    // ─────────────────────────────────────────────────────────
    // Manager Pages
    // ─────────────────────────────────────────────────────────

    managerDashboard: {
        title: 'لوحة تحكم المدير - INVOCCA',
        description: 'لوحة التحكم الرئيسية لمدير القاعة',
        noIndex: true,
    },

    managerHall: {
        title: 'إدارة القاعة - INVOCCA',
        description: 'إدارة معلومات وإعدادات القاعة',
        noIndex: true,
    },

    managerEvents: {
        title: 'إدارة الأحداث - INVOCCA',
        description: 'إدارة ومتابعة جميع الأحداث والحجوزات',
        noIndex: true,
    },

    managerStaff: {
        title: 'إدارة الموظفين - INVOCCA',
        description: 'إدارة موظفي القاعة',
        noIndex: true,
    },

    managerClients: {
        title: 'إدارة العملاء - INVOCCA',
        description: 'عرض ومتابعة العملاء',
        noIndex: true,
    },

    managerTemplates: {
        title: 'إدارة القوالب - INVOCCA',
        description: 'إدارة قوالب الدعوات الخاصة بالقاعة',
        noIndex: true,
    },

    managerComplaints: {
        title: 'الشكاوى - INVOCCA',
        description: 'متابعة ومعالجة شكاوى العملاء',
        noIndex: true,
    },

    managerReports: {
        title: 'التقارير - INVOCCA',
        description: 'تقارير وإحصائيات القاعة',
        noIndex: true,
    },

    // ─────────────────────────────────────────────────────────
    // Client Pages
    // ─────────────────────────────────────────────────────────

    clientDashboard: {
        title: 'لوحة التحكم - INVOCCA',
        description: 'لوحة التحكم الخاصة بك',
        noIndex: true,
    },

    clientBookings: {
        title: 'حجوزاتي - INVOCCA',
        description: 'عرض ومتابعة جميع حجوزاتك',
        noIndex: true,
    },

    clientInvitations: {
        title: 'دعواتي - INVOCCA',
        description: 'إدارة دعوات المناسبات',
        noIndex: true,
    },

    clientProfile: {
        title: 'الملف الشخصي - INVOCCA',
        description: 'إدارة معلوماتك الشخصية',
        noIndex: true,
    },

    // ─────────────────────────────────────────────────────────
    // Employee Pages
    // ─────────────────────────────────────────────────────────

    employeeDashboard: {
        title: 'لوحة تحكم الموظف - INVOCCA',
        description: 'لوحة التحكم الخاصة بالموظف',
        noIndex: true,
    },

    employeeScanner: {
        title: 'ماسح الدعوات - INVOCCA',
        description: 'مسح رموز QR للدعوات',
        noIndex: true,
    },

    employeeTasks: {
        title: 'المهام - INVOCCA',
        description: 'قائمة المهام المطلوبة',
        noIndex: true,
    },
}

// ═══════════════════════════════════════════════════════════
// Structured Data Schemas (JSON-LD)
// ═══════════════════════════════════════════════════════════

export const STRUCTURED_DATA = {
    organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: APP_INFO.NAME,
        description: APP_INFO.DESCRIPTION,
        // url: 'https://yourdomain.com', // TODO: Add domain
        // logo: 'https://yourdomain.com/logo/invocca_icon.png',
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            availableLanguage: ['Arabic'],
        },
    },

    website: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: APP_INFO.NAME,
        description: APP_INFO.DESCRIPTION,
        // url: 'https://yourdomain.com',
        inLanguage: 'ar',
    },

    softwareApplication: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: APP_INFO.NAME,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: APP_INFO.DESCRIPTION,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'SYP',
        },
    },
}

// ═══════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════

/**
 * Get SEO configuration for a specific page
 * @param {string} pageKey - Key from PAGE_SEO object
 * @returns {object} SEO configuration merged with defaults
 */
export function getPageSEO(pageKey) {
    const pageSEO = PAGE_SEO[pageKey] || {}

    return {
        ...DEFAULT_SEO,
        ...pageSEO,
        openGraph: {
            ...DEFAULT_SEO.openGraph,
            ...pageSEO.openGraph,
            title: pageSEO.title || DEFAULT_SEO.title,
            description: pageSEO.description || DEFAULT_SEO.description,
        },
        twitter: {
            ...DEFAULT_SEO.twitter,
            ...pageSEO.twitter,
            title: pageSEO.title || DEFAULT_SEO.title,
            description: pageSEO.description || DEFAULT_SEO.description,
        },
    }
}

/**
 * Generate meta tags array for a page
 * @param {string} pageKey - Key from PAGE_SEO object
 * @returns {Array} Array of meta tag objects
 */
export function generateMetaTags(pageKey) {
    const seo = getPageSEO(pageKey)
    const tags = []

    // Basic meta tags
    tags.push({ name: 'description', content: seo.description })
    tags.push({ name: 'keywords', content: seo.keywords })
    tags.push({ name: 'author', content: seo.author })

    // Robots
    if (seo.noIndex) {
        tags.push({ name: 'robots', content: 'noindex, nofollow' })
    }

    // Open Graph
    tags.push({ property: 'og:type', content: seo.openGraph.type })
    tags.push({ property: 'og:locale', content: seo.openGraph.locale })
    tags.push({ property: 'og:site_name', content: seo.openGraph.siteName })
    tags.push({ property: 'og:title', content: seo.openGraph.title })
    tags.push({ property: 'og:description', content: seo.openGraph.description })

    if (seo.openGraph.image) {
        tags.push({ property: 'og:image', content: seo.openGraph.image })
    }

    if (seo.openGraph.url) {
        tags.push({ property: 'og:url', content: seo.openGraph.url })
    }

    // Twitter Card
    tags.push({ name: 'twitter:card', content: seo.twitter.card })
    tags.push({ name: 'twitter:site', content: seo.twitter.site })
    tags.push({ name: 'twitter:creator', content: seo.twitter.creator })
    tags.push({ name: 'twitter:title', content: seo.twitter.title })
    tags.push({ name: 'twitter:description', content: seo.twitter.description })

    if (seo.twitter.image) {
        tags.push({ name: 'twitter:image', content: seo.twitter.image })
    }

    return tags
}
