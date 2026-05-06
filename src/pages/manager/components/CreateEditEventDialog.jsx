// src\pages\manager\components\CreateEditEventDialog.jsx
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
import MuiDivider from '@/components/ui/MuiDivider'
import MuiRadioGroup from '@mui/material/RadioGroup'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import MuiRadio from '@mui/material/Radio'
import { FormDialog } from '@/components/common'
import { useNotification } from '@/hooks'
import { getClients, getManagerHall, getHallServices, listManagerTemplates, getStaff, getEventScanners } from '@/api/manager'
import { QUERY_KEYS, API_CONFIG } from '@/config/constants'
import { Plus, Trash2, Building2, User, FileText } from 'lucide-react'

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
            if (!data.clientName || !data.clientName.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'اسم العميل مطلوب', path: ['clientName'] })
            }
            if (!data.clientusername || !data.clientusername.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'اسم المستخدم مطلوب', path: ['clientusername'] })
            }
            if (!data.phone || !data.phone.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'رقم الهاتف مطلوب', path: ['phone'] })
            }
            if (!data.password || !data.password.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'كلمة المرور مطلوبة', path: ['password'] })
            } else {
                const password = data.password.trim()
                if (password.length < 6) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
                }
            }
        } else if (data.clientSelection === 'edit') {
            if (!data.clientName || !data.clientName.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'اسم العميل مطلوب', path: ['clientName'] })
            }
            if (!data.phone || !data.phone.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'رقم الهاتف مطلوب', path: ['phone'] })
            }
        }
    })
}

export default function CreateEditEventDialog({ open, onClose, onSubmit, editingEvent, loading }) {
    const { addNotification: showNotification } = useNotification()

    const { data: clientsData } = useQuery({
        queryKey: QUERY_KEYS.MANAGER_CLIENTS,
        queryFn: getClients,
        enabled: open,
    })

    const { data: servicesData } = useQuery({
        queryKey: ['manager', 'hall-services'],
        queryFn: getHallServices,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })

    const { data: templatesData } = useQuery({
        queryKey: ['manager', 'templates'],
        queryFn: listManagerTemplates,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })

    const { data: staffData } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_STAFF],
        queryFn: getStaff,
        enabled: open,
        staleTime: 5 * 60 * 1000
    })

    const clients = clientsData?.clients || clientsData?.data || []
    const staff = staffData?.staff || staffData?.data || []
    const scanners = Array.isArray(staff) ? staff.filter(s => String(s.role || '').toLowerCase() === 'scanner') : []
    const templates = templatesData?.templates || templatesData?.data || []

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
            clientSelection: editingEvent ? 'edit' : 'new',
            clientId: '',
            clientName: '',
            clientusername: '',
            phone: '',
            password: ''
        }
    })

    const clientSelection = watch('clientSelection')

    const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({ control, name: 'services' })
    const { fields: scannerFields, append: appendScanner, remove: removeScanner } = useFieldArray({ control, name: 'scanners' })

    useEffect(() => {
        if (open) {
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
                    templateId: editingEvent.template?._id || editingEvent.templateId || null,
                    scanners: editingEvent.scanners?.map(s => ({ scannerId: s.scannerId?._id || s.scannerId || '' })) || [{ scannerId: '' }],
                    clientSelection: 'edit',
                    clientId: editingEvent.client?._id || '',
                    clientName: editingEvent.client?.name || '',
                    clientusername: editingEvent.client?.username || '',
                    phone: editingEvent.client?.phone || '',
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
        }
    }, [open, editingEvent, reset])

    const onFormSubmit = (data) => {
        onSubmit(data)
    }

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={editingEvent ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
            onSubmit={handleSubmit(onFormSubmit, (err) => console.log('Validation Errors:', err))}
            loading={loading}
            submitText={editingEvent ? 'حفظ التغييرات' : 'إضافة الفعالية'}
            maxWidth="md"
        >
            <MuiGrid container spacing={3}>
                {/* Event Basic Info */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Building2 size={20} /> معلومات الفعالية
                    </MuiTypography>
                </MuiGrid>
                
                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="eventName"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="اسم الفعالية" fullWidth error={!!errors.eventName} helperText={errors.eventName?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="eventType"
                        control={control}
                        render={({ field }) => (
                            <MuiFormControl fullWidth>
                                {/* <MuiInputLabel>نوع الفعالية</MuiInputLabel> */}
                                <MuiSelect {...field} label="نوع الفعالية">
                                    <MuiMenuItem value="wedding">زفاف</MuiMenuItem>
                                    <MuiMenuItem value="birthday">عيد ميلاد</MuiMenuItem>
                                    <MuiMenuItem value="engagement">خطوبة</MuiMenuItem>
                                    <MuiMenuItem value="graduation">تخرج</MuiMenuItem>
                                    <MuiMenuItem value="corporate">فعالية شركات</MuiMenuItem>
                                    <MuiMenuItem value="other">أخرى</MuiMenuItem>
                                </MuiSelect>
                            </MuiFormControl>
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="eventDate"
                        control={control}
                        render={({ field }) => (
                            <MuiDatePicker {...field} label="تاريخ الفعالية" fullWidth error={!!errors.eventDate} helperText={errors.eventDate?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                            <MuiTimePicker {...field} label="وقت البداية" fullWidth error={!!errors.startTime} helperText={errors.startTime?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={4}>
                    <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                            <MuiTimePicker {...field} label="وقت النهاية" fullWidth error={!!errors.endTime} helperText={errors.endTime?.message} />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="guestCount"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="عدد الضيوف المتوقع" type="number" fullWidth error={!!errors.guestCount} helperText={errors.guestCount?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="requiredEmployees"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="عدد الموظفين المطلوب" type="number" fullWidth error={!!errors.requiredEmployees} helperText={errors.requiredEmployees?.message} />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}><MuiDivider /></MuiGrid>

                {/* Client Section */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={20} /> معلومات العميل
                    </MuiTypography>
                    {!editingEvent && (
                        <Controller
                            name="clientSelection"
                            control={control}
                            render={({ field }) => (
                                <MuiRadioGroup {...field} row sx={{ mb: 2 }}>
                                    <MuiFormControlLabel value="new" control={<MuiRadio />} label="عميل جديد" />
                                    <MuiFormControlLabel value="existing" control={<MuiRadio />} label="عميل مسجل مسبقاً" />
                                </MuiRadioGroup>
                            )}
                        />
                    )}
                </MuiGrid>

                {clientSelection === 'existing' && !editingEvent && (
                    <MuiGrid item xs={12}>
                        <Controller
                            name="clientId"
                            control={control}
                            render={({ field }) => (
                                <MuiFormControl fullWidth error={!!errors.clientId}>
                                    <MuiInputLabel>اختر العميل</MuiInputLabel>
                                    <MuiSelect {...field} label="اختر العميل">
                                        {clients.map(c => (
                                            <MuiMenuItem key={c._id} value={c._id}>{c.name} - {c.phone}</MuiMenuItem>
                                        ))}
                                    </MuiSelect>
                                    <MuiFormHelperText>{errors.clientId?.message}</MuiFormHelperText>
                                </MuiFormControl>
                            )}
                        />
                    </MuiGrid>
                )}

                {(clientSelection === 'new' || clientSelection === 'edit') && (
                    <>
                        <MuiGrid item xs={12} sm={6}>
                            <Controller
                                name="clientName"
                                control={control}
                                render={({ field }) => (
                                    <MuiTextField {...field} label="اسم العميل" fullWidth error={!!errors.clientName} helperText={errors.clientName?.message} />
                                )}
                            />
                        </MuiGrid>
                        <MuiGrid item xs={12} sm={6}>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <MuiTextField {...field} label="رقم الهاتف" fullWidth error={!!errors.phone} helperText={errors.phone?.message} />
                                )}
                            />
                        </MuiGrid>
                        {clientSelection === 'new' && (
                            <>
                                <MuiGrid item xs={12} sm={6}>
                                    <Controller
                                        name="clientusername"
                                        control={control}
                                        render={({ field }) => (
                                            <MuiTextField {...field} label="اسم المستخدم" fullWidth error={!!errors.clientusername} helperText={errors.clientusername?.message} />
                                        )}
                                    />
                                </MuiGrid>
                                <MuiGrid item xs={12} sm={6}>
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <MuiTextField {...field} type="password" label="كلمة المرور" fullWidth error={!!errors.password} helperText={errors.password?.message} />
                                        )}
                                    />
                                </MuiGrid>
                            </>
                        )}
                    </>
                )}

                <MuiGrid item xs={12}><MuiDivider /></MuiGrid>

                {/* Templates & Requests */}
                <MuiGrid item xs={12} sm={6}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileText size={20} /> القالب والطلبات
                    </MuiTypography>
                    <Controller
                        name="templateId"
                        control={control}
                        render={({ field }) => (
                            <MuiFormControl fullWidth sx={{ mb: 2 }}>
                                {/* <MuiInputLabel>قالب الدعوات</MuiInputLabel> */}
                                <MuiSelect {...field} label="قالب الدعوات" value={field.value || ''}>
                                    <MuiMenuItem value=""><em>بدون قالب</em></MuiMenuItem>
                                    {templates.map(t => (
                                        <MuiMenuItem key={t._id} value={t._id}>{t.name}</MuiMenuItem>
                                    ))}
                                </MuiSelect>
                            </MuiFormControl>
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="specialRequests"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="طلبات خاصة" multiline rows={3} fullWidth />
                        )}
                    />
                </MuiGrid>

                <MuiGrid item xs={12}><MuiDivider /></MuiGrid>

                {/* Services Section */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>الخدمات الإضافية</MuiTypography>
                    {serviceFields.map((field, index) => (
                        <MuiBox key={field.id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                            <MuiFormControl fullWidth>
                                {/* <MuiInputLabel>الخدمة</MuiInputLabel> */}
                                <Controller
                                    name={`services.${index}.service`}
                                    control={control}
                                    render={({ field }) => (
                                        <MuiSelect {...field} label="الخدمة">
                                            {servicesData?.data?.map(s => (
                                                <MuiMenuItem key={s._id} value={s._id}>{s.name}</MuiMenuItem>
                                            ))}
                                        </MuiSelect>
                                    )}
                                />
                            </MuiFormControl>
                            <Controller
                                name={`services.${index}.quantity`}
                                control={control}
                                render={({ field }) => (
                                    <MuiTextField {...field} label="الكمية" type="number" sx={{ width: 100 }} />
                                )}
                            />
                            <MuiIconButton onClick={() => removeService(index)} color="error">
                                <Trash2 size={20} />
                            </MuiIconButton>
                        </MuiBox>
                    ))}
                    <MuiButton startIcon={<Plus size={18} />} onClick={() => appendService({ service: '', quantity: 1, price: 0 })}>
                        إضافة خدمة
                    </MuiButton>
                </MuiGrid>

                {/* Scanners Section */}
                <MuiGrid item xs={12}>
                    <MuiTypography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>موظف الاستقبال</MuiTypography>
                    {scannerFields.map((field, index) => (
                        <MuiBox key={field.id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                            <MuiFormControl fullWidth>
                                {/* <MuiInputLabel>الماسح</MuiInputLabel> */}
                                <Controller
                                    name={`scanners.${index}.scannerId`}
                                    control={control}
                                    render={({ field }) => (
                                        <MuiSelect {...field} label="المستقبل">
                                            {scanners.map(s => (
                                                <MuiMenuItem key={s._id} value={s._id}>{s.name}</MuiMenuItem>
                                            ))}
                                        </MuiSelect>
                                    )}
                                />
                                <MuiFormHelperText>{errors.scanners?.[index]?.scannerId?.message}</MuiFormHelperText>
                            </MuiFormControl>
                            <MuiIconButton onClick={() => removeScanner(index)} color="error" disabled={scannerFields.length === 1}>
                                <Trash2 size={20} />
                            </MuiIconButton>
                        </MuiBox>
                    ))}
                    <MuiButton startIcon={<Plus size={18} />} onClick={() => appendScanner({ scannerId: '' })}>
                        إضافة موظف
                    </MuiButton>
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}
