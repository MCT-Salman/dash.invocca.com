// src\components\layout\menuConfig.js
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Users,
  BarChart3,
  Star,
  QrCode,
  MessageCircle,
  UserPlus,
  User,
  Calendar,
  Image,
  Music,
  DollarSign,
  FileText,
  CreditCard,
} from 'lucide-react'
import { ROUTES } from '@/config/constants'

export const ROLE_MENUS = {
  admin: [
    { label: 'الرئيسية', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'التقارير', path: '/admin/reports', icon: BarChart3 },
    { label: 'قاعة/صالة', path: '/admin/halls', icon: Building2 },
    { label: 'القوالب', path: '/admin/templates', icon: Image },
    { label: 'المستخدمون', path: '/admin/users', icon: Users },
    { label: 'المدراء', path: '/admin/managers', icon: UserPlus },
    { label: 'الشكاوى', path: '/admin/complaints', icon: MessageCircle },
    { label: 'الملف الشخصي', path: ROUTES.ADMIN.PROFILE, icon: User },
  ],
  manager: [
    { label: 'الرئيسية', path: ROUTES.MANAGER.DASHBOARD, icon: LayoutDashboard },
    { label: 'الفعاليات', path: ROUTES.MANAGER.EVENTS, icon: ClipboardList },
    { label: 'العملاء', path: ROUTES.MANAGER.CLIENTS, icon: UserPlus },
    { label: 'الموظفون', path: ROUTES.MANAGER.STAFF, icon: Users },
    { label: 'قاعة/صالة', path: ROUTES.MANAGER.HALL, icon: Building2 },
    { label: 'الخدمات', path: ROUTES.MANAGER.SERVICES, icon: ClipboardList },
    { label: 'الأغاني', path: ROUTES.MANAGER.SONGS, icon: Music },
    { label: 'التقارير', path: ROUTES.MANAGER.REPORTS, icon: BarChart3 },
    { label: 'التقييمات', path: ROUTES.MANAGER.RATINGS, icon: Star },
    { label: 'قوالب الدعوات', path: ROUTES.MANAGER.TEMPLATES, icon: Image },
    { label: 'الشكاوى', path: ROUTES.MANAGER.COMPLAINTS, icon: MessageCircle },
    // Financial Section
    { label: 'المالية', path: '/manager/financial/dashboard', icon: DollarSign },
    { label: 'الفواتير', path: '/manager/financial/invoices', icon: FileText },
    { label: 'المعاملات', path: '/manager/financial/transactions', icon: CreditCard },
    { label: 'التقارير المالية', path: '/manager/financial/reports', icon: BarChart3 },
    { label: 'الملف الشخصي', path: ROUTES.MANAGER.PROFILE, icon: User },
  ],
  client: [
    { label: 'الرئيسية', path: '/client/dashboard', icon: LayoutDashboard },
    { label: 'دعواتي', path: '/client/invitations', icon: ClipboardList },
    { label: 'الأغاني', path: '/client/songs', icon: QrCode },
    { label: 'التقارير', path: '/client/reports', icon: BarChart3 },
    { label: 'التقييمات', path: ROUTES.CLIENT.RATINGS, icon: Star },
    { label: 'الملف الشخصي', path: ROUTES.CLIENT.PROFILE, icon: User },
  ],
  employee: [
    { label: 'الرئيسية', path: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'الماسح', path: '/employee/scanner', icon: QrCode },
    { label: 'المهام', path: '/employee/tasks', icon: ClipboardList },
  ],
}


