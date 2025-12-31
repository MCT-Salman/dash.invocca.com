// src\pages\client\Invitations.jsx
import { useQuery } from '@tanstack/react-query'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiButton from '@/components/ui/MuiButton'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { LoadingScreen, EmptyState, SEOHead, ConfirmDialog } from '@/components/common'
import { BaseFormDialog, FormField } from '@/components/shared'
import { useDialogState, useCRUD, useNotification } from '@/hooks'
import { QUERY_KEYS } from '@/config/constants'
import { getInvitations, createInvitation, updateInvitation, deleteInvitation, getClientDashboard } from '@/api/client'
import { getBookings } from '@/api/client'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Plus, UserCheck, Users, Edit2, Trash2, X, UserPlus, Download, Calendar, MapPin, Clock, Eye, ArrowLeft, Image as ImageIcon, FileImage, FileText } from 'lucide-react'
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

// Validation schema - will be created dynamically with eventGuestCount and totalInvitedPeople
const createInvitationSchema = (eventGuestCount, totalInvitedPeople, isEdit, currentInvitationCount) => {
  return z.object({
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

  // Fetch bookings for event selection
  const { data: bookingsData } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_BOOKINGS,
    queryFn: () => getBookings(),
  })

  // Fetch dashboard to get templates
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
  const bookings = bookingsData?.bookings || bookingsData?.data || []

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
    // Validate total guests count BEFORE submitting
    if (eventGuestCount > 0) {
      const currentInvitationCount = editingInvitation?.numOfPeople || 0
      const newTotal = isEdit 
        ? totalInvitedPeople - currentInvitationCount + formData.numOfPeople
        : totalInvitedPeople + formData.numOfPeople
      
      if (newTotal > eventGuestCount) {
        const remaining = eventGuestCount - (isEdit ? totalInvitedPeople - currentInvitationCount : totalInvitedPeople)
        showNotification({
          title: 'خطأ',
          message: `عدد الضيوف في الفعالية هو ${eventGuestCount} فقط. المدعوون الحاليون: ${totalInvitedPeople - (isEdit ? currentInvitationCount : 0)}. يمكنك إضافة ${remaining > 0 ? remaining : 0} ضيف فقط.`,
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
      }
    } else {
      try {
        const result = await handleCreate(submitData)
        if (result?.success === false) {
          // Handle error from handleCreate
          const errorMessage = result?.error?.response?.data?.message 
            || result?.error?.response?.data?.error 
            || result?.error?.message 
            || 'حدث خطأ أثناء الحفظ'
          showNotification({
            title: 'خطأ',
            message: String(errorMessage),
            type: 'error'
          })
          return
        }
        
        closeDialog()
        // Show invitation card if invitation data is returned
        // The API returns { message, invitation } structure
        if (result?.invitation) {
          setSelectedInvitation(result.invitation)
          setShowInvitationCard(true)
        } else if (result?.data?.invitation) {
          setSelectedInvitation(result.data.invitation)
          setShowInvitationCard(true)
        }
      } catch (error) {
        // Extract detailed error message
        const errorMessage = error?.response?.data?.message 
          || error?.response?.data?.error 
          || error?.response?.data?.errors?.[0]?.msg
          || error?.message 
          || 'حدث خطأ أثناء الحفظ'
        showNotification({
          title: 'خطأ',
          message: String(errorMessage),
          type: 'error'
        })
      }
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

                <MuiBox sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                    <Users size={14} />
                    <MuiTypography variant="caption">
                      {invitation.numOfPeople || invitation.guestCount || 0} مدعو
                    </MuiTypography>
                  </MuiBox>
                  <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-secondary)' }}>
                    <UserCheck size={14} />
                    <MuiTypography variant="caption">
                      {invitation.guests?.filter(g => g.checkedIn).length || invitation.confirmedCount || 0} مؤكد
                    </MuiTypography>
                  </MuiBox>
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
        bookings={bookings}
        eventGuestCount={eventGuestCount}
        totalInvitedPeople={totalInvitedPeople}
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

  // Get event information from bookings or directly from invitation.eventId
  const eventId = invitation.eventId?._id || invitation.eventId || null
  const event = (invitation.eventId && typeof invitation.eventId === 'object' && invitation.eventId.name) 
                ? invitation.eventId 
                : (bookings.find(b => (b._id || b.id) === eventId) || null)
  
  // Get available templates from dashboard or event
  const responseData = dashboardData?.data || dashboardData || {}
  const allEvents = responseData.allEvents || responseData.recentActivity?.events || responseData.events || []
  const currentEvent = allEvents.find(e => (e._id || e.id) === eventId) || event
  
  // Extract templates from events (assuming templates are in events)
  const availableTemplates = useMemo(() => {
    const templates = []
    allEvents.forEach(evt => {
      if (evt.template && !templates.find(t => (t._id || t.id) === (evt.template._id || evt.template))) {
        templates.push(evt.template)
      }
      if (evt.templateId && typeof evt.templateId === 'object' && !templates.find(t => (t._id || t.id) === (evt.templateId._id || evt.templateId))) {
        templates.push(evt.templateId)
      }
    })
    return templates
  }, [allEvents])

  // Get selected template or default template
  const selectedTemplate = selectedTemplateId 
    ? availableTemplates.find(t => (t._id || t.id) === selectedTemplateId)
    : (currentEvent?.template || currentEvent?.templateId || availableTemplates[0] || null)
  
  // Get template image - check multiple possible locations
  const templateImage = selectedTemplate?.imageUrl || 
                        currentEvent?.template?.imageUrl || 
                        currentEvent?.templateId?.imageUrl || 
                        currentEvent?.templateImage || 
                        null
  
  const templateImageUrl = templateImage 
    ? (templateImage.startsWith('http') ? templateImage : `http://82.137.244.167:5001${templateImage}`)
    : null
  
  // Extract event data - prioritize invitation.eventId if it's a full object
  const eventData = invitation.eventId && typeof invitation.eventId === 'object' && (invitation.eventId.name || invitation.eventId._id)
    ? invitation.eventId
    : event
  
  const eventName = eventData?.name || eventData?.eventName || 'فعالية'
  const eventDate = eventData?.date || eventData?.eventDate || invitation.eventDate || invitation.eventId?.date || invitation.eventId?.eventDate
  const startTime = eventData?.startTime || invitation.eventId?.startTime || ''
  const endTime = eventData?.endTime || invitation.eventId?.endTime || ''
  // Format time - ensure both times are shown
  const eventTime = startTime && endTime ? `${endTime} - ${startTime}` : (startTime || endTime || '')
  const eventType = eventData?.type || eventData?.eventType || invitation.eventId?.type || ''
  
  // Hall data - check if hall is populated or just an ID
  const hallData = eventData?.hallId || eventData?.hall || invitation.eventId?.hallId || invitation.eventId?.hall
  const hallName = typeof hallData === 'object' ? (hallData?.name || '') : ''
  const hallLocation = typeof hallData === 'object' ? (hallData?.location || '') : ''
  const hallCapacity = typeof hallData === 'object' ? (hallData?.capacity || '') : ''
  
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

  // Format date - ensure it's always displayed
  const formattedDate = eventDate 
    ? new Date(eventDate).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : (invitation.eventDate 
        ? new Date(invitation.eventDate).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
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
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with Template Selection and Close Button */}
      <MuiBox
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          p: 3,
          backgroundColor: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid var(--color-border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <MuiButton
          onClick={onClose}
          startIcon={<ArrowLeft size={20} />}
          sx={{
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-border-glass)',
            '&:hover': {
              backgroundColor: 'rgba(216, 185, 138, 0.1)',
              borderColor: 'var(--color-primary-500)',
            }
          }}
          variant="outlined"
        >
          العودة
        </MuiButton>

        {availableTemplates.length > 0 && (
          <MuiFormControl sx={{ minWidth: 250 }}>
            <MuiInputLabel id="template-select-label">اختر القالب</MuiInputLabel>
            <MuiSelect
              labelId="template-select-label"
              value={selectedTemplateId || selectedTemplate?._id || selectedTemplate?.id || ''}
              onChange={(e) => onTemplateChange(e.target.value)}
              label="اختر القالب"
              sx={{
                backgroundColor: 'var(--color-surface-dark)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-border-glass)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary-500)',
                },
              }}
            >
              {availableTemplates.map((template) => (
                <MuiMenuItem key={template._id || template.id} value={template._id || template.id}>
                  {template.templateName || template.name || 'قالب بدون اسم'}
                </MuiMenuItem>
              ))}
            </MuiSelect>
          </MuiFormControl>
        )}

        <MuiBox sx={{ display: 'flex', gap: 1 }}>
          <MuiButton
            startIcon={<FileImage size={18} />}
            onClick={handleExportPNG}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
            variant="outlined"
          >
            PNG
          </MuiButton>
          <MuiButton
            startIcon={<FileText size={18} />}
            onClick={handleExportPDF}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
            variant="outlined"
          >
            PDF
          </MuiButton>
        </MuiBox>

        <MuiBox sx={{ flex: 1 }} />
      </MuiBox>

      {/* Invitation Card Container */}
      <MuiBox
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 1, sm: 2, md: 3 },
          height: 'calc(100vh - 80px)',
          overflow: 'auto',
        }}
      >
        <MuiBox
          ref={cardRef}
          data-card-ref="true"
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '450px',
            height: '550px',
            background: templateImageUrl
              ? `url(${templateImageUrl}) center/cover no-repeat`
              : 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '3px solid rgba(216, 185, 138, 0.4)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4), 0 0 40px rgba(216, 185, 138, 0.2)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            direction: 'rtl',
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
            p: { xs: 1.5, sm: 2, md: 2.5 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#fff',
            flex: 1,
            direction: 'rtl',
            fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
          }}
        >
          {/* Top Section - Golden Frame for QR Code or Image */}
          <MuiBox sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1.5, sm: 2 } }}>
            {invitation.qrCodeImage ? (
              <MuiBox
                sx={{
                  width: { xs: '120px', sm: '140px', md: '160px' },
                  height: { xs: '120px', sm: '140px', md: '160px' },
                  border: '2px solid #D8B98A',
                  borderRadius: '8px',
                  p: 1,
                  backgroundColor: 'rgba(26, 26, 26, 0.8)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(216, 185, 138, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  }}
                />
              </MuiBox>
            ) : (
              <MuiBox
                sx={{
                  width: { xs: '120px', sm: '140px', md: '160px' },
                  height: { xs: '120px', sm: '140px', md: '160px' },
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
              mb: { xs: 1, sm: 1.5 },
              boxShadow: '0 2px 8px rgba(216, 185, 138, 0.4)',
            }}
          />

          {/* Invitation Title Box */}
          <MuiBox sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 1, sm: 1.5 } }}>
            <MuiBox
              sx={{
                border: '2px solid #D8B98A',
                borderRadius: '8px',
                p: { xs: 1, sm: 1.5 },
                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(216, 185, 138, 0.1)',
                minWidth: '150px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
              <MuiTypography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                  fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
                      height: '24px',
                      backgroundColor: 'rgba(216, 185, 138, 0.4)',
                    }}
                  />
                  <MuiTypography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: '#D8B98A',
                      fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
                      fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
          <MuiBox sx={{ textAlign: 'center', mb: { xs: 1, sm: 1.5 } }}>
            <MuiTypography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#fff',
                fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' },
                fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
                  fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
                    fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
                          fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
              mb: { xs: 1, sm: 1.5 },
              px: 1,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {/* Time Icon - Show first */}
            {(eventTime || startTime || endTime) && (
              <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '80px' }}>
                <MuiBox
                  sx={{
                    width: { xs: '40px', sm: '45px' },
                    height: { xs: '40px', sm: '45px' },
                    borderRadius: '50%',
                    backgroundColor: 'rgba(216, 185, 138, 0.2)',
                    border: '2px solid #D8B98A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                  }}
                >
                  <Clock size={22} style={{ color: '#D8B98A' }} />
                </MuiBox>
                <MuiBox
                  sx={{
                    width: '50px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                    mb: 0.5,
                  }}
                />
                <MuiTypography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    textAlign: 'center',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                    maxWidth: '90px',
                    lineHeight: 1.2,
                    fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
                    direction: 'rtl',
                    unicodeBidi: 'embed',
                  }}
                >
                  {eventTime || (startTime ? startTime : endTime) || '—'}
                </MuiTypography>
              </MuiBox>
            )}

            {/* Vertical Divider */}
            {((eventTime || startTime || endTime) && formattedDate) && (
              <MuiBox
                sx={{
                  width: '2px',
                  height: { xs: '60px', sm: '70px' },
                  background: 'linear-gradient(180deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                  mx: 0.5,
                }}
              />
            )}

            {/* Date Icon */}
            {formattedDate && (
              <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '80px' }}>
                <MuiBox
                  sx={{
                    width: { xs: '40px', sm: '45px' },
                    height: { xs: '40px', sm: '45px' },
                    borderRadius: '50%',
                    backgroundColor: 'rgba(216, 185, 138, 0.2)',
                    border: '2px solid #D8B98A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                    boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                  }}
                >
                  <Calendar size={22} style={{ color: '#D8B98A' }} />
                </MuiBox>
                <MuiBox
                  sx={{
                    width: '50px',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                    mb: 0.5,
                  }}
                />
                <MuiTypography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    textAlign: 'center',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                    maxWidth: '90px',
                    lineHeight: 1.2,
                    fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
                      height: { xs: '60px', sm: '70px' },
                      background: 'linear-gradient(180deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                      mx: 0.5,
                    }}
                  />
                )}
                <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '80px' }}>
                  <MuiBox
                    sx={{
                      width: { xs: '40px', sm: '45px' },
                      height: { xs: '40px', sm: '45px' },
                      borderRadius: '50%',
                      backgroundColor: 'rgba(216, 185, 138, 0.2)',
                      border: '2px solid #D8B98A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                    }}
                  >
                    <MapPin size={22} style={{ color: '#D8B98A' }} />
                  </MuiBox>
                  <MuiBox
                    sx={{
                      width: '50px',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                      mb: 0.5,
                    }}
                  />
                  <MuiTypography
                    variant="body2"
                    sx={{
                      color: '#fff',
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      textAlign: 'center',
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                      maxWidth: '90px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
                mb: { xs: 1, sm: 1.5 },
                px: 2,
              }}
            >
              {/* Event Name */}
              {eventName && eventName !== 'فعالية' && (
                <MuiTypography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    mb: 0.5,
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                    fontWeight: 600,
                    fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
                    direction: 'rtl',
                    unicodeBidi: 'embed',
                  }}
                >
                  {eventName}
                </MuiTypography>
              )}

              {/* Hall Details */}
              {(hallLocation || hallCapacity) && (
                <MuiBox sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  {hallLocation && (
                    <MuiTypography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                        fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                        fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
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
          <MuiBox sx={{ textAlign: 'center', mt: 'auto', pt: { xs: 1, sm: 1.5 }, pb: { xs: 1.5, sm: 2 } }}>
            <MuiTypography
              variant="h6"
              sx={{
                color: '#D8B98A',
                fontSize: { xs: '0.8rem', sm: '0.95rem', md: '1.1rem' },
                fontFamily: "'Cairo', 'Tajawal', 'Arial', sans-serif",
                fontWeight: 600,
                letterSpacing: 'normal',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(216, 185, 138, 0.3)',
                lineHeight: 1.5,
                mb: 1,
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
                gap: 1.5,
                mt: 1,
              }}
            >
              <MuiBox
                sx={{
                  width: { xs: '60px', sm: '70px' },
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                }}
              />
              <MuiBox
                sx={{
                  width: { xs: '60px', sm: '70px' },
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, #D8B98A 50%, transparent 100%)',
                }}
              />
            </MuiBox>
          </MuiBox>
        </MuiBox>
        </MuiBox>
      </MuiBox>
    </MuiBox>
  )
}

// Create/Edit Invitation Dialog Component
function CreateEditInvitationDialog({ open, onClose, editingInvitation, onSubmit, loading, bookings, eventGuestCount, totalInvitedPeople }) {
  const isEdit = !!editingInvitation
  
  // Calculate remaining available guests
  const currentInvitationCount = editingInvitation?.numOfPeople || 0
  const remainingGuests = eventGuestCount > 0 
    ? eventGuestCount - (totalInvitedPeople - (isEdit ? currentInvitationCount : 0))
    : null
  
  // Create schema with validation - recreate on each render to get latest values
  const schema = useMemo(() => {
    return createInvitationSchema(eventGuestCount, totalInvitedPeople, isEdit, currentInvitationCount)
  }, [eventGuestCount, totalInvitedPeople, isEdit, currentInvitationCount])
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      guestName: editingInvitation?.guestName || '',
      numOfPeople: editingInvitation?.numOfPeople || 1,
      guests: editingInvitation?.guests?.map(g => ({ name: g.name || '' })) || [],
    },
  })

  const numOfPeopleValue = watch('numOfPeople')

  // Use field array for guests
  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests"
  })

  useEffect(() => {
    if (open) {
      const initialGuests = editingInvitation?.guests?.map(g => ({ name: g.name || '' })) || []
      reset({
        guestName: editingInvitation?.guestName || '',
        numOfPeople: editingInvitation?.numOfPeople || 1,
        guests: initialGuests,
      })
    }
  }, [open, editingInvitation, reset])

  return (
    <BaseFormDialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'تعديل الدعوة' : 'إضافة دعوة جديدة'}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      submitText={isEdit ? 'تحديث' : 'إضافة'}
      cancelText="إلغاء"
      maxWidth="sm"
    >
      <MuiGrid container spacing={3}>
        <FormField
          name="guestName"
          control={control}
          label="اسم الضيف"
          errors={errors}
          required
          fullWidth
          gridItemProps={{ xs: 12 }}
        />

        <MuiGrid item xs={12}>
          <FormField
            name="numOfPeople"
            control={control}
            label="عدد الأشخاص"
            errors={errors}
            type="number"
            required
            fullWidth
            gridItemProps={{ xs: 12 }}
          />
          {eventGuestCount > 0 && remainingGuests !== null && (
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
                عدد الضيوف في الفعالية: <strong>{eventGuestCount}</strong> | المتبقي: <strong>{remainingGuests}</strong> | المدعوون الحاليون: <strong>{totalInvitedPeople - (isEdit ? currentInvitationCount : 0)}</strong>
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
                      <FormField
                        name={`guests.${index}.name`}
                        control={control}
                        label={`اسم المدعو ${index + 1}`}
                        errors={errors}
                        fullWidth
                        required
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
