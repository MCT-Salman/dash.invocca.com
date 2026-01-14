// src\api\services.js
import api from './apiClient'

/**
 * Services APIs - إدارة الخدمات
 * Based on API_DOCUMENTATION_FRONTEND.md
 */

// قائمة الخدمات مع دعم الفلترة والتصفح
export const listServices = (params = {}) => {
  const { page = 1, limit = 10, category } = params
  return api.get('/admin/services', { 
    params: { page, limit, category } 
  }).then(r => ({
    services: r.data?.data || r.data?.services || r.data || [],
    pagination: r.data?.pagination || null
  }))
}

// إضافة خدمة جديدة
export const addService = (payload) => {
  const body = {
    name: payload.name,
    category: payload.category, // scanner, catering, decoration, entertainment, photography, music, security, cleaning, other
    price: Number(payload.price) || 0,
    description: payload.description || '',
    unit: payload.unit || 'per_event'
  }
  return api.post('/admin/services', body).then(r => r.data)
}

// تحديث خدمة
export const updateService = (id, payload) => {
  const body = {
    name: payload.name,
    category: payload.category,
    price: Number(payload.price) || 0,
    description: payload.description || '',
    unit: payload.unit || 'per_event',
    isActive: payload.isActive
  }
  return api.put(`/admin/services/${id}`, body).then(r => r.data)
}

// حذف خدمة
export const deleteService = (id) => {
  return api.delete(`/admin/services/${id}`).then(r => r.data)
}

// تفعيل/إلغاء تفعيل خدمة
export const toggleServiceStatus = (id, isActive) => {
  return api.patch(`/admin/services/${id}/status`, { isActive }).then(r => r.data)
}

// الحصول على تفاصيل خدمة
export const getService = (id) => {
  return api.get(`/admin/services/${id}`).then(r => r.data?.service || r.data)
}

// الحصول على فئات الخدمات
export const getServiceCategories = () => {
  return [
    { value: 'scanner', label: 'الماسح' },
    { value: 'catering', label: 'تقديم الطعام' },
    { value: 'decoration', label: 'الديكور' },
    { value: 'entertainment', label: 'الترفيه' },
    { value: 'photography', label: 'التصوير' },
    { value: 'music', label: 'الموسيقى' },
    { value: 'security', label: 'الأمان' },
    { value: 'cleaning', label: 'التنظيف' },
    { value: 'other', label: 'أخرى' }
  ]
}

