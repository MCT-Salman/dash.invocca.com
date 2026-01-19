// src\pages\client\Invitations.jsx
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiButton from '@/components/ui/MuiButton'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiChip from '@/components/ui/MuiChip'
import { LoadingScreen, EmptyState, SEOHead, ConfirmDialog } from '@/components/common'
import { BaseFormDialog, FormField } from '@/components/shared'
import { useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getInvitations, createInvitation, updateInvitation, deleteInvitation, getClientDashboard, getClientTemplates, getTemplateById } from '@/api/client'
import { formatDate } from '@/utils/helpers'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Plus, UserCheck, Users, Edit2, Trash2, X, UserPlus, Download, Calendar, MapPin, Clock, Eye, ArrowLeft, Image as ImageIcon, FileImage, FileText, CheckCircle, QrCode, Send, CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiInputLabel from '@/components/ui/MuiInputLabel'
import MuiTextField from '@/components/ui/MuiTextField'
import { Controller } from 'react-hook-form'

// Validation schema - will be created dynamically with eventGuestCount and totalInvitedPeople
const createInvitationSchema = (eventGuestCount, totalInvitedPeople, isEdit, currentInvitationCount, isCreate) => {
  return z.object({
    eventId: isCreate ? z.string().min(1, 'يجب اختيار فعالية') : z.string().optional(),
    guestName: z.string().min(1, 'اسم الضيف مطلوب'),
    numOfPeople: z.coerce.number()
      .min(1, 'عدد الأشخاص يجب أن يكون على الأقل 1')
      .refine((val) => {
        // Always validate if eventGuestCount is defined and > 0
        if (!eventGuestCount || eventGuestCount <= 0) return true // No limit if eventGuestCount is 0 or undefined
        const newTotal = isEdit
          ? totalInvitedPeople - currentInvitationCount + val
          : totalInvitedPeople + val
        return newTotal <= eventGuestCount
      }, () => {
        const currentTotal = isEdit ? totalInvitedPeople - currentInvitationCount : totalInvitedPeople
        const remaining = eventGuestCount - currentTotal
        return {
          message: `عدد الضيوف في الفعالية هو ${eventGuestCount} فقط. المدعوون الحاليون: ${currentTotal}. يمكنك إضافة ${remaining > 0 ? remaining : 0} ضيف فقط.`
        }
      }),
    guests: z.array(z.object({
      name: z.string().min(1, 'اسم الضيف مطلوب')
    })).optional(),
  })
}

export default function Invitations() {
  const { addNotification: showNotification } = useNotification()

  // State for invitation card display
  const [showInvitationCard, setShowInvitationCard] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)

  // Dialog state management
  const {
    selectedItem: editingInvitation,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,
    isCreate,
    isEdit,
    isDelete,
  } = useDialogState()

  // Fetch invitations
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_INVITATIONS,
    queryFn: getInvitations,
  })

  // Fetch dashboard to get events (bookings are now part of dashboard)
  const { data: dashboardDataForEvents } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
  })

  // Fetch dashboard to get templates from events
  const { data: dashboardData } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
    enabled: showInvitationCard, // Only fetch when viewing card
  })

  // CRUD operations
  const {
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading: crudLoading,
  } = useCRUD({
    createFn: createInvitation,
    updateFn: (id, data) => updateInvitation(id, data),
    deleteFn: deleteInvitation,
    queryKey: QUERY_KEYS.CLIENT_INVITATIONS,
    successMessage: 'تمت العملية بنجاح',
    errorMessage: 'حدث خطأ أثناء العملية',
  })

  const invitations = data?.invitations || data?.data || []

  // Extract events (bookings) from dashboard data
  const dashboardResponse = dashboardDataForEvents?.data || dashboardDataForEvents || {}
  const bookings = dashboardResponse.allEvents || dashboardResponse.recentActivity?.events || dashboardResponse.events || []

  // Get the current event (assuming all invitations are for the same event, or get from first invitation)
  const currentEventId = invitations.length > 0
    ? (invitations[0]?.eventId?._id || invitations[0]?.eventId || null)
    : (bookings.length > 0 ? (bookings[0]?._id || bookings[0]?.id) : null)

  // Get eventGuestCount directly from invitation's eventId if available, otherwise from bookings
  const eventGuestCount = invitations.length > 0 && invitations[0]?.eventId?.guestCount !== undefined
    ? invitations[0].eventId.guestCount
    : (bookings.find(b => (b._id || b.id) === currentEventId)?.guestCount || bookings[0]?.guestCount || 0)

  // Calculate total invited people from existing invitations for the current event
  const totalInvitedPeople = invitations
    .filter(inv => {
      const invEventId = inv.eventId?._id || inv.eventId || null
      return invEventId === currentEventId
    })
    .reduce((sum, inv) => {
      return sum + (inv.numOfPeople || 0)
    }, 0)

  const handleSubmit = async (formData) => {
    // Get event guest count based on selected event (for create) or invitation's event (for edit)
    let currentEventGuestCount = eventGuestCount
    let currentTotalInvited = totalInvitedPeople
    let eventIdForValidation = currentEventId

    if (!isEdit && formData.eventId) {
      // For create, get guest count from selected event
      const selectedEvent = bookings.find(b => (b._id || b.id)?.toString() === formData.eventId?.toString())
      if (selectedEvent) {
        currentEventGuestCount = selectedEvent.guestCount || 0
        eventIdForValidation = selectedEvent._id || selectedEvent.id
        // Calculate total invited for this specific event
        currentTotalInvited = invitations
          .filter(inv => {
            const invEvtId = inv.eventId?._id || inv.eventId || null
            return invEvtId?.toString() === eventIdForValidation?.toString()
          })
          .reduce((sum, inv) => sum + (inv.numOfPeople || 0), 0)
      }
    } else if (isEdit && editingInvitation) {
      // For edit, use invitation's event
      eventIdForValidation = editingInvitation.eventId?._id || editingInvitation.eventId || null
      const event = bookings.find(b => (b._id || b.id)?.toString() === eventIdForValidation?.toString())
      if (event) {
        currentEventGuestCount = event.guestCount || 0
      }
      currentTotalInvited = invitations
        .filter(inv => {
          const invEvtId = inv.eventId?._id || inv.eventId || null
          return invEvtId?.toString() === eventIdForValidation?.toString()
        })
        .reduce((sum, inv) => sum + (inv.numOfPeople || 0), 0)
    }

    // Validate total guests count BEFORE submitting
    if (currentEventGuestCount > 0) {
      const currentInvitationCount = editingInvitation?.numOfPeople || 0
      const newTotal = isEdit
        ? currentTotalInvited - currentInvitationCount + formData.numOfPeople
        : currentTotalInvited + formData.numOfPeople

      if (newTotal > currentEventGuestCount) {
        const remaining = currentEventGuestCount - (isEdit ? currentTotalInvited - currentInvitationCount : currentTotalInvited)
        showNotification({
          title: 'خطأ',
          message: `عدد الضيوف في الفعالية هو ${currentEventGuestCount} فقط. المدعوون الحاليون: ${currentTotalInvited - (isEdit ? currentInvitationCount : 0)}. يمكنك إضافة ${remaining > 0 ? remaining : 0} ضيف فقط.`,
          type: 'error'
        })
        return // Stop execution - don't submit
      }
    }

    // Prepare data according to API requirements
    const submitData = {
      guestName: String(formData.guestName || '').trim(),
      numOfPeople: Number(formData.numOfPeople) || 1,
    }

    // Add eventId for create operation only (required)
    if (!isEdit && formData.eventId) {
      submitData.eventId = formData.eventId
    }

    // Validate required fields
    if (!submitData.guestName) {
      showNotification({
        title: 'خطأ',
        message: 'اسم الضيف مطلوب',
        type: 'error'
      })
      return
    }

    if (submitData.numOfPeople < 1) {
      showNotification({
        title: 'خطأ',
        message: 'عدد الأشخاص يجب أن يكون على الأقل 1',
        type: 'error'
      })
      return
    }

    // Validate eventId for create operation
    if (!isEdit && !submitData.eventId) {
      showNotification({
        title: 'خطأ',
        message: 'يجب اختيار فعالية',
        type: 'error'
      })
      return
    }

    // Add guests array if provided and not empty (for both create and edit)
    if (formData.guests && Array.isArray(formData.guests) && formData.guests.length > 0) {
      const validGuests = formData.guests.filter(g => g.name && g.name.trim()).map(g => ({ name: g.name.trim() }))
      if (validGuests.length > 0) {
        submitData.guests = validGuests
      }
    }

    if (isEdit && editingInvitation) {
      const result = await handleUpdate(editingInvitation.id || editingInvitation._id, submitData)
      if (result?.success !== false || result?.message) {
        closeDialog()
        return true
      }
      return false
    } else {
      const result = await handleCreate(submitData)
      if (result?.success !== false) {
        // User requested to keep dialog open and clear fields for batch addition
        // So we don't call closeDialog() or setShowInvitationCard(true) here
        return true
      }
      return false
    }
  }

  const handleDeleteConfirm = async () => {
    const id = editingInvitation?.id || editingInvitation?._id
    if (!id) return
    const result = await handleDelete(id)
    if (result?.success !== false) {
      closeDialog()
    }
  }

  if (isLoading) {
    return <LoadingScreen message="جاري تحميل الدعوات..." fullScreen={false} />
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="دعواتي - INVOCCA" />

      <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <MuiBox>
          <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
            دعواتي
          </MuiTypography>
          <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
            إدارة دعوات الضيوف لمناسباتك
          </MuiTypography>
        </MuiBox>
        <MuiButton
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={openCreateDialog}
          sx={{
            background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%)',
            color: '#000',
            fontWeight: 600,
            px: 3
          }}
        >
          إنشاء دعوة جديدة
        </MuiButton>
      </MuiBox>

      {invitations.length > 0 ? (
        <MuiGrid container spacing={3}>
          {invitations.map((invitation) => (
            <MuiGrid item xs={12} md={6} lg={4} key={invitation._id}>
              <MuiPaper
                elevation={0}
                sx={{
                  p: 3,
                  background: 'var(--color-surface-dark)',
                  border: '1px solid var(--color-border-glass)',
                  borderRadius: '16px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'var(--color-primary-500)',
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <MuiBox
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: 'rgba(216, 185, 138, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary-500)'
                    }}
                  >
                    <Mail size={24} />
                  </MuiBox>
                  <MuiBox>
                    <MuiTypography variant="subtitle1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                      {invitation.guestName || 'دعوة بدون اسم'}
                    </MuiTypography>
                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                      {invitation.eventId?.name || invitation.event?.name || '—'}
                    </MuiTypography>
                  </MuiBox>
                </MuiBox>

                <MuiBox sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                      <Users size={14} />
                      <MuiTypography variant="caption">
                        عدد المدعوين: {invitation.numOfPeople || invitation.guestCount || 0}
                      </MuiTypography>
                    </MuiBox>
                    {invitation.guests && invitation.guests.length > 0 && (
                      <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 3 }}>
                        {invitation.guests.map((guest, idx) => (
                          <MuiBox key={guest._id || idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                              • {guest.name}
                            </MuiTypography>
                            {guest.checkedIn ? (
                              <CheckCircle2 size={12} style={{ color: '#22c55e' }} />
                            ) : (
                              <XCircle size={12} style={{ color: 'var(--color-text-secondary)' }} />
                            )}
                          </MuiBox>
                        ))}
                      </MuiBox>
                    )}
                    {invitation.eventDate && (
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                        <Calendar size={14} />
                        <MuiTypography variant="caption">
                          تاريخ الفعالية: {formatDate(invitation.eventDate, 'MM/DD/YYYY')}
                        </MuiTypography>
                      </MuiBox>
                    )}
                    {invitation.qrCode && (
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                        <QrCode size={14} />
                        <MuiTypography variant="caption">
                          رمز QR: {invitation.qrCode}
                        </MuiTypography>
                      </MuiBox>
                    )}
                    {invitation.sentAt && (
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                        <Send size={14} />
                        <MuiTypography variant="caption">
                          تاريخ الإرسال: {formatDate(invitation.sentAt, 'MM/DD/YYYY HH:mm')}
                        </MuiTypography>
                      </MuiBox>
                    )}
                    {invitation.createdAt && (
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                        <Calendar size={14} />
                        <MuiTypography variant="caption">
                          تاريخ الإنشاء: {formatDate(invitation.createdAt, 'MM/DD/YYYY HH:mm')}
                        </MuiTypography>
                      </MuiBox>
                    )}
                    {invitation.updatedAt && invitation.updatedAt !== invitation.createdAt && (
                      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                        <Calendar size={14} />
                        <MuiTypography variant="caption">
                          آخر تحديث: {formatDate(invitation.updatedAt, 'MM/DD/YYYY HH:mm')}
                        </MuiTypography>
                      </MuiBox>
                    )}
                  </MuiBox>

                  <MuiBox sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <MuiChip
                      label={invitation.status === 'sent' ? 'مرسلة' : invitation.status || '—'}
                      size="small"
                      sx={{
                        backgroundColor: invitation.status === 'sent' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(216, 185, 138, 0.1)',
                        color: invitation.status === 'sent' ? '#22c55e' : 'var(--color-primary-400)',
                        fontSize: '0.7rem',
                        height: 22
                      }}
                    />
                    <MuiChip
                      label={invitation.used ? 'مستخدمة' : 'غير مستخدمة'}
                      size="small"
                      sx={{
                        backgroundColor: invitation.used ? 'rgba(249, 115, 22, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: invitation.used ? '#f97316' : '#3b82f6',
                        fontSize: '0.7rem',
                        height: 22
                      }}
                    />
                  </MuiBox>

                  {invitation.guests && invitation.guests.length > 0 && (
                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)', mb: 1 }}>
                      <UserCheck size={14} />
                      <MuiTypography variant="caption">
                        المؤكدون: {invitation.guests.filter(g => g.checkedIn).length} / {invitation.guests.length}
                      </MuiTypography>
                    </MuiBox>
                  )}
                </MuiBox>

                {/* Actions */}
                <MuiBox sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <MuiIconButton
                    size="small"
                    onClick={() => {
                      setSelectedInvitation(invitation)
                      setShowInvitationCard(true)
                    }}
                    sx={{
                      color: 'var(--color-primary-500)',
                      '&:hover': {
                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                      }
                    }}
                    title="عرض الكرت"
                  >
                    <Eye size={16} />
                  </MuiIconButton>
                  <MuiIconButton
                    size="small"
                    onClick={() => openEditDialog(invitation)}
                    sx={{
                      color: 'var(--color-primary-500)',
                      '&:hover': {
                        backgroundColor: 'rgba(216, 185, 138, 0.1)',
                      }
                    }}
                    title="تعديل"
                  >
                    <Edit2 size={16} />
                  </MuiIconButton>
                  <MuiIconButton
                    size="small"
                    onClick={() => openDeleteDialog(invitation)}
                    sx={{
                      color: 'var(--color-error-500)',
                      '&:hover': {
                        backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      }
                    }}
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </MuiIconButton>
                </MuiBox>
              </MuiPaper>
            </MuiGrid>
          ))}
        </MuiGrid>
      ) : (
        <EmptyState
          title="لا توجد دعوات"
          description="ابدأ بإنشاء دعوات لضيوفك الآن."
          icon={Mail}
        />
      )}

      {/* Add/Edit Invitation Dialog */}
      <CreateEditInvitationDialog
        open={isCreate || isEdit}
        onClose={closeDialog}
        editingInvitation={isEdit ? editingInvitation : null}
        onSubmit={handleSubmit}
        loading={crudLoading}
        eventGuestCount={eventGuestCount}
        totalInvitedPeople={totalInvitedPeople}
        bookings={bookings}
        invitations={invitations}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDelete}
        onClose={closeDialog}
        onConfirm={handleDeleteConfirm}
        title="حذف الدعوة"
        message={`هل أنت متأكد من حذف الدعوة "${editingInvitation?.guestName || editingInvitation?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        loading={crudLoading}
      />

      {/* Invitation Card Full Page View */}
      {selectedInvitation && (
        <InvitationCardView
          open={showInvitationCard}
          onClose={() => {
            setShowInvitationCard(false)
            setSelectedInvitation(null)
            setSelectedTemplateId(null)
          }}
          invitation={selectedInvitation}
          bookings={bookings}
          dashboardData={dashboardData}
          selectedTemplateId={selectedTemplateId}
          onTemplateChange={setSelectedTemplateId}
        />
      )}
    </MuiBox>
  )
}

// Invitation Card Full Page View Component
function InvitationCardView({ open, onClose, invitation, bookings, dashboardData, selectedTemplateId, onTemplateChange }) {
  const cardRef = useRef(null)

  // Get event information from bookings or directly from invitation.eventId
  const eventId = invitation?.eventId?._id || invitation?.eventId || null
  const event = (invitation?.eventId && typeof invitation.eventId === 'object' && invitation.eventId.name)
    ? invitation.eventId
    : (bookings?.find(b => (b._id || b.id) === eventId) || null)

  // Fetch templates for this event/user
  const { data: templatesData } = useQuery({
    queryKey: ['client', 'templates'],
    queryFn: () => getClientTemplates(),
    enabled: open, // Only fetch when dialog is open
  })

  // Get template ID from invitation event
  const templateIdFromEvent = useMemo(() => {
    if (invitation?.eventId?.template) {
      if (typeof invitation.eventId.template === 'string') {
        return invitation.eventId.template
      } else if (typeof invitation.eventId.template === 'object') {
        return invitation.eventId.template._id || invitation.eventId.template.id
      }
    }
    return null
  }, [invitation])

  // Fetch full template data if we only have an ID
  const { data: fullTemplateData, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['client', 'template', templateIdFromEvent],
    queryFn: () => getTemplateById(templateIdFromEvent),
    enabled: open && !!templateIdFromEvent, // Only fetch when dialog is open and we have a template ID
  })

  // Debug: log template fetching
  console.log('🔍 Template Fetching Debug:', {
    'templateIdFromEvent': templateIdFromEvent,
    'fullTemplateData': fullTemplateData,
    'isLoadingTemplate': isLoadingTemplate,
    'open': open
  })

  // Get available templates from dashboard or event
  const allEvents = useMemo(() => {
    const responseData = dashboardData?.data || dashboardData || {}
    return responseData.allEvents || responseData.recentActivity?.events || responseData.events || []
  }, [dashboardData])

  // Get current event from available data
  const currentEvent = useMemo(() => {
    return allEvents.find(e => (e._id || e.id) === eventId) || event
  }, [allEvents, eventId, event])

  // Extract templates from API and events - prioritize API templates
  const availableTemplates = useMemo(() => {
    const templates = []
    const responseData = dashboardData?.data || dashboardData || {}

    // Priority 0: Get full template data if we fetched it by ID
    if (fullTemplateData) {
      console.log('🔍 Full Template Data from API:', JSON.stringify(fullTemplateData, null, 2))
      const template = fullTemplateData.template || fullTemplateData.data || fullTemplateData
      if (template && (template._id || template.id)) {
        const templateId = template._id || template.id
        const existingIndex = templates.findIndex(t => {
          const tId = t._id || t.id
          return tId && templateId && tId.toString() === templateId.toString()
        })

        const fullTemplate = {
          _id: templateId,
          id: templateId,
          templateName: template.templateName || template.name || `Template ${templateId}`,
          imageUrl: template.imageUrl || template.image || '',
          ...template
        }

        console.log('🔍 Full Template Object:', JSON.stringify(fullTemplate, null, 2))

        if (existingIndex >= 0) {
          // Update existing template with full data
          templates[existingIndex] = fullTemplate
        } else {
          // Add new template
          templates.push(fullTemplate)
        }
      }
    }

    // Priority 1: Get templates from API (templatesData)
    const apiTemplates = templatesData?.templates || templatesData?.data?.templates || templatesData?.data || []

    // Debug: log API response
    console.log('🔍 Templates API Response:', {
      'templatesData': templatesData,
      'apiTemplates': apiTemplates,
      'isArray': Array.isArray(apiTemplates),
      'length': Array.isArray(apiTemplates) ? apiTemplates.length : 'not array'
    })
    console.log('🔍 Templates API Response (Full):', JSON.stringify({
      'templatesData': templatesData,
      'apiTemplates': apiTemplates
    }, null, 2))

    if (Array.isArray(apiTemplates) && apiTemplates.length > 0) {
      apiTemplates.forEach(template => {
        if (template && typeof template === 'object') {
          // Accept templates even if they don't have both image and name (for now)
          const hasImage = !!(template.imageUrl || template.image)
          const hasName = !!(template.templateName || template.name || template._id || template.id)

          // Add template if it has at least an ID (required) and preferably an image
          if (hasName) {
            const templateId = template._id || template.id
            if (templateId && !templates.find(t => (t._id || t.id) === templateId)) {
              templates.push(template)
            }
          }
        }
      })
    }

    // Priority 2: Extract templates from events (fallback)
    // Collect all events from different sources
    const allEventsList = [
      ...(Array.isArray(allEvents) ? allEvents : []),
      ...(Array.isArray(responseData.recentActivity?.events) ? responseData.recentActivity.events : []),
      ...(Array.isArray(responseData.allEvents) ? responseData.allEvents : []),
      ...(Array.isArray(responseData.events) ? responseData.events : []),
      ...(currentEvent ? [currentEvent] : []),
      ...(event ? [event] : []),
      ...(invitation?.eventId && typeof invitation.eventId === 'object' ? [invitation.eventId] : []),
      ...(responseData.nextEvent ? [responseData.nextEvent] : []),
    ]

    // Helper function to find full template object by ID in all events
    const findFullTemplateById = (templateId) => {
      if (!templateId) return null

      // Search through all events to find the full template object
      for (const evt of allEventsList) {
        const evtTemplate = evt.template || evt.templateId
        if (evtTemplate && typeof evtTemplate === 'object') {
          const evtTemplateId = evtTemplate._id || evtTemplate.id
          if (evtTemplateId && evtTemplateId.toString() === templateId.toString()) {
            // Check if this template has full data (imageUrl and templateName)
            if (evtTemplate.imageUrl || evtTemplate.image || evtTemplate.templateName || evtTemplate.name) {
              return evtTemplate
            }
          }
        }
      }

      // Also check dashboard response for templates
      if (responseData.templates && Array.isArray(responseData.templates)) {
        for (const template of responseData.templates) {
          const templateIdCheck = template._id || template.id
          if (templateIdCheck && templateIdCheck.toString() === templateId.toString()) {
            return template
          }
        }
      }

      // Check nextEvent template
      if (responseData.nextEvent?.template && typeof responseData.nextEvent.template === 'object') {
        const nextEventTemplateId = responseData.nextEvent.template._id || responseData.nextEvent.template.id
        if (nextEventTemplateId && nextEventTemplateId.toString() === templateId.toString()) {
          return responseData.nextEvent.template
        }
      }

      // Check if template is nested in event data (e.g., event.template as object with full data)
      // Sometimes the template might be populated in some events but not others
      for (const evt of allEventsList) {
        // Check if event has a populated template field
        if (evt.template && typeof evt.template === 'object' && evt.template._id) {
          const evtTemplateId = evt.template._id || evt.template.id
          if (evtTemplateId && evtTemplateId.toString() === templateId.toString()) {
            // Return if it has at least imageUrl or templateName
            if (evt.template.imageUrl || evt.template.image || evt.template.templateName || evt.template.name) {
              return evt.template
            }
          }
        }
      }

      return null
    }

    // Helper function to add template if not already exists
    const addTemplate = (template) => {
      if (!template) return

      // If it's a full object
      if (typeof template === 'object') {
        // Check if template has required fields (at least an ID)
        const templateId = template._id || template.id
        if (!templateId) return // Must have an ID

        // Check if already added
        const existingTemplate = templates.find(t => {
          const tId = t._id || t.id
          return tId && templateId && tId.toString() === templateId.toString()
        })

        if (existingTemplate) {
          // If already exists but incomplete, try to enrich it
          if (!existingTemplate.imageUrl && !existingTemplate.templateName) {
            const fullTemplate = findFullTemplateById(templateId)
            if (fullTemplate) {
              // Update existing template with full data
              const index = templates.indexOf(existingTemplate)
              templates[index] = {
                ...existingTemplate,
                templateName: fullTemplate.templateName || fullTemplate.name || existingTemplate.templateName,
                imageUrl: fullTemplate.imageUrl || fullTemplate.image || existingTemplate.imageUrl,
                ...fullTemplate // Include all other properties
              }
            }
          }
          return // Already added
        }

        // Check if this template has full data (imageUrl and templateName)
        const hasFullData = !!(template.imageUrl || template.image) && !!(template.templateName || template.name)

        if (hasFullData) {
          // Add template with full data
          templates.push({
            _id: templateId,
            id: templateId,
            templateName: template.templateName || template.name,
            imageUrl: template.imageUrl || template.image,
            ...template // Include all other properties
          })
        } else {
          // Try to find full template data
          const fullTemplate = findFullTemplateById(templateId)
          if (fullTemplate) {
            templates.push({
              _id: templateId,
              id: templateId,
              templateName: fullTemplate.templateName || fullTemplate.name || template.templateName || template.name || `Template ${templateId}`,
              imageUrl: fullTemplate.imageUrl || fullTemplate.image || template.imageUrl || template.image || '',
              ...fullTemplate, // Include all properties from full template
              ...template // Override with any properties from current template
            })
          } else {
            // Add template even if incomplete (will be enriched later if found)
            templates.push({
              _id: templateId,
              id: templateId,
              templateName: template.templateName || template.name || `Template ${templateId}`,
              imageUrl: template.imageUrl || template.image || '',
              ...template // Include all other properties
            })
          }
        }
      } else if (typeof template === 'string') {
        // If it's a string ID, search for full template object
        const fullTemplate = findFullTemplateById(template)

        if (fullTemplate) {
          const templateId = fullTemplate._id || fullTemplate.id || template
          if (!templates.find(t => {
            const tId = t._id || t.id
            return tId && tId.toString() === templateId.toString()
          })) {
            templates.push({
              _id: templateId,
              id: templateId,
              templateName: fullTemplate.templateName || fullTemplate.name || `Template ${templateId}`,
              imageUrl: fullTemplate.imageUrl || fullTemplate.image || '',
              ...fullTemplate
            })
          }
        } else {
          // If not found, add as a minimal template object
          // But try to enrich it later by searching again
          if (!templates.find(t => {
            const tId = t._id || t.id
            return tId && tId.toString() === template.toString()
          })) {
            templates.push({
              _id: template,
              id: template,
              templateName: `Template ${template}`,
              imageUrl: ''
            })
          }
        }
      }
    }

    // Priority 2: Extract templates from events (always check, not just if API failed)
    // First, prioritize the current event's template
    if (currentEvent) {
      console.log('🔍 Current Event Template:', {
        'currentEvent': currentEvent,
        'template': currentEvent.template,
        'templateId': currentEvent.templateId
      })
      console.log('🔍 Current Event Template (Full):', JSON.stringify({
        'currentEvent': currentEvent,
        'template': currentEvent.template,
        'templateId': currentEvent.templateId
      }, null, 2))
      if (currentEvent.template) addTemplate(currentEvent.template)
      if (currentEvent.templateId) addTemplate(currentEvent.templateId)
    }

    // Then check invitation's event template
    if (invitation?.eventId && typeof invitation.eventId === 'object') {
      console.log('🔍 Invitation Event Template:', {
        'invitation.eventId': invitation.eventId,
        'template': invitation.eventId.template,
        'templateId': invitation.eventId.templateId
      })
      console.log('🔍 Invitation Event Template (Full):', JSON.stringify({
        'invitation.eventId': invitation.eventId,
        'template': invitation.eventId.template,
        'templateId': invitation.eventId.templateId
      }, null, 2))
      if (invitation.eventId.template) addTemplate(invitation.eventId.template)
      if (invitation.eventId.templateId) addTemplate(invitation.eventId.templateId)
    }

    // Then extract from all other events
    allEventsList.forEach(evt => {
      // Skip if this is the current event (already processed)
      const evtId = evt._id || evt.id
      const currentEventId = currentEvent?._id || currentEvent?.id
      if (evtId && currentEventId && evtId.toString() === currentEventId.toString()) {
        return // Skip current event
      }

      if (evt.template) addTemplate(evt.template)
      if (evt.templateId) addTemplate(evt.templateId)
    })

    // Also check if templates are directly in dashboard response
    if (responseData.templates && Array.isArray(responseData.templates)) {
      responseData.templates.forEach(template => addTemplate(template))
    }

    // After extracting all templates, try to enrich incomplete ones
    // Note: This is async but we can't use await in useMemo, so we'll handle it differently
    // For now, we'll enrich synchronously from available data
    templates.forEach((template, index) => {
      if (!template.imageUrl || !template.templateName || template.templateName.startsWith('Template ')) {
        const templateId = template._id || template.id
        // Try to find in local data first (synchronous)
        let fullTemplate = null

        // Search through all events
        for (const evt of allEventsList) {
          const evtTemplate = evt.template || evt.templateId
          if (evtTemplate && typeof evtTemplate === 'object') {
            const evtTemplateId = evtTemplate._id || evtTemplate.id
            if (evtTemplateId && evtTemplateId.toString() === templateId.toString()) {
              if (evtTemplate.imageUrl || evtTemplate.image || evtTemplate.templateName || evtTemplate.name) {
                fullTemplate = evtTemplate
                break
              }
            }
          }
        }

        // Check dashboard templates
        if (!fullTemplate && responseData.templates && Array.isArray(responseData.templates)) {
          for (const t of responseData.templates) {
            const tId = t._id || t.id
            if (tId && tId.toString() === templateId.toString()) {
              fullTemplate = t
              break
            }
          }
        }

        if (fullTemplate) {
          templates[index] = {
            ...template,
            templateName: fullTemplate.templateName || fullTemplate.name || template.templateName,
            imageUrl: fullTemplate.imageUrl || fullTemplate.image || template.imageUrl,
            ...fullTemplate // Include all properties from full template
          }
        }
      }
    })

    // Debug: log for troubleshooting
    console.log('🔍 Template Extraction Debug:', {
      'Templates Data (API)': templatesData,
      'API Templates': apiTemplates,
      'Dashboard Data': responseData,
      'All Events List': allEventsList,
      'Current Event': currentEvent,
      'Current Event Template': currentEvent?.template,
      'Current Event TemplateId': currentEvent?.templateId,
      'Invitation Event': invitation?.eventId,
      'Invitation Event Template': invitation?.eventId?.template,
      'Invitation Event TemplateId': invitation?.eventId?.templateId,
      'Extracted Templates': templates,
      'Available Templates Count': templates.length,
    })
    console.log('🔍 Template Extraction Debug (Full):', JSON.stringify({
      'Extracted Templates': templates,
      'Available Templates Count': templates.length,
      'First Template': templates[0],
      'All Events Templates': allEventsList.map(evt => ({
        'eventId': evt._id || evt.id,
        'template': evt.template,
        'templateId': evt.templateId
      }))
    }, null, 2))

    return templates
  }, [templatesData, dashboardData, allEvents, currentEvent, invitation, event, fullTemplateData])

  // Get selected template - prioritize user selection, then API templates, then event templates
  const selectedTemplate = useMemo(() => {
    // If selectedTemplateId is explicitly null, return null (no template)
    if (selectedTemplateId === null) {
      return null
    }
    // Priority 1: If a template ID is selected from dropdown, find it in availableTemplates (from API)
    if (selectedTemplateId) {
      const found = availableTemplates.find(t => {
        const tId = t._id || t.id
        return tId && tId.toString() === selectedTemplateId.toString()
      })
      if (found) return found
    }
    // Priority 2: Check if current event has a template and find it in availableTemplates
    const eventTemplateId = currentEvent?.template?._id || currentEvent?.template?.id ||
      currentEvent?.templateId?._id || currentEvent?.templateId?.id ||
      currentEvent?.templateId
    if (eventTemplateId) {
      const found = availableTemplates.find(t => {
        const tId = t._id || t.id
        return tId && tId.toString() === eventTemplateId.toString()
      })
      if (found) return found
    }
    // Priority 3: Check invitation event template
    const invitationTemplateId = invitation?.eventId?.template?._id || invitation?.eventId?.template?.id ||
      invitation?.eventId?.templateId?._id || invitation?.eventId?.templateId?.id ||
      invitation?.eventId?.templateId
    if (invitationTemplateId) {
      const found = availableTemplates.find(t => {
        const tId = t._id || t.id
        return tId && tId.toString() === invitationTemplateId.toString()
      })
      if (found) return found
    }
    // Priority 4: Use first available template from API (if any)
    return availableTemplates[0] || null
  }, [selectedTemplateId, availableTemplates, currentEvent, invitation, event])

  // Get template image - check multiple possible locations with priority
  const templateImage = useMemo(() => {
    // Priority 1: Selected template from dropdown
    if (selectedTemplate) {
      const img = selectedTemplate.imageUrl || selectedTemplate.image
      if (img) return img
    }

    // Priority 2: Template from current event
    if (currentEvent?.template && typeof currentEvent.template === 'object') {
      const img = currentEvent.template.imageUrl || currentEvent.template.image
      if (img) return img
    }

    // Priority 3: Template from invitation event
    if (invitation?.eventId?.template && typeof invitation.eventId.template === 'object') {
      const img = invitation.eventId.template.imageUrl || invitation.eventId.template.image
      if (img) return img
    }

    // Priority 4: Template from event prop
    if (event?.template && typeof event.template === 'object') {
      const img = event.template.imageUrl || event.template.image
      if (img) return img
    }

    // Priority 5: Template from nextEvent
    const responseData = dashboardData?.data || dashboardData || {}
    if (responseData.nextEvent?.template && typeof responseData.nextEvent.template === 'object') {
      const img = responseData.nextEvent.template.imageUrl || responseData.nextEvent.template.image
      if (img) return img
    }

    return null
  }, [selectedTemplate, currentEvent, invitation, event, dashboardData])

  const templateImageUrl = useMemo(() => {
    if (!templateImage) return null

    // If already a full URL, return as is
    if (templateImage.startsWith('http://') || templateImage.startsWith('https://')) {
      return templateImage
    }

    // If starts with /, add base URL
    if (templateImage.startsWith('/')) {
      return `http://82.137.244.167:5001${templateImage}`
    }

    // Otherwise, assume it's a relative path and add base URL with /
    return `http://82.137.244.167:5001/${templateImage}`
  }, [templateImage])

  if (!open || !invitation) return null

  // Export to PNG
  const handleExportPNG = async () => {
    if (!cardRef.current) return

    try {
      // Wait longer to ensure fonts and images are fully loaded
      await new Promise(resolve => setTimeout(resolve, 1000))

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3, // Increased scale for better quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: false, // Disable foreignObject for better text rendering
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        onclone: (clonedDoc, element) => {
          if (element) {
            // Set base RTL direction
            element.style.direction = 'rtl'
            element.style.unicodeBidi = 'embed'
            element.style.visibility = 'visible'
            element.style.opacity = '1'

            // Process all text elements
            const allElements = element.querySelectorAll('*')
            allElements.forEach((el) => {
              try {
                const computedStyle = window.getComputedStyle(el)
                const text = el.textContent || el.innerText || ''

                el.style.visibility = 'visible'
                el.style.opacity = '1'

                // Handle Arabic text with proper font rendering
                if (text.trim() && /[\u0600-\u06FF]/.test(text)) {
                  el.style.direction = 'rtl'
                  el.style.unicodeBidi = 'embed'
                  el.style.textAlign = computedStyle.textAlign || 'center'

                  // Preserve ALL font properties exactly as computed
                  el.style.fontFamily = computedStyle.fontFamily
                  el.style.fontSize = computedStyle.fontSize
                  el.style.fontWeight = computedStyle.fontWeight
                  el.style.fontStyle = computedStyle.fontStyle
                  el.style.fontVariant = computedStyle.fontVariant
                  el.style.letterSpacing = computedStyle.letterSpacing
                  el.style.wordSpacing = computedStyle.wordSpacing
                  el.style.lineHeight = computedStyle.lineHeight
                  el.style.textDecoration = computedStyle.textDecoration
                  el.style.textTransform = 'none' // Prevent any text transformation

                  // Ensure proper spacing
                  el.style.whiteSpace = computedStyle.whiteSpace || 'normal'
                  el.style.wordWrap = 'break-word'
                  el.style.overflowWrap = 'break-word'

                  // Remove any transforms that might affect text
                  el.style.transform = 'none'
                  el.style.webkitTransform = 'none'

                  // Ensure color is visible
                  if (!computedStyle.color || computedStyle.color === 'rgb(0, 0, 0)' || computedStyle.color === 'black') {
                    el.style.color = '#D8B98A'
                  }

                  // Force text rendering properties
                  el.style.webkitFontSmoothing = 'antialiased'
                  el.style.mozOsxFontSmoothing = 'grayscale'
                  el.style.textRendering = 'optimizeLegibility'
                }
              } catch {
                // Ignore errors
              }
            })
          }
        }
      })

      const link = document.createElement('a')
      link.download = `invitation-${invitation.guestName || 'invitation'}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
    } catch (error) {
      console.error('Error exporting PNG:', error)
    }
  }

  // Export to PDF
  const handleExportPDF = async () => {
    if (!cardRef.current) return

    try {
      // Wait longer to ensure fonts and images are fully loaded
      await new Promise(resolve => setTimeout(resolve, 1000))

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc, element) => {
          // Fix the cloned element
          if (element) {
            element.style.direction = 'rtl'
            element.style.unicodeBidi = 'embed'
            element.style.visibility = 'visible'
            element.style.opacity = '1'
            element.style.position = 'relative'
            element.style.overflow = 'visible'

            // Fix all text elements
            const allElements = element.querySelectorAll('*')
            allElements.forEach((el) => {
              try {
                const originalStyle = window.getComputedStyle(el)
                const text = el.textContent || el.innerText || ''

                // Ensure element is visible
                el.style.visibility = 'visible'
                el.style.opacity = '1'

                // Check if element contains Arabic text
                if (text.trim() && /[\u0600-\u06FF]/.test(text)) {
                  // Use embed instead of bidi-override to prevent character overlap
                  el.style.direction = 'rtl'
                  el.style.unicodeBidi = 'embed'
                  el.style.textAlign = originalStyle.textAlign || 'center'

                  // Preserve font properties
                  el.style.fontFamily = originalStyle.fontFamily
                  el.style.fontSize = originalStyle.fontSize
                  el.style.fontWeight = originalStyle.fontWeight
                  el.style.letterSpacing = originalStyle.letterSpacing || 'normal'
                  el.style.wordSpacing = originalStyle.wordSpacing || 'normal'
                  el.style.lineHeight = originalStyle.lineHeight

                  // Ensure text color is visible
                  const color = originalStyle.color
                  if (!color || color === 'rgb(0, 0, 0)' || color === 'black' || color === 'rgba(0, 0, 0, 0)') {
                    el.style.color = '#D8B98A'
                  }

                  // Prevent transformations and ensure proper spacing
                  el.style.transform = 'none'
                  el.style.webkitTransform = 'none'
                  el.style.whiteSpace = originalStyle.whiteSpace || 'normal'
                  el.style.wordWrap = 'break-word'
                  el.style.overflowWrap = 'break-word'
                }
              } catch {
                // Ignore errors for individual elements
              }
            })
          }
        }
      })

      const imgData = canvas.toDataURL('image/png', 1.0)

      // Create image to get dimensions
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imgData
      })

      const imgWidth = img.width * 0.264583 // Convert pixels to mm
      const imgHeight = img.height * 0.264583

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [imgWidth, imgHeight]
      })

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`invitation-${invitation.guestName || 'invitation'}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
    }
  }


  // Extract event data - prioritize invitation.eventId if it's a full object
  const eventData = invitation.eventId && typeof invitation.eventId === 'object' && (invitation.eventId.name || invitation.eventId._id)
    ? invitation.eventId
    : event

  const eventName = eventData?.name || eventData?.eventName || 'فعالية'
  const eventDate = eventData?.date || eventData?.eventDate || invitation.eventDate || invitation.eventId?.date || invitation.eventId?.eventDate
  const startTime = eventData?.startTime || invitation.eventId?.startTime || ''
  const endTime = eventData?.endTime || invitation.eventId?.endTime || ''

  // Helper function to convert 24-hour time to 12-hour format
  const convertTo12Hour = (time24) => {
    if (!time24) return ''
    try {
      // Handle different time formats (HH:mm, HH:mm:ss, etc.)
      const [hours, minutes] = time24.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) return time24

      const period = hours >= 12 ? 'PM' : 'AM'
      const hours12 = hours % 12 || 12
      const minutesStr = minutes.toString().padStart(2, '0')

      return `${hours12}:${minutesStr} ${period}`
    } catch {
      return time24
    }
  }

  // Format time - ensure both times are shown in 12-hour format
  const formattedStartTime = startTime ? convertTo12Hour(startTime) : ''
  const formattedEndTime = endTime ? convertTo12Hour(endTime) : ''
  const eventTime = formattedStartTime && formattedEndTime
    ? `من ${formattedStartTime} إلى ${formattedEndTime}`
    : (formattedStartTime || formattedEndTime || '')
  const eventType = eventData?.type || eventData?.eventType || invitation.eventId?.type || ''

  // Hall data - check if hall is populated or just an ID
  const hallData = eventData?.hallId || eventData?.hall || invitation.eventId?.hallId || invitation.eventId?.hall || event?.hallId || event?.hall

  // Extract hall name - handle both object and string ID cases, check all possible sources
  let hallName = ''
  if (hallData) {
    if (typeof hallData === 'object') {
      hallName = hallData?.name || hallData?.hallName || ''
    }
  }
  // If hallName is still empty, try to get it from event data directly
  if (!hallName) {
    hallName = eventData?.hallName ||
      eventData?.hall?.name ||
      invitation.eventId?.hallName ||
      invitation.eventId?.hall?.name ||
      event?.hallName ||
      event?.hall?.name ||
      currentEvent?.hallName ||
      currentEvent?.hall?.name ||
      ''
  }

  const hallLocation = typeof hallData === 'object' ? (hallData?.location || '') : (eventData?.hallLocation || event?.hallLocation || '')
  const hallCapacity = typeof hallData === 'object' ? (hallData?.capacity || '') : (eventData?.hallCapacity || event?.hallCapacity || '')

  // Event type labels
  const eventTypeLabels = {
    wedding: 'زفاف',
    birthday: 'عيد ميلاد',
    engagement: 'خطوبة',
    graduation: 'تخرج',
    corporate: 'فعالية شركات',
    other: 'أخرى'
  }

  // Invitation details
  const invitationGuests = invitation?.guests || []

  // Format date - ensure it's always displayed (US-en format: MM/DD/YYYY)
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
    : (invitation.eventDate
      ? new Date(invitation.eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      })
      : '')

  return (
    <MuiBox
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'var(--color-surface-dark)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar - Actions */}
      <MuiBox
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(26, 26, 26, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid var(--color-border-glass)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          zIndex: 10,
        }}
      >
        <MuiButton
          onClick={onClose}
          startIcon={<ArrowLeft size={18} />}
          sx={{
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-border-glass)',
            minWidth: '100px',
            '&:hover': {
              backgroundColor: 'rgba(216, 185, 138, 0.1)',
              borderColor: 'var(--color-primary-500)',
            }
          }}
          variant="outlined"
        >
          العودة
        </MuiButton>

        <MuiBox sx={{ display: 'flex', gap: 1 }}>
          <MuiButton
            startIcon={<FileImage size={16} />}
            onClick={handleExportPNG}
            sx={{
              backgroundColor: 'rgba(216, 185, 138, 0.1)',
              color: 'var(--color-primary-500)',
              border: '1px solid rgba(216, 185, 138, 0.3)',
              minWidth: '90px',
              '&:hover': {
                backgroundColor: 'rgba(216, 185, 138, 0.2)',
                borderColor: 'var(--color-primary-500)',
              }
            }}
            variant="outlined"
          >
            PNG
          </MuiButton>
          <MuiButton
            startIcon={<FileText size={16} />}
            onClick={handleExportPDF}
            sx={{
              backgroundColor: 'rgba(216, 185, 138, 0.1)',
              color: 'var(--color-primary-500)',
              border: '1px solid rgba(216, 185, 138, 0.3)',
              minWidth: '90px',
              '&:hover': {
                backgroundColor: 'rgba(216, 185, 138, 0.2)',
                borderColor: 'var(--color-primary-500)',
              }
            }}
            variant="outlined"
          >
            PDF
          </MuiButton>
        </MuiBox>
      </MuiBox>

      {/* Main Content - Side by Side Layout */}
      <MuiBox
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          overflow: 'hidden',
          gap: { xs: 0, lg: 3 },
        }}
      >
        {/* Left Side - Invitation Card */}
        <MuiBox
          sx={{
            flex: { xs: '1 1 auto', lg: '1 1 60%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 3, md: 4 },
            overflow: 'auto',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRight: { lg: '2px solid var(--color-border-glass)' },
          }}
        >
          <MuiBox
            ref={cardRef}
            data-card-ref="true"
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: { xs: '100%', sm: '320px', md: '360px' },
              height: 'fit-content',
              maxHeight: 'calc(100vh - 120px)',
              background: templateImageUrl
                ? `url("${templateImageUrl}") center/cover no-repeat`
                : 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '3px solid rgba(216, 185, 138, 0.5)',
              boxShadow: '0 30px 100px rgba(0, 0, 0, 0.5), 0 0 60px rgba(216, 185, 138, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.2)',
              backgroundSize: templateImageUrl ? 'cover' : 'auto',
              backgroundPosition: templateImageUrl ? 'center' : 'top',
              backgroundRepeat: templateImageUrl ? 'no-repeat' : 'repeat',
              backgroundAttachment: 'local',
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              direction: 'rtl',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 35px 120px rgba(0, 0, 0, 0.6), 0 0 80px rgba(216, 185, 138, 0.4), inset 0 0 40px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            {/* Subtle overlay for better text readability - only if template image exists */}
            {templateImageUrl && (
              <MuiBox
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.4) 100%)',
                  zIndex: 1,
                }}
              />
            )}

            {/* Decorative side patterns (golden ornamental patterns on edges) */}
            <MuiBox
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '80px',
                height: '100%',
                background: 'linear-gradient(to right, rgba(216, 185, 138, 0.15) 0%, transparent 100%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
            <MuiBox
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '100%',
                background: 'linear-gradient(to left, rgba(216, 185, 138, 0.15) 0%, transparent 100%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />

            {/* Content */}
            <MuiBox
              sx={{
                position: 'relative',
                zIndex: 3,
                p: { xs: 1, sm: 1.25, md: 1.5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: { xs: 0.75, sm: 1 },
                color: '#fff',
                flex: 1,
                direction: 'rtl',
                fontFamily: "'Alexandria', 'Montserrat', sans-serif",
              }}
            >
              {/* Top Section - Golden Frame for QR Code or Image */}
              <MuiBox sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1, sm: 1.25 } }}>
                {invitation.qrCodeImage ? (
                  <MuiBox
                    sx={{
                      width: { xs: '90px', sm: '100px', md: '110px' },
                      height: { xs: '90px', sm: '100px', md: '110px' },
                      border: '2px solid #D8B98A',
                      borderRadius: '8px',
                      p: 0.75,
                      backgroundColor: 'transparent',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(216, 185, 138, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={invitation.qrCodeImage}
                      alt={`QR Code - ${invitation.qrCode}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        backgroundColor: '#ffffff',
                        imageRendering: 'crisp-edges',
                      }}
                    />
                  </MuiBox>
                ) : (
                  <MuiBox
                    sx={{
                      width: { xs: '90px', sm: '100px', md: '110px' },
                      height: { xs: '90px', sm: '100px', md: '110px' },
                      border: '2px solid #D8B98A',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(26, 26, 26, 0.8)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(216, 185, 138, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                )}
              </MuiBox>

              {/* Golden Horizontal Bar */}
              <MuiBox
                sx={{
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, #D8B98A 20%, #D8B98A 80%, transparent 100%)',
                  mb: { xs: 0.75, sm: 1 },
                  boxShadow: '0 2px 8px rgba(216, 185, 138, 0.4)',
                }}
              />

              {/* Invitation Title Box */}
              <MuiBox sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 0.75, sm: 1 } }}>
                <MuiBox
                  sx={{
                    border: '2px solid #D8B98A',
                    borderRadius: '8px',
                    p: { xs: 0.75, sm: 1 },
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(216, 185, 138, 0.1)',
                    minWidth: '120px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <MuiTypography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#fff',
                      fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
                      fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                      letterSpacing: 'normal',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                      lineHeight: 1.2,
                      direction: 'rtl',
                      unicodeBidi: 'embed',
                    }}
                  >
                    دعوة
                  </MuiTypography>
                  {eventType && (
                    <>
                      <MuiBox
                        sx={{
                          width: '1px',
                          height: '18px',
                          backgroundColor: 'rgba(216, 185, 138, 0.4)',
                        }}
                      />
                      <MuiTypography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#D8B98A',
                          fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem' },
                          fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                          letterSpacing: 'normal',
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                          lineHeight: 1.2,
                          direction: 'rtl',
                          unicodeBidi: 'embed',
                        }}
                      >
                        {eventTypeLabels[eventType] || eventType}
                      </MuiTypography>
                    </>
                  )}
                </MuiBox>
              </MuiBox>

              {/* Guest Name Section */}
              <MuiBox sx={{ textAlign: 'center', mb: { xs: 0.75, sm: 1 } }}>
                <MuiTypography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#fff',
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                    mb: 0.5,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                    letterSpacing: 'normal',
                    lineHeight: 1.3,
                    direction: 'rtl',
                    unicodeBidi: 'embed',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  {invitation.guestName}
                </MuiTypography>
                {invitation.numOfPeople > 1 && (
                  <MuiTypography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      mt: 0.5,
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                      fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                      direction: 'rtl',
                      unicodeBidi: 'embed',
                    }}
                  >
                    عدد المدعوين: {invitation.numOfPeople}
                  </MuiTypography>
                )}

                {/* Additional Guests List */}
                {invitationGuests.length > 0 && (
                  <MuiBox sx={{ mt: 1, px: 2 }}>
                    <MuiTypography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                        display: 'block',
                        mb: 0.5,
                        fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                        direction: 'rtl',
                        unicodeBidi: 'embed',
                      }}
                    >
                      الضيوف الإضافيين:
                    </MuiTypography>
                    <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
                      {invitationGuests.map((guest, index) => (
                        <MuiBox
                          key={guest._id || index}
                          sx={{
                            px: 1,
                            py: 0.3,
                            backgroundColor: 'rgba(216, 185, 138, 0.15)',
                            borderRadius: '8px',
                            border: '1px solid rgba(216, 185, 138, 0.3)',
                          }}
                        >
                          <MuiTypography
                            variant="caption"
                            sx={{
                              color: '#D8B98A',
                              fontSize: { xs: '0.6rem', sm: '0.65rem' },
                              textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
                              fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                              direction: 'rtl',
                              unicodeBidi: 'embed',
                            }}
                          >
                            {guest.name || `ضيف ${index + 2}`}
                          </MuiTypography>
                        </MuiBox>
                      ))}
                    </MuiBox>
                  </MuiBox>
                )}
              </MuiBox>

              {/* Event Details - Icons with Golden Lines */}
              <MuiBox
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'flex-start',
                  mb: { xs: 0.75, sm: 1 },
                  px: 0.5,
                  flexWrap: 'wrap',
                  gap: 0.75,
                }}
              >
                {/* Time Icon - Show first */}
                {(eventTime || startTime || endTime) && (
                  <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '70px' }}>
                    <MuiBox
                      sx={{
                        width: { xs: '32px', sm: '36px' },
                        height: { xs: '32px', sm: '36px' },
                        borderRadius: '50%',
                        backgroundColor: 'rgba(216, 185, 138, 0.2)',
                        border: '2px solid #D8B98A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 0.75,
                        boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                      }}
                    >
                      <Clock size={18} style={{ color: '#D8B98A' }} />
                    </MuiBox>
                    <MuiBox
                      sx={{
                        width: '40px',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                        mb: 0.4,
                      }}
                    />
                    {formattedStartTime && formattedEndTime ? (
                      <MuiBox sx={{ textAlign: 'center' }}>
                        <MuiTypography
                          variant="body2"
                          sx={{
                            color: '#fff',
                            fontSize: { xs: '0.6rem', sm: '0.65rem' },
                            textAlign: 'center',
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                            maxWidth: '80px',
                            lineHeight: 1.3,
                            fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                            direction: 'rtl',
                            unicodeBidi: 'embed',
                            mb: 0.3,
                          }}
                        >
                          من {formattedStartTime}
                        </MuiTypography>
                        <MuiTypography
                          variant="body2"
                          sx={{
                            color: '#fff',
                            fontSize: { xs: '0.6rem', sm: '0.65rem' },
                            textAlign: 'center',
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                            maxWidth: '80px',
                            lineHeight: 1.3,
                            fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                            direction: 'rtl',
                            unicodeBidi: 'embed',
                          }}
                        >
                          إلى {formattedEndTime}
                        </MuiTypography>
                      </MuiBox>
                    ) : (
                      <MuiTypography
                        variant="body2"
                        sx={{
                          color: '#fff',
                          fontSize: { xs: '0.6rem', sm: '0.65rem' },
                          textAlign: 'center',
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                          maxWidth: '80px',
                          lineHeight: 1.2,
                          fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                          direction: 'rtl',
                          unicodeBidi: 'embed',
                        }}
                      >
                        {formattedStartTime || formattedEndTime || '—'}
                      </MuiTypography>
                    )}
                  </MuiBox>
                )}

                {/* Vertical Divider */}
                {((eventTime || startTime || endTime) && formattedDate) && (
                  <MuiBox
                    sx={{
                      width: '2px',
                      height: { xs: '50px', sm: '55px' },
                      background: 'linear-gradient(180deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                      mx: 0.3,
                    }}
                  />
                )}

                {/* Date Icon */}
                {formattedDate && (
                  <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '70px' }}>
                    <MuiBox
                      sx={{
                        width: { xs: '32px', sm: '36px' },
                        height: { xs: '32px', sm: '36px' },
                        borderRadius: '50%',
                        backgroundColor: 'rgba(216, 185, 138, 0.2)',
                        border: '2px solid #D8B98A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 0.75,
                        boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                      }}
                    >
                      <Calendar size={18} style={{ color: '#D8B98A' }} />
                    </MuiBox>
                    <MuiBox
                      sx={{
                        width: '40px',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                        mb: 0.4,
                      }}
                    />
                    <MuiTypography
                      variant="body2"
                      sx={{
                        color: '#fff',
                        fontSize: { xs: '0.6rem', sm: '0.65rem' },
                        textAlign: 'center',
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                        maxWidth: '80px',
                        lineHeight: 1.2,
                        fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                        direction: 'rtl',
                        unicodeBidi: 'embed',
                      }}
                    >
                      {formattedDate}
                    </MuiTypography>
                  </MuiBox>
                )}

                {/* Location Icon - Only show if hallName exists */}
                {hallName && (
                  <>
                    {/* Vertical Divider */}
                    {((eventTime || startTime || endTime) || formattedDate) && (
                      <MuiBox
                        sx={{
                          width: '2px',
                          height: { xs: '50px', sm: '55px' },
                          background: 'linear-gradient(180deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                          mx: 0.3,
                        }}
                      />
                    )}
                    <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: { xs: '80px', sm: '100px' }, maxWidth: { xs: '150px', sm: '180px' } }}>
                      <MuiBox
                        sx={{
                          width: { xs: '32px', sm: '36px' },
                          height: { xs: '32px', sm: '36px' },
                          borderRadius: '50%',
                          backgroundColor: 'rgba(216, 185, 138, 0.2)',
                          border: '2px solid #D8B98A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 0.75,
                          boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                        }}
                      >
                        <MapPin size={18} style={{ color: '#D8B98A' }} />
                      </MuiBox>
                      <MuiBox
                        sx={{
                          width: '40px',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                          mb: 0.4,
                        }}
                      />
                      <MuiTypography
                        variant="body2"
                        sx={{
                          color: '#fff',
                          fontSize: { xs: '0.6rem', sm: '0.65rem' },
                          textAlign: 'center',
                          textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                          width: '100%',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                          lineHeight: 1.3,
                          fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                          direction: 'rtl',
                          unicodeBidi: 'embed',
                        }}
                      >
                        {hallName}
                      </MuiTypography>
                    </MuiBox>
                  </>
                )}
              </MuiBox>

              {/* Additional Event Details */}
              {(eventName || hallLocation || hallCapacity) && (
                <MuiBox
                  sx={{
                    textAlign: 'center',
                    mb: { xs: 0.75, sm: 1 },
                    px: 1.5,
                  }}
                >
                  {/* Event Name */}
                  {eventName && eventName !== 'فعالية' && (
                    <MuiTypography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        mb: 0.4,
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                        fontWeight: 600,
                        fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                        direction: 'rtl',
                        unicodeBidi: 'embed',
                      }}
                    >
                      {eventName}
                    </MuiTypography>
                  )}

                  {/* Hall Details */}
                  {(hallLocation || hallCapacity) && (
                    <MuiBox sx={{ mt: 0.75, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                      {hallLocation && (
                        <MuiTypography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: { xs: '0.6rem', sm: '0.65rem' },
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                            fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                            direction: 'rtl',
                            unicodeBidi: 'embed',
                          }}
                        >
                          {hallLocation}
                        </MuiTypography>
                      )}
                      {hallCapacity && (
                        <MuiTypography
                          variant="caption"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: { xs: '0.6rem', sm: '0.65rem' },
                            textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                            fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                            direction: 'rtl',
                            unicodeBidi: 'embed',
                          }}
                        >
                          السعة: {hallCapacity} ضيف
                        </MuiTypography>
                      )}
                    </MuiBox>
                  )}
                </MuiBox>
              )}


              {/* Elegant Arabic Calligraphy Footer */}
              <MuiBox sx={{ textAlign: 'center', mt: 'auto', pt: { xs: 0.75, sm: 1 }, pb: { xs: 1, sm: 1.25 } }}>
                <MuiTypography
                  variant="h6"
                  sx={{
                    color: '#D8B98A',
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                    fontFamily: "'Alexandria', 'Montserrat', sans-serif",
                    fontWeight: 600,
                    letterSpacing: 'normal',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(216, 185, 138, 0.3)',
                    lineHeight: 1.4,
                    mb: 0.75,
                    direction: 'rtl',
                    unicodeBidi: 'embed',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  وبحضوركم يتم لنا الفرح والسرور
                </MuiTypography>
                {/* Decorative lines below text */}
                <MuiBox
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 0.75,
                  }}
                >
                  <MuiBox
                    sx={{
                      width: { xs: '50px', sm: '60px' },
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                    }}
                  />
                  <MuiBox
                    sx={{
                      width: { xs: '50px', sm: '60px' },
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                    }}
                  />
                </MuiBox>
              </MuiBox>
            </MuiBox>
          </MuiBox>
        </MuiBox>

        {/* Right Side - Template Selection */}
        <MuiBox
          sx={{
            flex: { xs: '1 1 auto', lg: '1 1 40%' },
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2, sm: 3 },
            overflow: 'auto',
            backgroundColor: 'rgba(26, 26, 26, 0.5)',
            borderLeft: { lg: '2px solid var(--color-border-glass)' },
          }}
        >
          {/* Template Selection Header */}
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <MuiBox
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: 'rgba(216, 185, 138, 0.15)',
                border: '1px solid rgba(216, 185, 138, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ImageIcon size={22} style={{ color: 'var(--color-primary-500)' }} />
            </MuiBox>
            <MuiBox sx={{ flex: 1 }}>
              <MuiTypography
                variant="h6"
                sx={{
                  color: 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  mb: 0.5,
                }}
              >
                اختر قالب الدعوة
              </MuiTypography>
              {availableTemplates.length > 0 && (
                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                  {availableTemplates.length} قالب متاح للاختيار
                </MuiTypography>
              )}
            </MuiBox>
          </MuiBox>

          {/* Templates Grid */}
          <MuiBox
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
              gap: 2,
              overflowY: 'auto',
              pr: 1,
              pb: 2,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(216, 185, 138, 0.4)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(216, 185, 138, 0.6)',
                },
              },
            }}
          >
            {/* No Template Option */}
            <MuiBox
              onClick={() => onTemplateChange(null)}
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3/4',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: selectedTemplateId === null
                  ? '3px solid var(--color-primary-500)'
                  : '2px solid rgba(216, 185, 138, 0.3)',
                backgroundColor: 'var(--color-surface-dark)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selectedTemplateId === null
                  ? '0 12px 32px rgba(216, 185, 138, 0.5), 0 0 0 4px rgba(216, 185, 138, 0.1)'
                  : '0 4px 16px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  transform: 'translateY(-6px) scale(1.02)',
                  borderColor: 'var(--color-primary-500)',
                  boxShadow: '0 16px 40px rgba(216, 185, 138, 0.6), 0 0 0 4px rgba(216, 185, 138, 0.15)',
                },
              }}
            >
              <MuiBox
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)',
                  gap: 1.5,
                  border: '2px dashed rgba(216, 185, 138, 0.3)',
                  borderRadius: '16px',
                }}
              >
                <ImageIcon size={48} style={{ color: 'var(--color-primary-500)', opacity: 0.7 }} />
                <MuiTypography
                  variant="body2"
                  sx={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    textAlign: 'center',
                    px: 2,
                  }}
                >
                  بدون قالب
                </MuiTypography>
              </MuiBox>

              {/* Selected Indicator */}
              {selectedTemplateId === null && (
                <MuiBox
                  sx={{
                    position: 'absolute',
                    top: { xs: 8, sm: 10 },
                    right: { xs: 8, sm: 10 },
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.6), 0 0 0 3px rgba(216, 185, 138, 0.2)',
                  }}
                >
                  <CheckCircle size={18} style={{ color: '#fff' }} />
                </MuiBox>
              )}
            </MuiBox>

            {/* Available Templates */}
            {console.log('🔍 Rendering Templates:', JSON.stringify({
              'availableTemplates.length': availableTemplates.length,
              'availableTemplates': availableTemplates
            }, null, 2))}
            {availableTemplates.length > 0 ? availableTemplates.map((template) => {
              const templateId = template._id || template.id
              const isSelected = selectedTemplateId === templateId ||
                (selectedTemplateId === null ? false : !selectedTemplateId && selectedTemplate?._id === templateId) ||
                (selectedTemplateId === null ? false : !selectedTemplateId && selectedTemplate?.id === templateId)
              const templateImg = template.imageUrl || template.image
              const templateImgUrl = templateImg
                ? (templateImg.startsWith('http://') || templateImg.startsWith('https://')
                  ? templateImg
                  : (templateImg.startsWith('/')
                    ? `http://82.137.244.167:5001${templateImg}`
                    : `http://82.137.244.167:5001/${templateImg}`))
                : null

              console.log('🔍 Template Image Debug:', {
                'templateId': templateId,
                'template.imageUrl': template.imageUrl,
                'template.image': template.image,
                'templateImg': templateImg,
                'templateImgUrl': templateImgUrl,
                'fullTemplate': template
              })

              return (
                <MuiBox
                  key={templateId}
                  onClick={() => onTemplateChange(templateId)}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '3/4',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isSelected
                      ? '3px solid var(--color-primary-500)'
                      : '2px solid rgba(216, 185, 138, 0.3)',
                    backgroundColor: 'var(--color-surface-dark)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected
                      ? '0 12px 32px rgba(216, 185, 138, 0.5), 0 0 0 4px rgba(216, 185, 138, 0.1)'
                      : '0 4px 16px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.02)',
                      borderColor: 'var(--color-primary-500)',
                      boxShadow: '0 16px 40px rgba(216, 185, 138, 0.6), 0 0 0 4px rgba(216, 185, 138, 0.15)',
                    },
                  }}
                >
                  {/* Template Preview Image */}
                  {templateImgUrl ? (
                    <MuiBox
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${templateImgUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  ) : (
                    <MuiBox
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.2), rgba(255, 227, 108, 0.1))',
                        gap: 1,
                      }}
                    >
                      <ImageIcon size={48} style={{ color: 'var(--color-primary-500)', opacity: 0.6 }} />
                      <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                        بدون صورة
                      </MuiTypography>
                    </MuiBox>
                  )}

                  {/* Overlay with Template Name */}
                  <MuiBox
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%)',
                      p: { xs: 1.5, sm: 2 },
                      pt: 3,
                    }}
                  >
                    <MuiTypography
                      variant="body2"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        textAlign: 'center',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      {template.templateName || template.name || 'قالب بدون اسم'}
                    </MuiTypography>
                  </MuiBox>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <MuiBox
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, sm: 10 },
                        right: { xs: 8, sm: 10 },
                        width: { xs: 28, sm: 32 },
                        height: { xs: 28, sm: 32 },
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary-500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(216, 185, 138, 0.6), 0 0 0 3px rgba(216, 185, 138, 0.2)',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': {
                            boxShadow: '0 4px 12px rgba(216, 185, 138, 0.6), 0 0 0 3px rgba(216, 185, 138, 0.2)',
                          },
                          '50%': {
                            boxShadow: '0 4px 16px rgba(216, 185, 138, 0.8), 0 0 0 4px rgba(216, 185, 138, 0.3)',
                          },
                        },
                      }}
                    >
                      <MuiBox
                        component="svg"
                        sx={{
                          width: { xs: 16, sm: 18 },
                          height: { xs: 16, sm: 18 },
                          color: '#1A1A1A',
                        }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </MuiBox>
                    </MuiBox>
                  )}
                </MuiBox>
              )
            }) : (
              <MuiBox
                sx={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  py: 4,
                  color: 'var(--color-text-secondary)',
                }}
              >
                <ImageIcon size={48} style={{ opacity: 0.5, marginBottom: 16 }} />
                <MuiTypography variant="body2">
                  لا توجد قوالب متاحة
                </MuiTypography>
              </MuiBox>
            )}
          </MuiBox>
        </MuiBox>
      </MuiBox>
    </MuiBox>
  )
}

// Create/Edit Invitation Dialog Component
function CreateEditInvitationDialog({ open, onClose, editingInvitation, onSubmit, loading, eventGuestCount, totalInvitedPeople, bookings = [], invitations = [] }) {
  const isEdit = !!editingInvitation
  const isCreate = !isEdit

  // Watch selected eventId to update eventGuestCount dynamically
  const [selectedEventId, setSelectedEventId] = useState(null)

  // Get selected event details
  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null
    return bookings.find(b => (b._id || b.id)?.toString() === selectedEventId?.toString())
  }, [selectedEventId, bookings])

  // Calculate eventGuestCount and totalInvitedPeople based on selected event
  const currentEventGuestCount = useMemo(() => {
    if (isEdit && editingInvitation) {
      // For edit, use the invitation's event
      const invEventId = editingInvitation.eventId?._id || editingInvitation.eventId || null
      const event = bookings.find(b => (b._id || b.id)?.toString() === invEventId?.toString())
      return event?.guestCount || 0
    } else if (selectedEvent) {
      // For create, use selected event
      return selectedEvent.guestCount || 0
    }
    return eventGuestCount || 0
  }, [selectedEvent, eventGuestCount, isEdit, editingInvitation, bookings])

  const currentTotalInvitedPeople = useMemo(() => {
    if (isEdit && editingInvitation) {
      // For edit, calculate based on invitation's event
      const invEventId = editingInvitation.eventId?._id || editingInvitation.eventId || null
      return invitations
        .filter(inv => {
          const invEvtId = inv.eventId?._id || inv.eventId || null
          return invEvtId?.toString() === invEventId?.toString()
        })
        .reduce((sum, inv) => sum + (inv.numOfPeople || 0), 0)
    } else if (selectedEventId) {
      // For create, calculate based on selected event
      return invitations
        .filter(inv => {
          const invEvtId = inv.eventId?._id || inv.eventId || null
          return invEvtId?.toString() === selectedEventId?.toString()
        })
        .reduce((sum, inv) => sum + (inv.numOfPeople || 0), 0)
    }
    return totalInvitedPeople || 0
  }, [selectedEventId, invitations, totalInvitedPeople, isEdit, editingInvitation])

  // Calculate remaining available guests
  const currentInvitationCount = editingInvitation?.numOfPeople || 0
  const remainingGuests = currentEventGuestCount > 0
    ? currentEventGuestCount - (currentTotalInvitedPeople - (isEdit ? currentInvitationCount : 0))
    : null

  // Create schema with validation - recreate on each render to get latest values
  const schema = useMemo(() => {
    return createInvitationSchema(currentEventGuestCount, currentTotalInvitedPeople, isEdit, currentInvitationCount, isCreate)
  }, [currentEventGuestCount, currentTotalInvitedPeople, isEdit, currentInvitationCount, isCreate])

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      eventId: isEdit ? (editingInvitation?.eventId?._id || editingInvitation?.eventId || '') : '',
      guestName: editingInvitation?.guestName || '',
      numOfPeople: editingInvitation?.numOfPeople || 1,
      guests: editingInvitation?.guests?.map(g => ({ name: g.name || '' })) || [],
    },
  })

  const numOfPeopleValue = watch('numOfPeople')
  const selectedEventIdValue = watch('eventId')

  // Update selectedEventId when form value changes
  useEffect(() => {
    if (selectedEventIdValue && selectedEventIdValue !== selectedEventId) {
      setSelectedEventId(selectedEventIdValue)
    }
  }, [selectedEventIdValue, selectedEventId])

  // Use field array for guests
  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests"
  })

  useEffect(() => {
    if (open) {
      const initialGuests = editingInvitation?.guests?.map(g => ({ name: g.name || '' })) || []
      const initialEventId = isEdit ? (editingInvitation?.eventId?._id || editingInvitation?.eventId || '') : ''
      reset({
        eventId: initialEventId,
        guestName: editingInvitation?.guestName || '',
        numOfPeople: editingInvitation?.numOfPeople || 1,
        guests: initialGuests,
      })
      if (initialEventId) {
        setSelectedEventId(initialEventId)
      } else {
        setSelectedEventId(null)
      }
    }
  }, [open, editingInvitation, reset, isEdit])

  return (
    <BaseFormDialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'تعديل الدعوة' : 'إضافة دعوة جديدة'}
      onSubmit={handleSubmit(async (data) => {
        const success = await onSubmit(data)
        if (success && !isEdit) {
          reset({
            eventId: selectedEventIdValue || '',
            guestName: '',
            numOfPeople: 1,
            guests: [],
          })
        }
      })}
      loading={loading}
      submitText={isEdit ? 'تحديث' : 'إضافة'}
      cancelText="إلغاء"
      maxWidth="sm"
    >
      <MuiGrid container spacing={3}>
        {/* Event Selection - Only show for create */}
        {isCreate && (
          <MuiGrid item xs={12}>
            <Controller
              name="eventId"
              control={control}
              render={({ field, fieldState: { error } }) => {
                const selectId = `event-select-${field.name}`
                return (
                  <MuiBox>
                    <MuiTypography
                      variant="body2"
                      component="label"
                      sx={{
                        mb: 1,
                        display: 'block',
                        color: error ? 'var(--color-error-500)' : 'var(--color-primary-500)',
                        fontFamily: 'var(--font-family-base)',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        textAlign: 'right',
                        direction: 'rtl',
                      }}
                    >
                      اختر الفعالية <span style={{ color: 'var(--color-error-500)' }}>*</span>
                    </MuiTypography>
                    <MuiFormControl fullWidth required error={!!error}>
                      <MuiSelect
                        {...field}
                        id={selectId}
                        displayEmpty
                        onChange={(e) => {
                          field.onChange(e)
                          setSelectedEventId(e.target.value)
                        }}
                        sx={{
                          '& .MuiSelect-select': {
                            py: 1.5
                          }
                        }}
                      >
                        <MuiMenuItem value="" disabled>
                          <em>اختر الفعالية</em>
                        </MuiMenuItem>
                        {bookings.length > 0 ? (
                          bookings.map((booking) => {
                            const eventId = booking._id || booking.id
                            const eventName = booking.name || 'فعالية بدون اسم'
                            const eventDate = booking.date ? formatDate(booking.date, 'MM/DD/YYYY') : ''
                            return (
                              <MuiMenuItem key={eventId} value={eventId}>
                                {eventName} {eventDate && `- ${eventDate}`}
                              </MuiMenuItem>
                            )
                          })
                        ) : (
                          <MuiMenuItem disabled>لا توجد فعاليات متاحة</MuiMenuItem>
                        )}
                      </MuiSelect>
                      {error && (
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-error-500)', mt: 0.5, display: 'block' }}>
                          {error.message}
                        </MuiTypography>
                      )}
                    </MuiFormControl>
                  </MuiBox>
                )
              }}
            />
          </MuiGrid>
        )}

        <MuiGrid item xs={12}>
          <Controller
            name="guestName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MuiTextField
                {...field}
                label="اسم الضيف"
                required
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </MuiGrid>

        <MuiGrid item xs={12}>
          <Controller
            name="numOfPeople"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <MuiTextField
                {...field}
                label="عدد الأشخاص"
                type="number"
                required
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          {currentEventGuestCount > 0 && remainingGuests !== null && (
            <MuiBox sx={{ mt: 1.5 }}>
              <MuiTypography
                variant="caption"
                sx={{
                  color: remainingGuests < (numOfPeopleValue || 0) ? 'var(--color-error-500)' : 'var(--color-text-secondary)',
                  fontSize: '0.75rem',
                  display: 'block',
                  mb: 0.5
                }}
              >
                عدد الضيوف في الفعالية: <strong>{currentEventGuestCount}</strong> | المتبقي: <strong>{remainingGuests}</strong> | المدعوون الحاليون: <strong>{currentTotalInvitedPeople - (isEdit ? currentInvitationCount : 0)}</strong>
              </MuiTypography>
              {remainingGuests < (numOfPeopleValue || 0) && (
                <MuiTypography
                  variant="caption"
                  sx={{
                    color: 'var(--color-error-500)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  ⚠️ يتجاوز العدد المتبقي من الضيوف! الحد الأقصى المسموح: {remainingGuests}
                </MuiTypography>
              )}
            </MuiBox>
          )}
        </MuiGrid>

        {/* Guests List Section */}
        <MuiGrid item xs={12}>
          <MuiBox sx={{
            p: 2.5,
            backgroundColor: 'rgba(216, 185, 138, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(216, 185, 138, 0.15)'
          }}>
            <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                قائمة المدعوين (اختياري)
              </MuiTypography>
              <MuiButton
                startIcon={<UserPlus size={18} />}
                onClick={() => append({ name: '' })}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: 'var(--color-primary-500)',
                  color: 'var(--color-primary-500)',
                  '&:hover': {
                    backgroundColor: 'rgba(216, 185, 138, 0.1)',
                    borderColor: 'var(--color-primary-600)',
                  }
                }}
              >
                إضافة مدعو
              </MuiButton>
            </MuiBox>

            <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2, fontSize: '0.85rem' }}>
              يمكنك إضافة أسماء المدعوين الإضافيين هنا. سيتم إرسالهم مع الدعوة.
            </MuiTypography>

            {fields.length > 0 ? (
              <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {fields.map((field, index) => (
                  <MuiBox
                    key={field.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      border: '1px solid rgba(216, 185, 138, 0.1)'
                    }}
                  >
                    <MuiBox sx={{ flex: 1 }}>
                      <Controller
                        name={`guests.${index}.name`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <MuiTextField
                            {...field}
                            label={`اسم المدعو ${index + 1}`}
                            fullWidth
                            required
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                      />
                    </MuiBox>
                    <MuiIconButton
                      onClick={() => remove(index)}
                      sx={{
                        color: 'var(--color-error-500)',
                        mt: 0.5,
                        '&:hover': {
                          backgroundColor: 'rgba(220, 38, 38, 0.1)',
                        }
                      }}
                    >
                      <X size={20} />
                    </MuiIconButton>
                  </MuiBox>
                ))}
              </MuiBox>
            ) : (
              <MuiBox sx={{
                textAlign: 'center',
                py: 3,
                color: 'var(--color-text-secondary)'
              }}>
                <UserPlus size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <MuiTypography variant="body2" sx={{ fontSize: '0.85rem' }}>
                  لا توجد مدعوين إضافيين. اضغط على "إضافة مدعو" لإضافة أسماء المدعوين.
                </MuiTypography>
              </MuiBox>
            )}
          </MuiBox>
        </MuiGrid>
      </MuiGrid>
    </BaseFormDialog>
  )
}

