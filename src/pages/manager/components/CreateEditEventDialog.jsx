import { useEffect, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiInputLabel from '@/components/ui/MuiInputLabel'
import MuiIconButton from '@/components/ui/MuiIconButton'
import MuiButton from '@/components/ui/MuiButton'
import MuiFormHelperText from '@/components/ui/MuiFormHelperText'
import MuiDatePicker from '@/components/ui/MuiDatePicker'
import MuiTimePicker from '@/components/ui/MuiTimePicker'
import { FormDialog } from '@/components/common'
import { useNotification } from '@/hooks'
import { getClients, getManagerHall, listManagerTemplates, getStaff } from '@/api/manager'
import { QUERY_KEYS } from '@/config/constants'
import { Plus, Trash2 } from 'lucide-react'

// Validation Schema
const createEventSchema = (editingEvent = null) => {
    return z.object({
        eventName: z.string().min(3, 'اسم الفعالية يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم الفعالية طويل جداً'),
        eventType: z.string().min(1, 'نوع الفعالية مطلوب'),
        eventDate: z.string().min(1, 'تاريخ الفعالية مطلوب'),
        startTime: z.string().min(1, 'وقت البداية مطلوب'),
        endTime: z.string().min(1, 'وقت النهاية مطلوب'),
        guestCount: z.coerce.number().min(1, 'عدد الضيوف مطلوب'),
        requiredEmployees: z.coerce.number().min(0, 'عدد الموظفين يجب أن يكون 0 أو أكثر').optional().default(0),
        services: z.array(z.object({
            service: z.string().min(1, 'الخدمة مطلوبة'),
            quantity: z.coerce.number().min(1, 'الكمية مطلوبة'),
            price: z.coerce.number().min(0, 'السعر مطلوب')
        })).optional().default([]),
        specialRequests: z.string().optional(),
        templateId: z.string().optional().nullable(),
        scanners: z.array(z.object({
            scannerId: z.string().min(1, 'الماسح مطلوب')
        })).optional().default([]),
        clientSelection: z.enum(['existing', 'new']).default('existing'),
        clientId: z.string().optional(),
        clientName: z.string().optional(),
        clientusername: z.string().optional(),
        phone: z.string().optional(),
        password: z.string().optional()
    }).superRefine((data, ctx) => {
        if (data.clientSelection === 'existing') {
            if (!editingEvent && (!data.clientId || !data.clientId.trim())) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'يرجى اختيار عميل موجود',
                    path: ['clientId']
                })
            }
        } else {
            // New client - all fields are required
            if (!data.clientName || !data.clientName.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'اسم العميل مطلوب',
                    path: ['clientName']
                })
            }
            if (!data.clientusername || !data.clientusername.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'اسم المستخدم مطلوب',
                    path: ['clientusername']
                })
            }
            if (!data.phone || !data.phone.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'رقم الهاتف مطلوب',
                    path: ['phone']
                })
            }
            if (!data.password || !data.password.trim()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'كلمة المرور مطلوبة',
                    path: ['password']
                })
            } else {
                // Validate password strength
                const password = data.password.trim()
                if (password.length < 6) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['password'],
                        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
                    })
                }
                if (!/[A-Z]/.test(password)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['password'],
                        message: 'كلمة المرور يجب أن تحتوي على حرف كبير على الأقل',
                    })
                }
                if (!/[a-z]/.test(password)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['password'],
                        message: 'كلمة المرور يجب أن تحتوي على حرف صغير على الأقل',
                    })
                }
                if (!/[0-9]/.test(password)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['password'],
                        message: 'كلمة المرور يجب أن تحتوي على رقم على الأقل',
                    })
                }
            }
        }
    })
}

export default function CreateEditEventDialog({ open, onClose, onSubmit, editingEvent, loading }) {
    const { addNotification: showNotification } = useNotification()
    const [clientSelection, setClientSelection] = useState('existing')

    // Fetch clients for dropdown
    const { data: clientsData } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_CLIENTS],
        queryFn: getClients,
        enabled: open,
    })

    // Fetch hall info to get services with full details
    const { data: hallData, isLoading: servicesLoading } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_HALL,
        queryFn: getManagerHall,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })

    // Fetch templates for selection
    const { data: templatesData, isLoading: templatesLoading } = useQuery({
        queryKey: ['manager', 'templates'],
        queryFn: listManagerTemplates,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })

    // Fetch staff to get scanners
    const { data: staffData, isLoading: scannersLoading } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_STAFF],
        queryFn: getStaff,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })

    const clients = clientsData?.clients || clientsData?.data || []
    
    // Get scanners from staff - filter by role 'scanner'
    const staff = staffData?.staff || staffData?.data || []
    const scanners = Array.isArray(staff) 
        ? staff.filter(s => s.role === 'scanner' || s.position === 'scanner')
        : []
    
    // Get templates from response - handle different response structures
    const templates = Array.isArray(templatesData?.templates) 
        ? templatesData.templates 
        : Array.isArray(templatesData?.data) 
            ? templatesData.data 
            : Array.isArray(templatesData) 
                ? templatesData 
                : []
    
    // Get services from hall response - services now include full service details in service object
    const hall = hallData?.hall || hallData || {}
    const servicesList = Array.isArray(hall.services) 
        ? hall.services
            .map(hallService => {
                // Extract service details from hallService.service object
                const serviceDetails = hallService.service || {}
                return {
                    _id: serviceDetails._id || hallService.service || hallService._id,
                    id: serviceDetails._id || serviceDetails.id || hallService.service || hallService._id,
                    name: serviceDetails.name || 'خدمة',
                    category: serviceDetails.category || '',
                    basePrice: serviceDetails.basePrice || 0,
                    unit: serviceDetails.unit || 'per_event',
                    // Include hall service specific data
                    isIncluded: hallService.isIncluded,
                    notes: hallService.notes || '',
                    hallServiceId: hallService._id
                }
            })
            .filter(service => service._id) // Filter out invalid services
        : []

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        resolver: zodResolver(createEventSchema(editingEvent)),
        defaultValues: {
            eventName: editingEvent?.eventName || editingEvent?.name || '',
            eventType: editingEvent?.eventType || 'wedding',
            eventDate: editingEvent?.eventDate || editingEvent?.date || '',
            startTime: editingEvent?.startTime || '',
            endTime: editingEvent?.endTime || '',
            guestCount: editingEvent?.guestCount || 0,
            requiredEmployees: editingEvent?.requiredEmployees || 0,
            services: editingEvent?.services?.map(s => ({
                service: s.service?._id || s.service || '',
                quantity: s.quantity || 1,
                price: s.price || 0
            })) || [],
            specialRequests: editingEvent?.specialRequests || '',
            templateId: editingEvent?.template?._id || editingEvent?.templateId?._id || editingEvent?.templateId || null,
            scanners: editingEvent?.scanners?.map(s => ({
                scannerId: s.scannerId?._id || s.scannerId || s._id || ''
            })) || [],
            clientSelection: 'existing',
            clientId: editingEvent?.clientId?._id || editingEvent?.clientId || editingEvent?.client?._id || '',
            clientName: '',
            clientusername: '',
            phone: '',
            password: ''
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'services'
    })

    const { fields: scannerFields, append: appendScanner, remove: removeScanner } = useFieldArray({
        control,
        name: 'scanners'
    })

    const watchedClientSelection = watch('clientSelection')

    useEffect(() => {
        setClientSelection(watchedClientSelection || 'existing')
    }, [watchedClientSelection])

    useEffect(() => {
        if (open) {
            if (editingEvent) {
                reset({
                    eventName: editingEvent.eventName || editingEvent.name || '',
                    eventType: editingEvent.eventType || 'wedding',
                    eventDate: editingEvent.eventDate || editingEvent.date || '',
                    startTime: editingEvent.startTime || '',
                    endTime: editingEvent.endTime || '',
                    guestCount: editingEvent.guestCount || 0,
                    requiredEmployees: editingEvent.requiredEmployees || 0,
                    services: editingEvent.services?.map(s => ({
                        service: s.service?._id || s.service || '',
                        quantity: s.quantity || 1,
                        price: s.price || 0
                    })) || [],
                    specialRequests: editingEvent.specialRequests || '',
                    templateId: editingEvent.template?._id || editingEvent.templateId?._id || editingEvent.templateId || null,
                    scanners: editingEvent.scanners?.map(s => ({
                        scannerId: s.scannerId?._id || s.scannerId || s._id || ''
                    })) || [],
                    clientSelection: 'existing',
                    clientId: editingEvent.clientId?._id || editingEvent.clientId || editingEvent.client?._id || '',
                    clientName: '',
                    clientusername: '',
                    phone: '',
                    password: ''
                })
            } else {
                reset({
                    eventName: '',
                    eventType: 'wedding',
                    eventDate: '',
                    startTime: '',
                    endTime: '',
                    guestCount: 0,
                    requiredEmployees: 0,
                    services: [],
                    specialRequests: '',
                    templateId: null,
                    scanners: [],
                    clientSelection: 'existing',
                    clientId: '',
                    clientName: '',
                    clientusername: '',
                    phone: '',
                    password: ''
                })
            }
        }
    }, [open, editingEvent, reset])

    const handleFormSubmit = (data) => {
        // Prepare the data according to API requirements
        const submitData = {
            eventName: data.eventName,
            eventType: data.eventType,
            eventDate: data.eventDate,
            startTime: data.startTime,
            endTime: data.endTime,
            guestCount: data.guestCount,
            requiredEmployees: data.requiredEmployees || 0,
            services: data.services || [],
            specialRequests: data.specialRequests || '',
            // Template ID - ensure it's a valid string ID or null
            // Handle empty string from select (when "بدون قالب" is selected)
            templateId: (data.templateId && typeof data.templateId === 'string' && data.templateId.trim() && data.templateId !== '') 
                ? data.templateId.trim() 
                : (data.templateId && typeof data.templateId === 'object' && data.templateId._id)
                    ? String(data.templateId._id).trim()
                    : null,
            // Scanners - format as array of objects with scannerId
            scanners: (data.scanners || []).filter(s => s.scannerId && s.scannerId.trim()).map(s => ({
                scannerId: s.scannerId.trim()
            }))
        }

        // Add client data based on selection
        const clientSelection = data.clientSelection || 'existing'
        
        if (clientSelection === 'existing') {
            // If editing, we might not need to send clientId again
            if (!editingEvent) {
                if (!data.clientId || !data.clientId.trim()) {
                    showNotification({
                        title: 'خطأ',
                        message: 'يرجى اختيار عميل موجود',
                        type: 'error'
                    })
                    return
                }
                submitData.clientId = data.clientId.trim()
            }
        } else {
            // New client - API expects 'name' for the client
            // Ensure all required fields are present and not empty
            const clientName = (data.clientName || '').trim()
            const clientusername = (data.clientusername || clientName || '').trim()
            const phone = (data.phone || '').trim()
            const password = (data.password || '').trim()
            
            if (!clientName || !phone || !password) {
                showNotification({
                    title: 'خطأ',
                    message: `يرجى إدخال جميع بيانات العميل الجديد. البيانات الحالية: name=${!!clientName}, phone=${!!phone}, password=${!!password}`,
                    type: 'error'
                })
                return
            }
            
            // API expects 'name' not 'clientName' for new client
            submitData.name = clientName
            submitData.username = clientusername || clientName
            submitData.phone = phone
            submitData.password = password
        }

        onSubmit(submitData)
    }

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={editingEvent ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
            onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                const firstError = Object.values(errors)[0]
                showNotification({
                    title: 'بيانات غير مكتملة',
                    message: firstError?.message || 'يرجى التحقق من الحقول المطلوبة',
                    type: 'error'
                })
            })}
            loading={loading}
            submitText={editingEvent ? 'تحديث' : 'إضافة'}
            cancelText="إلغاء"
            maxWidth="md"
        >
            <MuiGrid container spacing={3}>
                {/* Basic Info */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-primary-500)' }}>
                        المعلومات الأساسية
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="eventName"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="اسم الفعالية"
                                fullWidth
                                required
                                error={!!errors.eventName}
                                helperText={errors.eventName?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="eventType"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <MuiBox>
                                <MuiSelect
                                    {...field}
                                    label="نوع الفعالية"
                                    error={!!error}
                                    fullWidth
                                >
                                    <MuiMenuItem value="wedding">زفاف</MuiMenuItem>
                                    <MuiMenuItem value="birthday">عيد ميلاد</MuiMenuItem>
                                    <MuiMenuItem value="engagement">خطوبة</MuiMenuItem>
                                    <MuiMenuItem value="graduation">تخرج</MuiMenuItem>
                                    <MuiMenuItem value="corporate">فعالية شركات</MuiMenuItem>
                                    <MuiMenuItem value="other">أخرى</MuiMenuItem>
                                </MuiSelect>
                                {error && (
                                    <MuiFormHelperText sx={{ color: 'var(--color-error-500)', mt: 0.5, mx: 1.75 }}>
                                        {error.message}
                                    </MuiFormHelperText>
                                )}
                            </MuiBox>
                        )}
                    />
                </MuiGrid>

                {/* Template Selection */}
                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="templateId"
                        control={control}
                        render={({ field, fieldState: { error } }) => {
                            // Normalize the value to string for MuiSelect comparison
                            const templateValue = field.value 
                                ? (typeof field.value === 'string' ? field.value : (field.value._id || field.value.id || String(field.value)))
                                : ''
                            
                            return (
                                <MuiBox>
                                    <MuiSelect
                                        label="القالب (اختياري)"
                                        value={templateValue}
                                        disabled={templatesLoading}
                                        error={!!error}
                                        fullWidth
                                        onChange={(e) => {
                                            // Convert empty string to null for proper API handling
                                            const value = e.target.value === '' ? null : e.target.value
                                            field.onChange(value)
                                        }}
                                    >
                                        <MuiMenuItem value="">
                                            <em>بدون قالب</em>
                                        </MuiMenuItem>
                                        {templates.map((template) => {
                                            const templateId = template._id || template.id
                                            return (
                                                <MuiMenuItem key={templateId} value={String(templateId)}>
                                                    {template.templateName || template.name || 'قالب بدون اسم'}
                                                </MuiMenuItem>
                                            )
                                        })}
                                    </MuiSelect>
                                    {error && (
                                        <MuiFormHelperText sx={{ color: 'var(--color-error-500)', mt: 0.5, mx: 1.75 }}>
                                            {error.message}
                                        </MuiFormHelperText>
                                    )}
                                </MuiBox>
                            )
                        }}
                    />
                </MuiGrid>

                {/* Date & Time */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        التاريخ والوقت
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="eventDate"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <MuiDatePicker
                                label="تاريخ الفعالية"
                                value={field.value || null}
                                onChange={field.onChange}
                                fullWidth
                                required
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="startTime"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <MuiTimePicker
                                label="وقت البداية"
                                value={field.value || null}
                                onChange={field.onChange}
                                fullWidth
                                required
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="endTime"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <MuiTimePicker
                                label="وقت النهاية"
                                value={field.value || null}
                                onChange={field.onChange}
                                fullWidth
                                required
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Guests & Employees */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        الضيوف والموظفين
                    </MuiTypography>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="guestCount"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="عدد الضيوف"
                                type="number"
                                fullWidth
                                required
                                error={!!errors.guestCount}
                                helperText={errors.guestCount?.message}
                            />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="requiredEmployees"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="عدد الموظفين المطلوب"
                                type="number"
                                fullWidth
                                error={!!errors.requiredEmployees}
                                helperText={errors.requiredEmployees?.message}
                            />
                        )}
                    />
                </MuiGrid>

                {/* Client Selection */}
                {!editingEvent && (
                    <>
                        <MuiGrid item xs={12}>
                            <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                                العميل
                            </MuiTypography>
                        </MuiGrid>

                        <MuiGrid item xs={12}>
                            <Controller
                                name="clientSelection"
                                control={control}
                                render={({ field }) => (
                                    <MuiSelect
                                        {...field}
                                        label="اختر نوع العميل"
                                        fullWidth
                                        onChange={(e) => {
                                            field.onChange(e)
                                            setClientSelection(e.target.value)
                                        }}
                                    >
                                        <MuiMenuItem value="existing">عميل موجود</MuiMenuItem>
                                        <MuiMenuItem value="new">عميل جديد</MuiMenuItem>
                                    </MuiSelect>
                                )}
                            />
                        </MuiGrid>

                        {clientSelection === 'existing' ? (
                            <MuiGrid item xs={12}>
                                <Controller
                                    name="clientId"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <MuiBox>
                                            <MuiSelect
                                                {...field}
                                                label="العميل"
                                                error={!!error}
                                                fullWidth
                                            >
                                                {Array.isArray(clients) && clients.map(client => (
                                                    <MuiMenuItem key={client._id || client.id} value={client._id || client.id}>
                                                        {client.name}
                                                    </MuiMenuItem>
                                                ))}
                                            </MuiSelect>
                                            {error && (
                                                <MuiFormHelperText sx={{ color: 'var(--color-error-500)', mt: 0.5, mx: 1.75 }}>
                                                    {error.message}
                                                </MuiFormHelperText>
                                            )}
                                        </MuiBox>
                                    )}
                                />
                            </MuiGrid>
                        ) : (
                            <>
                                <MuiGrid item xs={12} sm={6}>
                                    <Controller
                                        name="clientName"
                                        control={control}
                                        render={({ field }) => (
                                            <MuiTextField
                                                {...field}
                                                label="اسم العميل"
                                                fullWidth
                                                required
                                                error={!!errors.clientName}
                                                helperText={errors.clientName?.message}
                                            />
                                        )}
                                    />
                                </MuiGrid>

                                <MuiGrid item xs={12} sm={6}>
                                    <Controller
                                        name="clientusername"
                                        control={control}
                                        render={({ field }) => (
                                            <MuiTextField
                                                {...field}
                                                label="اسم المستخدم"
                                                fullWidth
                                                required
                                                error={!!errors.clientusername}
                                                helperText={errors.clientusername?.message}
                                            />
                                        )}
                                    />
                                </MuiGrid>

                                <MuiGrid item xs={12} sm={6}>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <MuiTextField
                                                {...field}
                                                label="رقم الهاتف"
                                                fullWidth
                                                required
                                                error={!!errors.phone}
                                                helperText={errors.phone?.message}
                                            />
                                        )}
                                    />
                                </MuiGrid>

                                <MuiGrid item xs={12} sm={6}>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <MuiTextField
                                                {...field}
                                                label="كلمة المرور"
                                                type="password"
                                                fullWidth
                                                required
                                                error={!!errors.password}
                                                helperText={errors.password?.message}
                                            />
                                        )}
                                    />
                                </MuiGrid>
                            </>
                        )}
                    </>
                )}

                {/* Services */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        الخدمات
                    </MuiTypography>
                </MuiGrid>

                {fields.map((item, index) => (
                    <MuiGrid item xs={12} container spacing={2} key={item.id} sx={{ alignItems: 'flex-start' }}>
                        <MuiGrid item xs={12} sm={5}>
                            <Controller
                                name={`services.${index}.service`}
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <MuiBox>
                                        <MuiSelect
                                            {...field}
                                            label="الخدمة"
                                            disabled={servicesLoading}
                                            error={!!error}
                                            fullWidth
                                        >
                                            {servicesLoading ? (
                                                <MuiMenuItem value="" disabled>جاري التحميل...</MuiMenuItem>
                                            ) : servicesList.length === 0 ? (
                                                <MuiMenuItem value="" disabled>لا توجد خدمات متاحة</MuiMenuItem>
                                            ) : (
                                                servicesList.map(service => (
                                                    <MuiMenuItem key={service._id || service.id} value={service._id || service.id}>
                                                        {service.name}
                                                    </MuiMenuItem>
                                                ))
                                            )}
                                        </MuiSelect>
                                        {error && (
                                            <MuiFormHelperText sx={{ color: 'var(--color-error-500)', mt: 0.5, mx: 1.75 }}>
                                                {error.message}
                                            </MuiFormHelperText>
                                        )}
                                    </MuiBox>
                                )}
                            />
                        </MuiGrid>
                        <MuiGrid item xs={12} sm={3}>
                            <Controller
                                name={`services.${index}.quantity`}
                                control={control}
                                render={({ field }) => (
                                    <MuiTextField
                                        {...field}
                                        label="الكمية"
                                        type="number"
                                        fullWidth
                                        required
                                        error={!!errors.services?.[index]?.quantity}
                                        helperText={errors.services?.[index]?.quantity?.message}
                                    />
                                )}
                            />
                        </MuiGrid>
                        <MuiGrid item xs={12} sm={3}>
                            <Controller
                                name={`services.${index}.price`}
                                control={control}
                                render={({ field }) => (
                                    <MuiTextField
                                        {...field}
                                        label="السعر"
                                        type="number"
                                        fullWidth
                                        required
                                        error={!!errors.services?.[index]?.price}
                                        helperText={errors.services?.[index]?.price?.message}
                                    />
                                )}
                            />
                        </MuiGrid>
                        <MuiGrid item xs={12} sm={1}>
                            <MuiIconButton
                                onClick={() => remove(index)}
                                color="error"
                                sx={{ mt: 1 }}
                            >
                                <Trash2 size={20} />
                            </MuiIconButton>
                        </MuiGrid>
                    </MuiGrid>
                ))}

                <MuiGrid item xs={12}>
                    <MuiButton
                        startIcon={<Plus size={20} />}
                        onClick={() => append({ service: '', quantity: 1, price: 0 })}
                        variant="outlined"
                        sx={{ borderRadius: '12px', borderColor: 'var(--color-border-glass)', color: 'var(--color-text-secondary)' }}
                    >
                        إضافة خدمة
                    </MuiButton>
                </MuiGrid>

                {/* Scanners Selection */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        الماسحات
                    </MuiTypography>
                </MuiGrid>

                {scannerFields.map((item, index) => (
                    <MuiGrid item xs={12} container spacing={2} key={item.id} sx={{ alignItems: 'flex-start' }}>
                        <MuiGrid item xs={12} sm={11}>
                            <Controller
                                name={`scanners.${index}.scannerId`}
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <MuiBox>
                                        <MuiSelect
                                            {...field}
                                            label="الماسح"
                                            disabled={scannersLoading}
                                            error={!!error}
                                            fullWidth
                                        >
                                            {scannersLoading ? (
                                                <MuiMenuItem value="" disabled>جاري التحميل...</MuiMenuItem>
                                            ) : scanners.length === 0 ? (
                                                <MuiMenuItem value="" disabled>لا توجد ماسحات متاحة</MuiMenuItem>
                                            ) : (
                                                scanners.map(scanner => (
                                                    <MuiMenuItem key={scanner._id || scanner.id} value={scanner._id || scanner.id}>
                                                        {scanner.name || scanner.username || 'ماسح بدون اسم'}
                                                    </MuiMenuItem>
                                                ))
                                            )}
                                        </MuiSelect>
                                        {error && (
                                            <MuiFormHelperText sx={{ color: 'var(--color-error-500)', mt: 0.5, mx: 1.75 }}>
                                                {error.message}
                                            </MuiFormHelperText>
                                        )}
                                    </MuiBox>
                                )}
                            />
                        </MuiGrid>
                        <MuiGrid item xs={12} sm={1}>
                            <MuiIconButton
                                onClick={() => removeScanner(index)}
                                color="error"
                                sx={{ mt: 1 }}
                            >
                                <Trash2 size={20} />
                            </MuiIconButton>
                        </MuiGrid>
                    </MuiGrid>
                ))}

                <MuiGrid item xs={12}>
                    <MuiButton
                        startIcon={<Plus size={20} />}
                        onClick={() => appendScanner({ scannerId: '' })}
                        variant="outlined"
                        disabled={scanners.length === 0}
                        sx={{ borderRadius: '12px', borderColor: 'var(--color-border-glass)', color: 'var(--color-text-secondary)' }}
                    >
                        إضافة ماسح
                    </MuiButton>
                </MuiGrid>

                {/* Special Requests */}
                <MuiGrid item xs={12}>
                    <Controller
                        name="specialRequests"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                label="طلبات خاصة"
                                multiline
                                rows={3}
                                fullWidth
                                error={!!errors.specialRequests}
                                helperText={errors.specialRequests?.message}
                            />
                        )}
                    />
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}
