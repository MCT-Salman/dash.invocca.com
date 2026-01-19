// menuConfig.js
import {
  Home,
  BarChart,
  Building,
  Palette,
  Users,
  Shield,
  UserCircle,
  Settings,
  FileText,
  Calendar,
  Gift,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  DollarSign
} from 'lucide-react';

// تعريف الأدوار والصلاحيات
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

// القائمة المشتركة لجميع الأدوار
const COMMON_MENU_ITEMS = [
  {
    id: 'profile',
    label: 'الملف الشخصي',
    icon: UserCircle,
    path: '/profile',
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    path: '/settings',
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]
  }
];

// قائمة الأدمن الكاملة
const ADMIN_MENU_ITEMS = [
  // القسم الرئيسي
  { id: 'dashboard', label: 'الرئيسية', icon: Home, path: '/admin' },

  // قسم التقارير
  {
    id: 'reports',
    label: 'التقارير',
    icon: BarChart,
    path: '/admin/reports',
    subItems: [
      { id: 'financial-reports', label: 'التقارير المالية', path: '/admin/reports/financial' },
      { id: 'events-reports', label: 'تقارير الفعاليات', path: '/admin/reports/events' },
      { id: 'users-reports', label: 'تقارير المستخدمين', path: '/admin/reports/users' }
    ]
  },

  // قسم قاعة/صالة
  {
    id: 'halls',
    label: 'قاعة/صالة',
    icon: Building,
    path: '/admin/halls',
    badge: 5 // عدد قاعات/صالات الجديدة
  },

  // قسم الخدمات
  {
    id: 'services',
    label: 'الخدمات',
    icon: Palette,
    path: '/admin/services',
    subItems: [
      { id: 'decoration', label: 'خدمات التزيين', path: '/admin/services/decoration' },
      { id: 'catering', label: 'خدمات الطعام', path: '/admin/services/catering' },
      { id: 'photography', label: 'خدمات التصوير', path: '/admin/services/photography' }
    ]
  },

  // قسم القوالب
  {
    id: 'templates',
    label: 'القوالب',
    icon: FileText,
    path: '/admin/templates',
    badge: 3 // قوالب جديدة
  },

  // قسم المستخدمون
  {
    id: 'users',
    label: 'المستخدمون',
    icon: Users,
    path: '/admin/users',
    subItems: [
      { id: 'all-users', label: 'جميع المستخدمين', path: '/admin/users/all' },
      { id: 'new-users', label: 'مستخدمون جدد', path: '/admin/users/new' },
      { id: 'blocked-users', label: 'مستخدمون محظورون', path: '/admin/users/blocked' }
    ]
  },

  // قسم المدراء
  {
    id: 'managers',
    label: 'المدراء',
    icon: Shield,
    path: '/admin/managers',
    subItems: [
      { id: 'hall-managers', label: 'مدراء قاعة/صالة', path: '/admin/managers/halls' },
      { id: 'service-managers', label: 'مدراء الخدمات', path: '/admin/managers/services' },
      { id: 'event-managers', label: 'مدراء الفعاليات', path: '/admin/managers/events' }
    ]
  },

  // قسم الفعاليات
  {
    id: 'events',
    label: 'الفعاليات',
    icon: Calendar,
    path: '/admin/events',
    subItems: [
      { id: 'upcoming-events', label: 'الفعاليات القادمة', path: '/admin/events/upcoming' },
      { id: 'past-events', label: 'الفعاليات السابقة', path: '/admin/events/past' },
      { id: 'cancelled-events', label: 'الفعاليات الملغاة', path: '/admin/events/cancelled' }
    ]
  },

  // قسم الدعوات
  {
    id: 'invitations',
    label: 'الدعوات',
    icon: Gift,
    path: '/admin/invitations',
    badge: 12
  },

  // قسم المدفوعات
  {
    id: 'payments',
    label: 'المدفوعات',
    icon: CreditCard,
    path: '/admin/payments',
    subItems: [
      { id: 'pending-payments', label: 'المدفوعات المعلقة', path: '/admin/payments/pending' },
      { id: 'completed-payments', label: 'المدفوعات المكتملة', path: '/admin/payments/completed' },
      { id: 'failed-payments', label: 'المدفوعات الفاشلة', path: '/admin/payments/failed' }
    ]
  },

  // قسم الإشعارات
  {
    id: 'notifications',
    label: 'الإشعارات',
    icon: Bell,
    path: '/admin/notifications',
    badge: 5
  },

  // قسم المساعدة
  {
    id: 'help',
    label: 'المساعدة والدعم',
    icon: HelpCircle,
    path: '/admin/help',
    subItems: [
      { id: 'faq', label: 'الأسئلة الشائعة', path: '/admin/help/faq' },
      { id: 'guides', label: 'أدلة الاستخدام', path: '/admin/help/guides' },
      { id: 'contact-support', label: 'اتصل بالدعم', path: '/admin/help/contact' }
    ]
  },

  // تسجيل الخروج (يضاف في الأخير)
  {
    id: 'logout',
    label: 'تسجيل الخروج',
    icon: LogOut,
    path: '/logout',
    isFooter: true,
    danger: true
  }
];

// قائمة المدراء (نسخة مختصرة)
const MANAGER_MENU_ITEMS = [
  { id: 'dashboard', label: 'الرئيسية', icon: Home, path: '/manager' },
  { id: 'halls', label: 'قاعة/صالة', icon: Building, path: '/manager/halls' },
  { id: 'events', label: 'فعالياتي', icon: Calendar, path: '/manager/events' },
  { id: 'services', label: 'خدماتي', icon: Palette, path: '/manager/services' },
  { id: 'invitations', label: 'الدعوات', icon: Gift, path: '/manager/invitations' },
  { id: 'reports', label: 'التقارير', icon: BarChart, path: '/manager/reports' },
  { id: 'ratings', label: 'التقييمات', icon: FileText, path: '/manager/ratings' },
  {
    id: 'financial',
    label: 'المالية',
    icon: DollarSign,
    path: '/manager/financial/dashboard',
    subItems: [
      { id: 'financial-dashboard', label: 'لوحة التحكم', path: '/manager/financial/dashboard' },
      { id: 'invoices', label: 'الفواتير', path: '/manager/financial/invoices' },
      { id: 'transactions', label: 'المعاملات', path: '/manager/financial/transactions' },
      { id: 'financial-reports', label: 'التقارير المالية', path: '/manager/financial/reports' }
    ]
  },
  ...COMMON_MENU_ITEMS,
  { id: 'logout', label: 'تسجيل الخروج', icon: LogOut, path: '/logout', isFooter: true, danger: true }
];

// قائمة المستخدمين العاديين
const USER_MENU_ITEMS = [
  { id: 'dashboard', label: 'الرئيسية', icon: Home, path: '/user' },
  { id: 'my-events', label: 'فعالياتي', icon: Calendar, path: '/user/events' },
  { id: 'my-invitations', label: 'دعواتي', icon: Gift, path: '/user/invitations' },
  { id: 'halls', label: 'استعرض قاعة/صالة', icon: Building, path: '/user/halls' },
  { id: 'services', label: 'خدمات إضافية', icon: Palette, path: '/user/services' },
  ...COMMON_MENU_ITEMS,
  { id: 'help', label: 'المساعدة', icon: HelpCircle, path: '/user/help' },
  { id: 'logout', label: 'تسجيل الخروج', icon: LogOut, path: '/logout', isFooter: true, danger: true }
];

// تصدير القوائم المنظمة حسب الدور
export const ROLE_MENUS = {
  [ROLES.ADMIN]: [...ADMIN_MENU_ITEMS],
  [ROLES.MANAGER]: [...MANAGER_MENU_ITEMS],
  [ROLES.USER]: [...USER_MENU_ITEMS],
  client: [...USER_MENU_ITEMS],
  employee: [...USER_MENU_ITEMS]
};

// وظيفة مساعدة لتصفية القائمة حسب الدور
export const getFilteredMenuItems = (role) => {
  return ROLE_MENUS[role] || USER_MENU_ITEMS;
};

// تصدير بيانات المستخدم الافتراضية
export const defaultUserProfile = {
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  role: ROLES.ADMIN
};