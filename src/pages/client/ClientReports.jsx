// src\pages\client\ClientReports.jsx
/**
 * Client Reports Page
 * صفحة التقارير للعميل
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { LoadingScreen, SEOHead, EmptyState, FormDialog } from '@/components/common'
import { QUERY_KEYS } from '@/config/constants'
import { getClientReports } from '@/api/client'
import { formatDate, formatCurrency, formatEmptyValue, formatNumber } from '@/utils/helpers'
import {
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Building2,
  TrendingUp,
  Clock,
  MapPin,
  Tag,
  FileText,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Image as ImageIcon,
  UserCheck,
  Sparkles,
  Star
} from 'lucide-react'
import MuiButton from '@/components/ui/MuiButton'



export default function ClientReports() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_REPORTS,
    queryFn: getClientReports,
  })

  // Extract data early for hook dependencies
  const hasEvent = data?.hasEvent
  const event = data?.event
  const invitations = data?.invitations || []



  // NOW check loading and conditional returns AFTER all hooks
  if (isLoading) {
    return <LoadingScreen message="جاري تحميل التقارير..." fullScreen={false} />
  }

  if (!hasEvent || !event) {
    return (
      <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
        <SEOHead title="التقارير - INVOCCA" />
        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary)', fontWeight: 700, mb: 4 }}>
          التقارير والإحصائيات
        </MuiTypography>
        <EmptyState
          title="لا توجد بيانات"
          description="ستظهر تقاريرك المالية وإحصائيات مناسباتك هنا."
          icon={BarChart3}
        />
      </MuiBox>
    )
  }

  const hall = event.hall || {}
  const totalPrice = event.totalPrice || 0
  const paidAmount = event.paidAmount || 0
  const remainingBalance = event.remainingBalance || (totalPrice - paidAmount)

  // Event type labels
  const eventTypeLabels = {
    wedding: 'زفاف',
    birthday: 'عيد ميلاد',
    engagement: 'خطوبة',
    graduation: 'تخرج',
    corporate: 'فعالية شركات',
    other: 'أخرى'
  }

  // Status labels
  const statusLabels = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    in_progress: 'جاري',
    completed: 'مكتمل',
    cancelled: 'ملغي'
  }

  // Payment status labels
  const paymentStatusLabels = {
    no_payment_required: 'لا يوجد دفع مطلوب',
    unpaid: 'غير مدفوع',
    partially_paid: 'مدفوع جزئياً',
    paid: 'مدفوع بالكامل'
  }

  // Employee assignment status labels
  const employeeStatusLabels = {
    unassigned: 'غير معين',
    partially_assigned: 'معين جزئياً',
    assigned: 'معين بالكامل'
  }

  // Calculate total invited people
  const totalInvitedPeople = invitations.reduce((sum, inv) => sum + (inv.numOfPeople || 0), 0)
  const totalCheckedIn = invitations.reduce((sum, inv) => {
    return sum + (inv.guests?.filter(g => g.checkedIn).length || 0)
  }, 0)

  // Create a map of service IDs to service names from hall.services
  const serviceNameMap = {}
  if (hall.services && Array.isArray(hall.services)) {
    hall.services.forEach((hallService) => {
      const serviceId = typeof hallService.service === 'string'
        ? hallService.service
        : (hallService.service?._id || hallService.service?.id)
      const serviceName = typeof hallService.service === 'object' && hallService.service?.name
        ? hallService.service.name
        : null
      if (serviceId && serviceName) {
        serviceNameMap[serviceId] = serviceName
      }
    })
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="التقارير - INVOCCA" />

      {/* Header */}
      <MuiBox sx={{ mb: 4 }}>
        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary)', fontWeight: 700, mb: 1 }}>
          التقارير والإحصائيات
        </MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
          تقرير شامل عن فعاليتك
        </MuiTypography>
      </MuiBox>

      {/* Event Info Card + Rating */}
      <MuiPaper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: 'var(--color-paper)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '20px',
        }}
      >
        <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <MuiBox>
            <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 700, mb: 1 }}>
              {formatEmptyValue(event.name || event.eventName)}
            </MuiTypography>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <MuiChip
                label={eventTypeLabels[event.type] || event.type || 'فعالية'}
                size="small"
                sx={{
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  fontWeight: 600,
                  border: '1px solid var(--color-primary-200)',
                }}
              />
              <MuiChip
                label={statusLabels[event.status] || event.status}
                size="small"
                sx={{
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  fontWeight: 600,
                  border: '1px solid var(--color-primary-200)',
                }}
              />
            </MuiBox>
          </MuiBox>
        </MuiBox>

        <MuiGrid container spacing={2}>
          <MuiGrid item xs={12} sm={6} md={3}>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={20} style={{ color: 'var(--color-primary-500)' }} />
              <MuiBox>
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                  التاريخ
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {formatDate(event.date || event.eventDate, 'MM/DD/YYYY')}
                </MuiTypography>
              </MuiBox>
            </MuiBox>
          </MuiGrid>
          <MuiGrid item xs={12} sm={6} md={3}>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={20} style={{ color: 'var(--color-primary-500)' }} />
              <MuiBox>
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                  الوقت
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : (event.startTime || '—')}
                </MuiTypography>
              </MuiBox>
            </MuiBox>
          </MuiGrid>
          {event.duration && (
            <MuiGrid item xs={12} sm={6} md={3}>
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={20} style={{ color: 'var(--color-primary-500)' }} />
                <MuiBox>
                  <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                    المدة
                  </MuiTypography>
                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {formatNumber(event.duration)} ساعة
                  </MuiTypography>
                </MuiBox>
              </MuiBox>
            </MuiGrid>
          )}
          <MuiGrid item xs={12} sm={6} md={3}>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Users size={20} style={{ color: 'var(--color-primary-500)' }} />
              <MuiBox>
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                  عدد الضيوف
                </MuiTypography>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {formatEmptyValue(event.guestCount)}
                </MuiTypography>
              </MuiBox>
            </MuiBox>
          </MuiGrid>
          {event.requiredEmployees !== undefined && (
            <MuiGrid item xs={12} sm={6} md={3}>
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UserCheck size={20} style={{ color: 'var(--color-primary-500)' }} />
                <MuiBox>
                  <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                    الموظفين المطلوبين
                  </MuiTypography>
                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    {formatEmptyValue(event.requiredEmployees)}
                  </MuiTypography>
                </MuiBox>
              </MuiBox>
            </MuiGrid>
          )}
        </MuiGrid>

        {/* Special Requests */}
        {event.specialRequests && (
          <>
            <MuiDivider sx={{ my: 3, borderColor: 'rgba(216, 185, 138, 0.15)' }} />
            <MuiBox>
              <MuiTypography variant="subtitle2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                الطلبات الخاصة
              </MuiTypography>
              <MuiTypography variant="body2" sx={{ color: 'var(--color-text-primary)', lineHeight: 1.8 }}>
                {event.specialRequests}
              </MuiTypography>
            </MuiBox>
          </>
        )}

      </MuiPaper>



      {/* Financial Summary */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        <MuiGrid item xs={12} md={4}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              background: 'var(--color-paper)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <MuiBox
              sx={{
                width: 56,
                height: 56,
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <DollarSign size={28} style={{ color: '#22c55e' }} />
            </MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
              إجمالي المبلغ
            </MuiTypography>
            <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
              {formatCurrency(totalPrice)}
            </MuiTypography>
          </MuiPaper>
        </MuiGrid>

        <MuiGrid item xs={12} md={4}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              background: 'var(--color-paper)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <MuiBox
              sx={{
                width: 56,
                height: 56,
                borderRadius: '12px',
                background: 'rgba(249, 115, 22, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <TrendingUp size={28} style={{ color: '#f97316' }} />
            </MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
              المدفوع
            </MuiTypography>
            <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
              {formatCurrency(paidAmount)}
            </MuiTypography>
          </MuiPaper>
        </MuiGrid>

        <MuiGrid item xs={12} md={4}>
          <MuiPaper
            elevation={0}
            sx={{
              p: 3,
              background: 'var(--color-paper)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <MuiBox
              sx={{
                width: 56,
                height: 56,
                borderRadius: '12px',
                background: 'rgba(220, 38, 38, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <DollarSign size={28} style={{ color: '#dc2626' }} />
            </MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
              المتبقي
            </MuiTypography>
            <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
              {formatCurrency(remainingBalance)}
            </MuiTypography>
          </MuiPaper>
        </MuiGrid>
      </MuiGrid>

      {/* Payment & Employee Status */}
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        {event.paymentStatus && (
          <MuiGrid item xs={12} md={6}>
            <MuiPaper
              elevation={0}
              sx={{
                p: 3,
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border-glass)',
                borderRadius: '16px',
              }}
            >
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <DollarSign size={24} style={{ color: 'var(--color-primary-500)' }} />
                <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  حالة الدفع
                </MuiTypography>
              </MuiBox>
              <MuiChip
                label={paymentStatusLabels[event.paymentStatus] || event.paymentStatus}
                sx={{
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  fontWeight: 600,
                  border: '1px solid var(--color-primary-200)',
                }}
              />
            </MuiPaper>
          </MuiGrid>
        )}
        {event.employeeAssignmentStatus && (
          <MuiGrid item xs={12} md={6}>
            <MuiPaper
              elevation={0}
              sx={{
                p: 3,
                background: 'var(--color-paper)',
                border: '1px solid var(--color-border-glass)',
                borderRadius: '16px',
              }}
            >
              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <UserCheck size={24} style={{ color: 'var(--color-primary-500)' }} />
                <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  حالة تعيين الموظفين
                </MuiTypography>
              </MuiBox>
              <MuiChip
                label={employeeStatusLabels[event.employeeAssignmentStatus] || event.employeeAssignmentStatus}
                sx={{
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  fontWeight: 600,
                  border: '1px solid var(--color-primary-200)',
                }}
              />
            </MuiPaper>
          </MuiGrid>
        )}
      </MuiGrid>

      {/* Hall Details */}
      {hall && Object.keys(hall).length > 0 && (
        <MuiPaper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: 'var(--color-paper)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '20px',
          }}
        >
          <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 700, mb: 3 }}>
            معلومات قاعة/صالة
          </MuiTypography>
          <MuiGrid container spacing={2}>
            <MuiGrid item xs={12} sm={6} md={4}>
              <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                اسم قاعة/صالة
              </MuiTypography>
              <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                {formatEmptyValue(hall.name)}
              </MuiTypography>
            </MuiGrid>
            {hall.location && (
              <MuiGrid item xs={12} sm={6} md={4}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  الموقع
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {formatEmptyValue(hall.location)}
                </MuiTypography>
              </MuiGrid>
            )}
            {hall.capacity !== undefined && (
              <MuiGrid item xs={12} sm={6} md={4}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  السعة
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {formatEmptyValue(hall.capacity)} ضيف
                </MuiTypography>
              </MuiGrid>
            )}
            {hall.tables !== undefined && (
              <MuiGrid item xs={12} sm={6} md={4}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  عدد الطاولات
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {formatEmptyValue(hall.tables)}
                </MuiTypography>
              </MuiGrid>
            )}
            {hall.chairs !== undefined && (
              <MuiGrid item xs={12} sm={6} md={4}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  عدد الكراسي
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {formatEmptyValue(hall.chairs)}
                </MuiTypography>
              </MuiGrid>
            )}
            {hall.maxEmployees !== undefined && (
              <MuiGrid item xs={12} sm={6} md={4}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  الحد الأقصى للموظفين
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {formatEmptyValue(hall.maxEmployees)}
                </MuiTypography>
              </MuiGrid>
            )}
            {hall.defaultPrices !== undefined && (
              <MuiGrid item xs={12} sm={6} md={4}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  الأسعار الافتراضية
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {formatCurrency(hall.defaultPrices)}
                </MuiTypography>
              </MuiGrid>
            )}
            {hall.description && (
              <MuiGrid item xs={12}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  الوصف
                </MuiTypography>
                <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', lineHeight: 1.8 }}>
                  {hall.description}
                </MuiTypography>
              </MuiGrid>
            )}
            {hall.amenities && hall.amenities.length > 0 && (
              <MuiGrid item xs={12}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                  المرافق
                </MuiTypography>
                <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {hall.amenities.map((amenity, index) => (
                    <MuiChip
                      key={index}
                      label={amenity}
                      size="small"
                      sx={{
                        backgroundColor: 'var(--color-primary-50)',
                        color: 'var(--color-primary-700)',
                        fontWeight: 500,
                        border: '1px solid var(--color-primary-200)',
                      }}
                    />
                  ))}
                </MuiBox>
              </MuiGrid>
            )}
            {hall.images && hall.images.length > 0 && (
              <MuiGrid item xs={12}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                  صور قاعة/صالة
                </MuiTypography>
                <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {hall.images.map((image, index) => {
                    const imageUrl = image.url?.startsWith('http') ? image.url : `${import.meta.env.VITE_API_BASE}${image.url}`
                    return (
                      <MuiBox
                        key={image._id || image.id || index}
                        onClick={() => window.open(imageUrl, '_blank')}
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border-glass)',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                          }
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={image.caption || `صورة ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </MuiBox>
                    )
                  })}
                </MuiBox>
              </MuiGrid>
            )}
            {hall.primaryImage && (
              <MuiGrid item xs={12}>
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
                  الصورة الرئيسية
                </MuiTypography>
                <MuiBox
                  onClick={() => {
                    const imageUrl = hall.primaryImage.url?.startsWith('http')
                      ? hall.primaryImage.url
                      : `${import.meta.env.VITE_API_BASE}${hall.primaryImage.url}`
                    window.open(imageUrl, '_blank')
                  }}
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-glass)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                    }
                  }}
                >
                  <img
                    src={hall.primaryImage.url?.startsWith('http')
                      ? hall.primaryImage.url
                      : `${import.meta.env.VITE_API_BASE}${hall.primaryImage.url}`}
                    alt={hall.primaryImage.caption || 'الصورة الرئيسية'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </MuiBox>
              </MuiGrid>
            )}
          </MuiGrid>
        </MuiPaper>
      )}

      {/* Event Services */}
      {event.services && event.services.length > 0 && (
        <MuiPaper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: 'var(--color-paper)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '20px',
          }}
        >
       <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 700, mb: 3 }}>
  الخدمات ({event.services.length})
</MuiTypography>
<MuiGrid container spacing={2}>
  {event.services.map((serviceItem, index) => {
    const serviceId = serviceItem.service;
    
    // البحث عن الخدمة الكاملة في hall.services
    const fullService = hall.services?.find(s => s._id === serviceId);
    
    const serviceName = serviceItem.name || fullService?.name || 'خدمة';
    const serviceCategory = fullService?.category;
    const serviceDescription = fullService?.description;
    
    return (
      <MuiGrid item xs={12} sm={6} md={4} key={serviceItem._id || index}>
        <MuiPaper
          sx={{
            p: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(216, 185, 138, 0.15)',
            borderRadius: '12px',
          }}
        >
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Sparkles size={18} style={{ color: 'var(--color-primary-400)' }} />
            <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, flex: 1 }}>
              {serviceName}
            </MuiTypography>
          </MuiBox>
          
          <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {serviceDescription && (
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                {serviceDescription}
              </MuiTypography>
            )}
            
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
              الكمية: {serviceItem.quantity || 1}
            </MuiTypography>
            
            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
              السعر: {formatCurrency(serviceItem.price || 0)}
            </MuiTypography>
            
            {serviceCategory && (
              <MuiChip
                label={serviceCategory}
                size="small"
                sx={{
                  mt: 0.5,
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  fontSize: '0.7rem',
                  height: 20,
                  border: '1px solid var(--color-primary-200)',
                }}
              />
            )}
          </MuiBox>
        </MuiPaper>
      </MuiGrid>
    );
  })}
</MuiGrid>
        </MuiPaper>
      )}

      {/* Invitations Summary */}
      {invitations.length > 0 && (
        <MuiPaper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: 'var(--color-paper)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '20px',
          }}
        >
          <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 700, mb: 3 }}>
            الدعوات ({invitations.length})
          </MuiTypography>
          <MuiGrid container spacing={2} sx={{ mb: 3 }}>
            <MuiGrid item xs={12} sm={6} md={3}>
              <MuiPaper
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(216, 185, 138, 0.15)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  إجمالي الدعوات
                </MuiTypography>
                <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                  {invitations.length}
                </MuiTypography>
              </MuiPaper>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6} md={3}>
              <MuiPaper
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(216, 185, 138, 0.15)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  إجمالي المدعوين
                </MuiTypography>
                <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                  {totalInvitedPeople}
                </MuiTypography>
              </MuiPaper>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6} md={3}>
              <MuiPaper
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(216, 185, 138, 0.15)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  المؤكدين
                </MuiTypography>
                <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                  {totalCheckedIn}
                </MuiTypography>
              </MuiPaper>
            </MuiGrid>
            <MuiGrid item xs={12} sm={6} md={3}>
              <MuiPaper
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(216, 185, 138, 0.15)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                  المتبقي
                </MuiTypography>
                <MuiTypography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                  {totalInvitedPeople - totalCheckedIn}
                </MuiTypography>
              </MuiPaper>
            </MuiGrid>
          </MuiGrid>

          {/* Invitations List */}
          <MuiGrid container spacing={2}>
            {invitations.map((invitation) => (
              <MuiGrid item xs={12} sm={6} md={4} key={invitation._id}>
                <MuiPaper
                  sx={{
                    p: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(216, 185, 138, 0.15)',
                    borderRadius: '12px',
                  }}
                >
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Mail size={18} style={{ color: 'var(--color-primary-400)' }} />
                    <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 600, flex: 1 }}>
                      {invitation.guestName || 'دعوة بدون اسم'}
                    </MuiTypography>
                  </MuiBox>
                  <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                      عدد الأشخاص: {invitation.numOfPeople || 0}
                    </MuiTypography>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                      المؤكدين: {invitation.guests?.filter(g => g.checkedIn).length || 0}
                    </MuiTypography>
                    {invitation.qrCode && (
                      <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        رمز QR: {invitation.qrCode}
                      </MuiTypography>
                    )}
                    {invitation.qrCodeImage && (
                      <MuiBox
                        onClick={() => window.open(invitation.qrCodeImage, '_blank')}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border-glass)',
                          cursor: 'pointer',
                          mt: 0.5,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                          }
                        }}
                      >
                        <img
                          src={invitation.qrCodeImage}
                          alt="QR Code"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </MuiBox>
                    )}
                    {invitation.eventDate && (
                      <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        تاريخ الفعالية: {formatDate(invitation.eventDate, 'MM/DD/YYYY')}
                      </MuiTypography>
                    )}
                    {invitation.sentAt && (
                      <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        تاريخ الإرسال: {formatDate(invitation.sentAt, 'MM/DD/YYYY')}
                      </MuiTypography>
                    )}
                    {invitation.createdAt && (
                      <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        تاريخ الإنشاء: {formatDate(invitation.createdAt, 'MM/DD/YYYY')}
                      </MuiTypography>
                    )}
                    {invitation.updatedAt && (
                      <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                        آخر تحديث: {formatDate(invitation.updatedAt, 'MM/DD/YYYY')}
                      </MuiTypography>
                    )}
                    {invitation.guests && invitation.guests.length > 0 && (
                      <MuiBox sx={{ mt: 0.5 }}>
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>
                          الضيوف:
                        </MuiTypography>
                        {invitation.guests.map((guest, idx) => (
                          <MuiChip
                            key={guest._id || idx}
                            label={`${guest.name} ${guest.checkedIn ? '✓' : ''}`}
                            size="small"
                            sx={{
                              mr: 0.5,
                              mb: 0.5,
                              backgroundColor: guest.checkedIn ? 'var(--color-success-50)' : 'var(--color-primary-50)',
                              color: guest.checkedIn ? 'var(--color-success-700)' : 'var(--color-primary-700)',
                              fontSize: '0.65rem',
                              height: 18,
                              border: `1px solid ${guest.checkedIn ? 'var(--color-success-200)' : 'var(--color-primary-200)'}`,
                            }}
                          />
                        ))}
                      </MuiBox>
                    )}
                    <MuiBox sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                      <MuiChip
                        label={invitation.status === 'sent' ? 'مرسلة' : invitation.status}
                        size="small"
                        sx={{
                          backgroundColor: invitation.status === 'sent' ? 'var(--color-success-50)' : 'var(--color-primary-50)',
                          color: invitation.status === 'sent' ? 'var(--color-success-700)' : 'var(--color-primary-700)',
                          fontSize: '0.7rem',
                          height: 20,
                          border: `1px solid ${invitation.status === 'sent' ? 'var(--color-success-200)' : 'var(--color-primary-200)'}`,
                        }}
                      />
                      {invitation.used !== undefined && (
                        <MuiChip
                          label={invitation.used ? 'مستخدمة' : 'غير مستخدمة'}
                          size="small"
                          sx={{
                            backgroundColor: invitation.used ? 'var(--color-warning-50)' : 'var(--color-info-50)',
                            color: invitation.used ? 'var(--color-warning-700)' : 'var(--color-info-700)',
                            border: `1px solid ${invitation.used ? 'var(--color-warning-200)' : 'var(--color-info-200)'}`,
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      )}
                    </MuiBox>
                  </MuiBox>
                </MuiPaper>
              </MuiGrid>
            ))}
          </MuiGrid>
        </MuiPaper>
      )}
    </MuiBox>
  )
}

