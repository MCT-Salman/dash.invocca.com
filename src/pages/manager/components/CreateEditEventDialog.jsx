import { useEffect, useState, useMemo, useCallback } from 'react'

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

import { getClients, getManagerHall, getHallServices, listManagerTemplates, getStaff, getEventScanners } from '@/api/manager'

import { QUERY_KEYS, API_CONFIG } from '@/config/constants'

import { Plus, Trash2, Building2 } from 'lucide-react'



// Validation Schema

const createEventSchema = (editingEvent = null) => {

    return z.object({

        eventName: z.string().min(3, 'اسم الفعالية يجب أن يكون 3 أحرف على الأقل').max(100, 'اسم الفعالية طويل جداً'),

        eventType: z.string().min(1, 'نوع الفعالية مطلوب'),

        eventDate: z.string().min(1, 'تاريخ الفعالية مطلوب'),

        startTime: z.string().min(1, 'وقت البداية مطلوب'),

        endTime: z.string().min(1, 'وقت النهاية مطلوب'),

        guestCount: z.coerce.number().min(1, 'عدد الضيوف مطلوب'),

        requiredEmployees: z.coerce.number().min(0, 'عدد الموظفين مطلوب'),

        services: z.array(z.object({

            service: z.string().min(1, 'الخدمة مطلوبة'),

            quantity: z.coerce.number().min(1, 'الكمية مطلوبة'),

            price: z.coerce.number().min(0, 'السعر مطلوب')

        })).optional().default([]),

        specialRequests: z.string().optional(),

        templateId: z.string().optional().nullable(),

        scanners: z.array(z.object({
            scannerId: z.string().min(1, 'الماسح مطلوب')
        })).min(1, 'يجب اختيار ماسح واحد على الأقل للفعالية'),

        clientSelection: z.enum(['existing', 'new', 'edit']).default('new'),

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

        } else if (data.clientSelection === 'new') {

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

        } else if (data.clientSelection === 'edit') {

            // Edit existing client - name and phone required, password optional

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

            // Password is optional when editing - only validate if provided

            if (data.password && data.password.trim()) {

                const password = data.password.trim()

                if (password.length < 6) {

                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })

                }

                if (!/[A-Z]/.test(password)) {

                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'كلمة المرور يجب أن تحتوي على حرف كبير على الأقل' })

                }

                if (!/[a-z]/.test(password)) {

                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'كلمة المرور يجب أن تحتوي على حرف صغير على الأقل' })

                }

                if (!/[0-9]/.test(password)) {

                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'كلمة المرور يجب أن تحتوي على رقم على الأقل' })

                }

            }

        }

    })

}



export default function CreateEditEventDialog({ open, onClose, onSubmit, editingEvent, loading }) {

    const { addNotification: showNotification } = useNotification()

    const [clientSelection, setClientSelection] = useState('new')



    // Fetch clients for dropdown

    const { data: clientsData, isLoading: clientsLoading, error: clientsError } = useQuery({

        queryKey: QUERY_KEYS.MANAGER_CLIENTS,

        queryFn: getClients,

        enabled: open,

    })



    // Debug: Log client data

    console.log('CreateEditEventDialog - clientsData:', clientsData)

    console.log('CreateEditEventDialog - clientsLoading:', clientsLoading)

    console.log('CreateEditEventDialog - clientsError:', clientsError)



    // Fetch hall services list with full details (names, prices, etc.)

    const { data: servicesData, isLoading: servicesLoading } = useQuery({

        queryKey: ['manager', 'hall-services'],

        queryFn: getHallServices,

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



    // Fetch hall info for default staff
    const { data: hallData } = useQuery({
        queryKey: ['manager', 'hall'],
        queryFn: getManagerHall,
        enabled: open,
        staleTime: 10 * 60 * 1000
    })

    // Fetch staff to get scanners
    const { data: staffData, isLoading: scannersLoading } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_STAFF],
        queryFn: getStaff,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })



    // Fetch event scanners when editing

    const eventId = editingEvent?._id || editingEvent?.id

    const { data: eventScannersData } = useQuery({

        queryKey: ['manager', 'events', eventId, 'scanners'],

        queryFn: () => getEventScanners(eventId),

        enabled: open && !!editingEvent && !!eventId,

        staleTime: 2 * 60 * 1000

    })



    const clients = clientsData?.clients || clientsData?.data || []

    

    // Debug: Log processed clients

    console.log('CreateEditEventDialog - processed clients:', clients)

    console.log('CreateEditEventDialog - clients length:', clients.length)



    const staff = staffData?.staff || staffData?.data || []

    const scanners = Array.isArray(staff)

        ? staff.filter(s => {
            const role = String(s.role || s.position || '').toLowerCase()
            return role === 'scanner'
        })

        : []



    // Get event scanners from API response - memoized to prevent infinite loops

    const eventScanners = useMemo(() => {

        return Array.isArray(eventScannersData?.scanners)

            ? eventScannersData.scanners

            : Array.isArray(eventScannersData?.data)

                ? eventScannersData.data

                : Array.isArray(eventScannersData)

                    ? eventScannersData

                    : []

    }, [eventScannersData])



    // Get templates from response - handle different response structures

    const templates = useMemo(() => {

        const raw = Array.isArray(templatesData?.templates)

            ? templatesData.templates

            : Array.isArray(templatesData?.data)

                ? templatesData.data

                : Array.isArray(templatesData)

                    ? templatesData

                    : []



        // Normalize both plain templates and hall-template assignments with nested template object

        return raw.map((item) => {

            const base = item.template || item

            return {

                ...item,

                _id: base._id || item._id || item.id,

                id: base._id || base.id || item._id || item.id,

                templateName: base.templateName || base.name,

                description: base.description || item.description,

                imageUrl: base.imageUrl || item.imageUrl,

            }

        })

    }, [templatesData])



    // Get services from response - handle different response structures

    const servicesList = useMemo(() => {

        const rawServices = Array.isArray(servicesData?.services)

            ? servicesData.services

            : Array.isArray(servicesData?.data)

                ? servicesData.data

                : Array.isArray(servicesData)

                    ? servicesData

                    : []



        return rawServices.map(service => {

            return {

                _id: service._id || service.id,

                id: service._id || service.id,

                name: service.name || 'خدمة',

                category: service.category || '',

                basePrice: service.price || service.basePrice || 0,

                unit: service.unit || 'per_event',

            }

        }).filter(service => service._id)

    }, [servicesData])



    const {

        control,

        handleSubmit,

        formState: { errors },

        reset,

        watch,

        setValue

    } = useForm({

        resolver: zodResolver(createEventSchema(editingEvent)),

        defaultValues: {

            eventName: editingEvent?.eventName || editingEvent?.name || '',

            eventType: editingEvent?.eventType || 'wedding',

            eventDate: editingEvent?.eventDate || editingEvent?.date || '',

            startTime: editingEvent?.startTime || '',

            endTime: editingEvent?.endTime || '',

            guestCount: editingEvent?.guestCount || '',

            services: editingEvent?.services?.map(s => ({

                service: s.service?._id || s.service || '',

                quantity: s.quantity || 1,

                price: s.price || 0

            })) || [],

            specialRequests: editingEvent?.specialRequests || '',

            templateId: editingEvent?.template?._id || editingEvent?.templateId?._id || editingEvent?.templateId || null,

            scanners: eventScanners.length > 0

                ? eventScanners.map(s => ({

                    scannerId: (s.scanner?._id || s.scanner?.id || s.scannerId?._id || s.scannerId || s._id || '').toString()

                })).filter(s => s.scannerId)

                : (editingEvent?.scanners?.map(s => ({

                    scannerId: (s.scannerId?._id || s.scannerId || s.scanner?._id || s.scanner?.id || s._id || '').toString()

                })).filter(s => s.scannerId) || [{ scannerId: '' }]),

            clientSelection: editingEvent ? 'edit' : 'new',

            clientId: editingEvent?.clientId?._id || editingEvent?.clientId || editingEvent?.client?._id || '',

            clientName: editingEvent?.clientId?.name || editingEvent?.client?.name || '',

            clientusername: editingEvent?.clientId?.username || editingEvent?.client?.username || '',

            phone: editingEvent?.clientId?.phone || editingEvent?.client?.phone || '',

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



    // Sync clientSelection state with form value

    useEffect(() => {

        if (watchedClientSelection) {

            setClientSelection(watchedClientSelection)

        }

    }, [watchedClientSelection])



    // Memoize editing event ID for stable reference

    const editingEventId = useMemo(() => editingEvent?._id || editingEvent?.id, [editingEvent?._id, editingEvent?.id])



    useEffect(() => {

        if (!open) {

            return

        }



        if (editingEvent) {

            reset({

                eventName: editingEvent.eventName || editingEvent.name || '',

                eventType: editingEvent.eventType || 'wedding',

                eventDate: editingEvent.eventDate || editingEvent.date || '',

                startTime: editingEvent.startTime || '',

                endTime: editingEvent.endTime || '',

                guestCount: editingEvent.guestCount || '',

                requiredEmployees: editingEvent.requiredEmployees || 1,

                services: editingEvent.services?.map(s => ({

                    service: s.service?._id || s.service || '',

                    quantity: s.quantity || 1,

                    price: s.price || 0

                })) || [],

                specialRequests: editingEvent.specialRequests || '',

                templateId: editingEvent.template?._id || editingEvent.templateId?._id || editingEvent.templateId || null,

                scanners: eventScanners.length > 0

                    ? eventScanners.map(s => ({

                        scannerId: (s.scanner?._id || s.scanner?.id || s.scannerId?._id || s.scannerId || s._id || '').toString()

                    })).filter(s => s.scannerId)

                    : (editingEvent.scanners?.map(s => ({

                        scannerId: (s.scannerId?._id || s.scannerId || s.scanner?._id || s.scanner?.id || s._id || '').toString()

                    })).filter(s => s.scannerId) || []),

                clientSelection: 'edit',

                clientId: editingEvent.clientId?._id || editingEvent.clientId || editingEvent.client?._id || '',

                clientName: editingEvent.clientId?.name || editingEvent.client?.name || '',

                clientusername: editingEvent.clientId?.username || editingEvent.client?.username || '',

                phone: editingEvent.clientId?.phone || editingEvent.client?.phone || '',

                password: ''

            })

        } else {

            reset({

                eventName: '',

                eventType: 'wedding',

                eventDate: '',

                startTime: '',

                endTime: '',

                guestCount: '',

                requiredEmployees: 1,

                services: [],

                specialRequests: '',

                templateId: null,

                scanners: [{ scannerId: '' }],

                clientSelection: 'new',

                clientId: '',

                clientName: '',

                clientusername: '',

                phone: '',

                password: ''

            })

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [open, editingEventId, eventScanners, reset])



    const handleFormSubmit = (data) => {

        // Prepare the data according to API requirements

        const submitData = {

            eventName: data.eventName,

            eventType: data.eventType,

            eventDate: data.eventDate,

            startTime: data.startTime,

            endTime: data.endTime,

            guestCount: data.guestCount,

            requiredEmployees: data.requiredEmployees,

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

        const clientSelection = data.clientSelection || 'new'

        // Include clientSelection in submitData
        submitData.clientSelection = clientSelection



        if (clientSelection === 'existing') {

            if (!data.clientId || !data.clientId.trim()) {

                showNotification({

                    title: 'خطأ',

                    message: 'يرجى اختيار عميل موجود',

                    type: 'error'

                })

                return

            }

            submitData.clientId = data.clientId.trim()

        } else if (clientSelection === 'edit') {

            // Edit existing client - send client fields with clientId

            const clientName = (data.clientName || '').trim()

            const clientusername = (data.clientusername || '').trim()

            const phone = (data.phone || '').trim()

            const password = (data.password || '').trim()


            if (!clientName || !clientusername || !phone) {

                showNotification({

                    title: 'خطأ',

                    message: 'يرجى إدخال اسم العميل واسم المستخدم ورقم الهاتف',

                    type: 'error'

                })

                return

            }

            submitData.clientId = data.clientId || (editingEvent?.clientId?._id || editingEvent?.clientId || editingEvent?.client?._id || '')
            submitData.clientName = clientName
            submitData.clientusername = clientusername
            submitData.phone = phone
            if (password) {
                submitData.password = password
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



            // API expects 'clientName' and 'clientusername' for new client
            // But we add 'name' and 'username' as well for broad compatibility
            submitData.clientName = clientName
            submitData.clientusername = clientusername || clientName
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



                {/* Hall Info Display */}

                {hallData?.data?.hall && (

                    <MuiGrid item xs={12}>

                        <MuiPaper

                            elevation={0}

                            sx={{

                                p: 2,

                                borderRadius: '12px',

                                background: 'linear-gradient(135deg, rgba(216, 185, 138, 0.1), rgba(216, 185, 138, 0.05))',

                                border: '1px solid rgba(216, 185, 138, 0.2)'

                            }}

                        >

                            <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>

                                <Building2 size={20} color="var(--color-primary-500)" />

                                <MuiTypography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>

                                    {hallData.data.hall.name}

                                </MuiTypography>

                            </MuiBox>

                            <MuiGrid container spacing={2}>

                                <MuiGrid item xs={6} sm={3}>

                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>

                                        الطاولات

                                    </MuiTypography>

                                    <MuiTypography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>

                                        {hallData.data.hall.tables || 0}

                                    </MuiTypography>

                                </MuiGrid>

                                <MuiGrid item xs={6} sm={3}>

                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>

                                        الكراسي

                                    </MuiTypography>

                                    <MuiTypography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>

                                        {hallData.data.hall.chairs || 0}

                                    </MuiTypography>

                                </MuiGrid>

                                <MuiGrid item xs={6} sm={3}>

                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>

                                        السعة

                                    </MuiTypography>

                                    <MuiTypography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>

                                        {hallData.data.hall.capacity || 0}

                                    </MuiTypography>

                                </MuiGrid>

                                <MuiGrid item xs={6} sm={3}>

                                    <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>

                                        الموظفين الأقصى

                                    </MuiTypography>

                                    <MuiTypography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>

                                        {hallData.data.hall.maxEmployees || 0}

                                    </MuiTypography>

                                </MuiGrid>

                            </MuiGrid>

                            {hallData.data.hall.description && (

                                <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mt: 1, display: 'block' }}>

                                    {hallData.data.hall.description}

                                </MuiTypography>

                            )}

                        </MuiPaper>

                    </MuiGrid>

                )}



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
                                placeholder="أدخل عدد الضيوف"
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
                                required
                                error={!!errors.requiredEmployees}
                                helperText={errors.requiredEmployees?.message}
                            />
                        )}
                    />
                </MuiGrid>




                {/* Scanners Selection (Mandatory) */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 1, color: 'var(--color-primary-500)' }}>
                        الماسحات المضافة (إلزامي)
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
                                            label="اختر الماسح"
                                            disabled={scannersLoading}
                                            error={!!error}
                                            fullWidth
                                        >
                                            {scannersLoading ? (
                                                <MuiMenuItem value="" disabled>جاري التحميل...</MuiMenuItem>
                                            ) : scanners.length === 0 ? (
                                                <MuiMenuItem value="" disabled>لا توجد ماسحات متاحة</MuiMenuItem>
                                            ) : (
                                                scanners
                                                    .filter(scanner => {
                                                        const scannerId = scanner._id || scanner.id
                                                        const currentValues = watch('scanners') || []
                                                        const otherSelectedIds = currentValues
                                                            .map((s, idx) => idx !== index ? s.scannerId : null)
                                                            .filter(Boolean)
                                                        return !otherSelectedIds.includes(scannerId)
                                                    })
                                                    .map(scanner => (
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
                        disabled={scanners.length === 0 || scannerFields.length >= scanners.length}
                        sx={{ borderRadius: '12px', borderColor: 'var(--color-border-glass)', color: 'var(--color-primary-500)', borderStyle: 'dashed' }}
                    >
                        إضافة ماسح ضوئي آخر
                    </MuiButton>
                    {errors.scanners && (
                        <MuiFormHelperText error sx={{ mt: 1 }}>{errors.scanners.message}</MuiFormHelperText>
                    )}
                </MuiGrid>



                {/* Client Selection */}

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

                                label={editingEvent ? 'تغيير العميل' : 'اختر نوع العميل'}

                                fullWidth

                                onChange={(e) => {

                                    field.onChange(e)

                                    setClientSelection(e.target.value)

                                }}

                            >

                                {editingEvent && (

                                    <MuiMenuItem value="edit">تعديل بيانات العميل</MuiMenuItem>

                                )}

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

                                        label={clientSelection === 'edit' ? "كلمة المرور (اتركها فارغة لعدم التغيير)" : "كلمة المرور"}

                                        type="password"

                                        fullWidth

                                        required={clientSelection !== 'edit'}

                                        error={!!errors.password}

                                        helperText={errors.password?.message}

                                    />

                                )}

                            />

                        </MuiGrid>

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

                                                servicesList

                                                    .filter(service => {

                                                        // Filter out services that are already selected in other service fields

                                                        const currentServiceId = watch(`services.${index}.service`)

                                                        const selectedServiceIds = fields

                                                            .map((_, idx) => watch(`services.${idx}.service`))

                                                            .filter(id => id && id !== currentServiceId) // Exclude current field

                                                        return !selectedServiceIds.includes(service._id || service.id)

                                                    })

                                                    .map(service => (

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

                                render={({ field }) => {

                                    const serviceId = watch(`services.${index}.service`)

                                    const selectedService = servicesList.find(s => (s._id || s.id) === serviceId)

                                    

                                    return (

                                        <MuiTextField

                                            {...field}

                                            label="الكمية"

                                            type="number"

                                            fullWidth

                                            required

                                            min={1}

                                            error={!!errors.services?.[index]?.quantity}

                                            helperText={errors.services?.[index]?.quantity?.message}

                                        />

                                    )

                                }}

                            />

                        </MuiGrid>

                        <MuiGrid item xs={12} sm={3}>

                            <Controller

                                name={`services.${index}.price`}

                                control={control}

                                render={({ field }) => {

                                    const serviceId = watch(`services.${index}.service`)

                                    const quantity = watch(`services.${index}.quantity`) || 1

                                    const selectedService = servicesList.find(s => (s._id || s.id) === serviceId)

                                    const basePrice = selectedService?.basePrice || 0

                                    const unit = selectedService?.unit || 'per_event'

                                    

                                    // Calculate total price based on unit

                                    let calculatedPrice = basePrice

                                    if (unit === 'per_person' && quantity > 0) {

                                        calculatedPrice = basePrice * quantity

                                    } else if (unit === 'per_event') {

                                        calculatedPrice = basePrice

                                    }

                                    

                                    // Update price field when quantity or service changes

                                    useEffect(() => {

                                        if (selectedService && quantity > 0) {

                                            setValue(`services.${index}.price`, calculatedPrice)

                                        }

                                    }, [quantity, serviceId, calculatedPrice, selectedService, index, setValue])

                                    

                                    return (

                                        <MuiTextField

                                            {...field}

                                            label="السعر (الإفرادي)"

                                            type="number"

                                            fullWidth

                                            required

                                            value={calculatedPrice || field.value || 0}

                                            InputProps={{

                                                readOnly: true,

                                            }}

                                            sx={{

                                                '& .MuiInputBase-input': {

                                                    backgroundColor: 'var(--color-surface)',

                                                    cursor: 'not-allowed',

                                                }

                                            }}

                                            error={!!errors.services?.[index]?.price}

                                            helperText={errors.services?.[index]?.price?.message || `السعر الأساسي: ${basePrice.toLocaleString()} ل.س ${unit === 'per_person' ? '× ' + quantity : ''}`}

                                        />

                                    )

                                }}

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

                        disabled={servicesList.length === 0 || fields.length >= servicesList.length}

                        sx={{ borderRadius: '12px', borderColor: 'var(--color-border-glass)', color: 'var(--color-text-secondary)' }}

                    >

                        إضافة خدمة

                    </MuiButton>

                </MuiGrid>



                {/* Optional Configuration Section */}
                <MuiGrid item xs={12}>
                    <MuiBox sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MuiBox sx={{ flex: 1, height: '1px', bgcolor: 'rgba(216, 185, 138, 0.2)' }} />
                        <MuiTypography variant="caption" sx={{ color: 'var(--color-primary-500)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                            إعدادات إضافية (اختياري)
                        </MuiTypography>
                        <MuiBox sx={{ flex: 1, height: '1px', bgcolor: 'rgba(216, 185, 138, 0.2)' }} />
                    </MuiBox>
                </MuiGrid>

                {/* Template Selection */}
                <MuiGrid item xs={12}>
                    <Controller
                        name="templateId"
                        control={control}
                        render={({ field, fieldState: { error } }) => {
                            const templateValue = field.value ? (typeof field.value === 'string' ? field.value : (field.value._id || field.value.id || String(field.value))) : '';
                            const selectedTemplate = templates.find(t => String(t._id || t.id) === templateValue);

                            return (
                                <MuiBox>
                                    <MuiSelect
                                        label="اختر قالب (اختياري)"
                                        value={templateValue}
                                        disabled={templatesLoading}
                                        error={!!error}
                                        fullWidth
                                        displayEmpty
                                        onChange={(e) => field.onChange(e.target.value === '' ? null : e.target.value)}
                                        renderValue={(value) => {
                                            if (!value) return <em>بدون قالب</em>;
                                            const tpl = templates.find(t => String(t._id || t.id) === value);
                                            return tpl ? tpl.templateName || tpl.name : value;
                                        }}
                                    >
                                        <MuiMenuItem value=""><em>بدون قالب</em></MuiMenuItem>
                                        {templates.map((tpl) => (
                                            <MuiMenuItem key={tpl._id || tpl.id} value={String(tpl._id || tpl.id)}>
                                                {tpl.templateName || tpl.name}
                                            </MuiMenuItem>
                                        ))}
                                    </MuiSelect>

                                    {/* Template Preview Card */}

                                    {selectedTemplate && (

                                        <MuiBox sx={{ mt: 2, p: 2, border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-surface)' }}>

                                            <MuiTypography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>

                                                {selectedTemplate.templateName || selectedTemplate.name}

                                            </MuiTypography>

                                            {selectedTemplate.imageUrl && (

                                                <img

                                                    src={selectedTemplate.imageUrl}

                                                    alt={selectedTemplate.templateName || selectedTemplate.name}

                                                    style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}

                                                />

                                            )}

                                        </MuiBox>

                                    )}

                                </MuiBox>

                            );

                        }}

                    />

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

