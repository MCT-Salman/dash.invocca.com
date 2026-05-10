// src\pages\client\Invitations.jsx
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import html2canvas from 'html2canvas'
import { Mail, Plus, UserCheck, Users, Edit2, Trash2, X, Download, Calendar, MapPin, Clock, Eye, QrCode, Send, Share2, ChevronLeft } from 'lucide-react'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiButton from '@/components/ui/MuiButton'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiChip from '@/components/ui/MuiChip'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiDivider from '@/components/ui/MuiDivider'
import MuiTextField from '@/components/ui/MuiTextField'
import { LoadingScreen, EmptyState, SEOHead, ConfirmDialog, DataTable, AdvancedFilter } from '@/components/common'
import { BaseFormDialog } from '@/components/shared'
import { useDialogState, useCRUD, useNotification, useDebounce, useAuth } from '@/hooks'
import { useClient } from '@/providers/ClientProvider'
import { QUERY_KEYS } from '@/config/constants'
import { getInvitations, createInvitation, updateInvitation, deleteInvitation, getClientDashboard, getClientTemplates } from '@/api/client'
import { formatDate } from '@/utils/helpers'
import InvitationCardPreview from './components/InvitationCardPreview'

const invitationSchema = z.object({
  eventId: z.string().min(1, 'يرجى اختيار المناسبة'),
  guestName: z.string().min(1, 'اسم الضيف مطلوب'),
  numOfPeople: z.coerce.number().min(1, 'يجب أن يكون عدد الأشخاص 1 على الأقل'),
  templateId: z.string().optional(),
  guests: z.array(
    z.object({ name: z.string().min(1, 'اسم المرافق مطلوب') })
  ).optional()
})

export default function Invitations() {
  const { success, error: showError } = useNotification()
  const { selectedEventId, selectEvent, selectedEvent } = useClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [showCard, setShowCard] = useState(false)
  const [selectedInv, setSelectedInv] = useState(null)
  const cardRef = useRef(null)

  const { control, handleSubmit: formSubmit, reset, watch, setValue } = useForm({
    resolver: zodResolver(invitationSchema),
    defaultValues: { eventId: selectedEventId || '', guestName: '', numOfPeople: 1, templateId: '', guests: [{ name: '' }] }
  })

  const { fields: guestFields, append, remove } = useFieldArray({
    control,
    name: 'guests'
  })

  const watchGuestName = watch('guestName')
  const watchNumOfPeople = watch('numOfPeople')
  const watchTemplateId = watch('templateId')

  // Adjust guests array size when numOfPeople changes
  useEffect(() => {
    const num = parseInt(watchNumOfPeople) || 0;
    const currentLength = guestFields.length;
    if (num > currentLength) {
        for (let i = currentLength; i < num; i++) {
            append({ name: '' });
        }
    } else if (num < currentLength && num > 0) {
        for (let i = currentLength - 1; i >= num; i--) {
            remove(i);
        }
    } else if (num === 0) {
        // if 0, maybe clear them all or leave at least 1
        for (let i = currentLength - 1; i >= 0; i--) {
            remove(i);
        }
    }
  }, [watchNumOfPeople, append, remove, guestFields.length])

  // Sync eventId in form if context changes
  useEffect(() => { if (selectedEventId) reset({ eventId: selectedEventId, guestName: '', numOfPeople: 1, guests: [{ name: '' }] }) }, [selectedEventId, reset])

  const {
    selectedItem: editingInv,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,
    isCreate,
    isEdit,
    isDelete,
  } = useDialogState()

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CLIENT_INVITATIONS, selectedEventId],
    queryFn: () => getInvitations({ eventId: selectedEventId }),
    enabled: !!selectedEventId
  })

  const { data: dashboardData } = useQuery({
    queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
    queryFn: getClientDashboard,
  })

  const { data: templatesData } = useQuery({
    queryKey: ['client_templates'],
    queryFn: getClientTemplates,
  })

  const templates = useMemo(() => {
    return templatesData?.templates || templatesData?.data?.templates || templatesData?.data || []
  }, [templatesData])

  const {
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading: crudLoading,
  } = useCRUD({
    createFn: createInvitation,
    updateFn: updateInvitation,
    deleteFn: deleteInvitation,
    queryKey: [QUERY_KEYS.CLIENT_INVITATIONS, selectedEventId],
    successMessage: 'تمت العملية بنجاح',
  })

  const invitations = useMemo(() => {
    const d = data?.invitations || data?.data || (Array.isArray(data) ? data : [])
    return Array.isArray(d) ? d : []
  }, [data])

  const bookings = useMemo(() => {
    const d = dashboardData?.data || dashboardData || {}
    return d.allEvents || d.events || []
  }, [dashboardData])

  const currentEvent = selectedEvent || bookings.find(e => (e._id || e.id) === selectedEventId)

  const filteredInvs = useMemo(() => {
    let filtered = invitations
    if (debouncedSearch) {
      filtered = filtered.filter(i => 
        (i.guestName || '').toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }
    if (activeFilters.status) filtered = filtered.filter(i => i.status === activeFilters.status)
    return filtered
  }, [invitations, debouncedSearch, activeFilters])

  const columns = [
    { id: 'guestName', label: 'اسم الضيف', align: 'right', format: (v) => <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Mail size={16} /><MuiTypography variant="body2" sx={{ fontWeight: 600 }}>{v}</MuiTypography></MuiBox> },
    { id: 'numOfPeople', label: 'المرافقين', align: 'center', format: (v) => <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}><Users size={14} />{v}</MuiBox> },
    { id: 'status', label: 'الحالة', align: 'center', format: (v) => <MuiChip label={v === 'sent' ? 'تم الإرسال' : 'قيد الانتظار'} size="small" color={v === 'sent' ? 'success' : 'warning'} /> },
    { id: 'createdAt', label: 'تاريخ الإضافة', align: 'right', format: (v) => formatDate(v) }
  ]

  const handleDownloadCard = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2 })
    const link = document.createElement('a')
    link.download = `invitation-${selectedInv?.guestName}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleShareWhatsApp = (inv) => {
    const url = `${window.location.origin}/invite/${inv._id || inv.id}`
    const text = `أتشرف بدعوتكم لحضور مناسبتنا. رابط الدعوة: ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const onFormSubmit = formSubmit(async (formData) => {
    // Auto-assign default template if none selected
    let finalData = { ...formData }
    if (!finalData.templateId || finalData.templateId === '') {
      // Try to use event's default template first
      if (currentEvent?.templateId) {
        finalData.templateId = currentEvent.templateId
      } else if (currentEvent?.template?._id || currentEvent?.template?.id) {
        finalData.templateId = currentEvent.template._id || currentEvent.template.id
      } else if (templates.length > 0) {
        // Fallback to first available template
        finalData.templateId = templates[0]._id || templates[0].id
      }
    }
    
    const res = isEdit ? await handleUpdate(editingInv._id, finalData) : await handleCreate(finalData)
    if (res.success) closeDialog()
  })

  const getTemplateUrl = (inv) => {
    // If user is editing/creating and selected a template in the form, use it
    if ((isCreate || isEdit) && watchTemplateId) {
        const selectedTemplate = templates.find(t => (t._id || t.id) === watchTemplateId)
        if (selectedTemplate?.imageUrl) {
            return selectedTemplate.imageUrl.startsWith('http') ? selectedTemplate.imageUrl : `${import.meta.env.VITE_API_BASE}${selectedTemplate.imageUrl}`
        }
    }
    
    // Otherwise fallback to invitation's template or event's template
    const rawUrl = inv?.template?.imageUrl || inv?.eventId?.template?.imageUrl || currentEvent?.template?.imageUrl
    
    // If still no template found, try to get the default template
    if (!rawUrl) {
        // Try event's default template
        if (currentEvent?.templateId) {
            const defaultTemplate = templates.find(t => (t._id || t.id) === currentEvent.templateId)
            if (defaultTemplate?.imageUrl) {
                return defaultTemplate.imageUrl.startsWith('http') ? defaultTemplate.imageUrl : `${import.meta.env.VITE_API_BASE}${defaultTemplate.imageUrl}`
            }
        }
        // Fallback to first available template
        if (templates.length > 0) {
            const firstTemplate = templates[0]
            if (firstTemplate?.imageUrl) {
                return firstTemplate.imageUrl.startsWith('http') ? firstTemplate.imageUrl : `${import.meta.env.VITE_API_BASE}${firstTemplate.imageUrl}`
            }
        }
    }
    
    if (!rawUrl) return null
    return rawUrl.startsWith('http') ? rawUrl : `${import.meta.env.VITE_API_BASE}${rawUrl}`
  }

  // Handle open dialog logic to set initial templateId if needed
  useEffect(() => {
    if (isEdit && editingInv) {
        setValue('templateId', editingInv.template?._id || editingInv.templateId || '')
        if (editingInv.guests && editingInv.guests.length > 0) {
            setValue('guests', editingInv.guests.map(g => ({ name: g.name })))
        }
    }
  }, [isEdit, editingInv, setValue])

  if (isLoading && selectedEventId) return <LoadingScreen />

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 }, minHeight: '100vh', background: 'var(--color-bg-dark)' }}>
      <SEOHead title="الدعوات | INVOCCA" />

      <MuiBox sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MuiBox>
          <MuiTypography variant="h4" sx={{ fontWeight: 800, color: 'var(--color-icon)', mb: 1 }}>إدارة الدعوات</MuiTypography>
          <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
            إدارة دعوات الضيوف لـ {currentEvent?.name || 'المناسبة'}
          </MuiTypography>
        </MuiBox>
        <MuiBox sx={{ display: 'flex', gap: 2 }}>
            <MuiButton variant="outlined" startIcon={<ChevronLeft />} onClick={() => selectEvent(null)}>تغيير المناسبة</MuiButton>
            <MuiButton variant="contained" startIcon={<Plus />} onClick={openCreateDialog} disabled={!selectedEventId}>إضافة دعوة</MuiButton>
        </MuiBox>
      </MuiBox>

      {!selectedEventId ? (
        <EmptyState title="يرجى اختيار مناسبة أولاً" description="يجب اختيار مناسبة من لوحة التحكم لإدارة الدعوات الخاصة بها" icon={Mail} />
      ) : (
        <>
            <MuiPaper sx={{ p: 2, mb: 3, borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <MuiGrid container spacing={2} alignItems="center">
                <MuiGrid item xs={12} md={8}>
                    <MuiTextField fullWidth placeholder="البحث عن ضيف..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </MuiGrid>
                <MuiGrid item xs={12} md={4}>
                    <AdvancedFilter 
                    onFilterChange={setActiveFilters} 
                    configs={[{ key: 'status', label: 'الحالة', type: 'select', options: [{ value: 'sent', label: 'تم الإرسال' }, { value: 'pending', label: 'قيد الانتظار' }] }]} 
                    />
                </MuiGrid>
                </MuiGrid>
            </MuiPaper>

            <MuiPaper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                {filteredInvs.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={filteredInvs}
                    showActions
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    customActions={(row) => (
                    <>
                        <MuiIconButton onClick={() => { setSelectedInv(row); setShowCard(true); }} color="primary" title="عرض البطاقة"><Eye size={18} /></MuiIconButton>
                        <MuiIconButton onClick={() => handleShareWhatsApp(row)} color="success" title="مشاركة واتساب"><Send size={18} /></MuiIconButton>
                    </>
                    )}
                />
                ) : <EmptyState title="لا توجد دعوات" icon={Mail} showPaper={false} />}
            </MuiPaper>
        </>
      )}

      {/* Invitation Card Dialog */}
      <MuiDialog open={showCard} onClose={() => setShowCard(false)} maxWidth="sm" fullWidth>
        <MuiDialogContent sx={{ p: 4, textAlign: 'center', bgcolor: 'var(--color-bg-dark)' }}>
          <InvitationCardPreview
            cardRef={cardRef}
            guestName={selectedInv?.guestName}
            numOfPeople={selectedInv?.numOfPeople}
            eventName={selectedInv?.eventId?.name || currentEvent?.name}
            eventDate={selectedInv?.eventId?.date || currentEvent?.date || selectedInv?.eventDate}
            startTime={selectedInv?.eventId?.startTime || currentEvent?.startTime}
            hallName={selectedInv?.eventId?.hallId?.name || selectedInv?.eventId?.hall?.name || currentEvent?.hallId?.name || currentEvent?.hall?.name}
            qrCodeImage={selectedInv?.qrCodeImage}
            templateUrl={getTemplateUrl(selectedInv)}
          />
        </MuiDialogContent>
        <MuiDialogActions sx={{ p: 3 }}>
          <MuiButton startIcon={<Download />} onClick={handleDownloadCard} variant="contained" fullWidth>تحميل البطاقة كصورة</MuiButton>
        </MuiDialogActions>
      </MuiDialog>

      {/* Full Screen Create/Edit Dialog */}
      <MuiDialog 
        open={isCreate || isEdit} 
        onClose={closeDialog} 
        fullScreen 
        PaperProps={{ sx: { bgcolor: 'var(--color-bg-dark)', m: 0, borderRadius: 0 } }}
      >
        <MuiBox sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border)',
            bgcolor: 'var(--color-bg-card)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <MuiTypography variant="h6" sx={{ fontWeight: 800, color: 'var(--color-icon)' }}>
                {isEdit ? 'تعديل دعوة' : 'إضافة دعوة جديدة'}
            </MuiTypography>
            <MuiBox sx={{ display: 'flex', gap: 2 }}>
                <MuiButton variant="outlined" color="inherit" onClick={closeDialog}>إلغاء</MuiButton>
                <MuiButton variant="contained" onClick={onFormSubmit} disabled={crudLoading}>حفظ الدعوة</MuiButton>
            </MuiBox>
        </MuiBox>

        <MuiDialogContent sx={{ p: 0 }}>
            <MuiGrid container sx={{ height: '100%' }}>
                {/* Left Side: Preview (Takes 60% on desktop) */}
                <MuiGrid item xs={12} md={7} sx={{ 
                    bgcolor: 'rgba(0,0,0,0.2)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 4,
                    borderRight: '1px solid var(--color-border)'
                }}>
                    <InvitationCardPreview
                        guestName={watchGuestName}
                        numOfPeople={watchNumOfPeople}
                        eventName={currentEvent?.name}
                        eventDate={currentEvent?.date || currentEvent?.eventDate}
                        startTime={currentEvent?.startTime}
                        hallName={currentEvent?.hallId?.name || currentEvent?.hall?.name}
                        qrCodeImage={editingInv?.qrCodeImage}
                        templateUrl={getTemplateUrl(editingInv)}
                    />
                </MuiGrid>

                {/* Right Side: Form (Takes 40% on desktop) */}
                <MuiGrid item xs={12} md={5} sx={{ p: { xs: 3, md: 5 }, overflowY: 'auto' }}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: 'var(--color-icon)' }}>
                        تفاصيل الدعوة
                    </MuiTypography>
                    
                    <Controller name="eventId" control={control} render={({ field }) => (
                        <MuiFormControl fullWidth sx={{ mb: 3, display: 'none' }}>
                            <MuiSelect {...field}>
                                <MuiMenuItem value={selectedEventId}>{currentEvent?.name}</MuiMenuItem>
                            </MuiSelect>
                        </MuiFormControl>
                    )} />
                    
                    <Controller name="guestName" control={control} render={({ field, fieldState }) => (
                        <MuiTextField {...field} label="اسم الضيف (سيظهر على البطاقة)" fullWidth sx={{ mb: 3 }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )} />
                    
                    <Controller name="numOfPeople" control={control} render={({ field, fieldState }) => (
                        <MuiTextField {...field} type="number" label="عدد المرافقين المسموح لهم بالدخول" fullWidth sx={{ mb: 4 }} error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )} />

                    {guestFields.length > 0 && (
                        <MuiBox sx={{ mb: 4 }}>
                            <MuiTypography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-icon)' }}>
                                أسماء المرافقين
                            </MuiTypography>
                            {guestFields.map((field, index) => (
                                <Controller 
                                    key={field.id}
                                    name={`guests.${index}.name`} 
                                    control={control} 
                                    render={({ field: inputField, fieldState }) => (
                                        <MuiTextField 
                                            {...inputField} 
                                            label={`اسم المرافق ${index + 1}`} 
                                            fullWidth 
                                            sx={{ mb: 2 }} 
                                            error={!!fieldState.error} 
                                            helperText={fieldState.error?.message} 
                                        />
                                    )} 
                                />
                            ))}
                        </MuiBox>
                    )}

                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-icon)' }}>
                        قالب البطاقة (اختياري)
                    </MuiTypography>
                    <MuiTypography variant="body2" sx={{ mb: 3, color: 'var(--color-text-secondary)' }}>
                        يمكنك تغيير الخلفية الخاصة بهذه الدعوة. إذا لم تختر قالباً، سيتم استخدام القالب الافتراضي للفعالية.
                    </MuiTypography>
                    
                    <MuiGrid container spacing={2}>
                        {templates.map(template => (
                            <MuiGrid item xs={6} sm={4} key={template._id || template.id}>
                                <MuiBox 
                                    onClick={() => setValue('templateId', template._id || template.id)}
                                    sx={{ 
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: watchTemplateId === (template._id || template.id) ? '3px solid var(--color-gold)' : '2px solid transparent',
                                        opacity: watchTemplateId && watchTemplateId !== (template._id || template.id) ? 0.6 : 1,
                                        transition: 'all 0.2s ease',
                                        aspectRatio: '0.6',
                                        backgroundImage: `url(${template.imageUrl?.startsWith('http') ? template.imageUrl : import.meta.env.VITE_API_BASE + template.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        '&:hover': {
                                            opacity: 1,
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                />
                            </MuiGrid>
                        ))}
                        {templates.length === 0 && (
                            <MuiGrid item xs={12}>
                                <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                    لا توجد قوالب متاحة حالياً.
                                </MuiTypography>
                            </MuiGrid>
                        )}
                    </MuiGrid>
                </MuiGrid>
            </MuiGrid>
        </MuiDialogContent>
      </MuiDialog>

      <ConfirmDialog
        open={isDelete}
        onClose={closeDialog}
        onConfirm={async () => {
          const res = await handleDelete(editingInv._id)
          if (res.success) closeDialog()
        }}
        title="حذف دعوة"
        message={`هل أنت متأكد من حذف دعوة "${editingInv?.guestName}"؟`}
        loading={crudLoading}
      />
    </MuiBox>
  )
}
