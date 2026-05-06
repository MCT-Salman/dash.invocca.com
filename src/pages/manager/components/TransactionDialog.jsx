// src\pages\manager\components\TransactionDialog.jsx
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getManagerEvents, getClients } from '@/api/manager'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiInputLabel from '@/components/ui/MuiInputLabel'
import MuiSelect from '@/components/ui/MuiSelect'
import { FormDialog } from '@/components/common'

export default function TransactionDialog({ open, onClose, onSubmit, loading, transaction }) {
    const { data: eventsData } = useQuery({
        queryKey: ['manager-events-minimal'],
        queryFn: () => getManagerEvents({ limit: 100 }),
        enabled: open
    })

    const { data: clientsData } = useQuery({
        queryKey: ['manager-clients-minimal'],
        queryFn: () => getClients({ limit: 100 }),
        enabled: open
    })

    const events = eventsData?.data || eventsData?.events || []
    const clients = clientsData?.data || clientsData?.clients || []

    const [formData, setFormData] = useState({
        eventId: '',
        clientId: '',
        type: 'payment',
        category: 'event_payment',
        amount: '',
        paymentMethod: 'cash',
        reference: '',
        description: '',
        notes: '',
    })

    useEffect(() => {
        if (open) {
            if (transaction) {
                setFormData({
                    eventId: transaction.eventId?._id || transaction.eventId || '',
                    clientId: transaction.clientId?._id || transaction.clientId || '',
                    type: transaction.type || 'payment',
                    category: transaction.category || 'event_payment',
                    amount: transaction.amount || '',
                    paymentMethod: transaction.paymentMethod || 'cash',
                    reference: transaction.reference || '',
                    description: transaction.description || '',
                    notes: transaction.notes || '',
                })
            } else {
                setFormData({
                    eventId: '',
                    clientId: '',
                    type: 'payment',
                    category: 'event_payment',
                    amount: '',
                    paymentMethod: 'cash',
                    reference: '',
                    description: '',
                    notes: '',
                })
            }
        }
    }, [open, transaction])

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={transaction ? 'تعديل معاملة' : 'إضافة معاملة جديدة'}
            onSubmit={() => onSubmit(formData)}
            loading={loading}
            submitText={transaction ? 'تعديل' : 'إضافة'}
            maxWidth="sm"
        >
            <MuiGrid container spacing={2}>
                <MuiGrid item xs={12} sm={6}>
                    <MuiFormControl fullWidth>
                        <MuiInputLabel>الفعالية (اختياري)</MuiInputLabel>
                        <MuiSelect value={formData.eventId} onChange={handleChange('eventId')} label="الفعالية (اختياري)">
                            <MuiMenuItem value="">بدون فعالية</MuiMenuItem>
                            {events.map(event => (
                                <MuiMenuItem key={event._id} value={event._id}>{event.name}</MuiMenuItem>
                            ))}
                        </MuiSelect>
                    </MuiFormControl>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <MuiFormControl fullWidth>
                        <MuiInputLabel>العميل (اختياري)</MuiInputLabel>
                        <MuiSelect value={formData.clientId} onChange={handleChange('clientId')} label="العميل (اختياري)">
                            <MuiMenuItem value="">بدون عميل</MuiMenuItem>
                            {clients.map(client => (
                                <MuiMenuItem key={client._id} value={client._id}>{client.name}</MuiMenuItem>
                            ))}
                        </MuiSelect>
                    </MuiFormControl>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <MuiFormControl fullWidth>
                        <MuiInputLabel>النوع</MuiInputLabel>
                        <MuiSelect value={formData.type} onChange={handleChange('type')} label="النوع">
                            <MuiMenuItem value="payment">دفعة مقبوضة</MuiMenuItem>
                            <MuiMenuItem value="expense">مصروف</MuiMenuItem>
                            <MuiMenuItem value="refund">استرداد</MuiMenuItem>
                        </MuiSelect>
                    </MuiFormControl>
                </MuiGrid>

                <MuiGrid item xs={12} sm={6}>
                    <MuiFormControl fullWidth>
                        <MuiInputLabel>الفئة</MuiInputLabel>
                        <MuiSelect value={formData.category} onChange={handleChange('category')} label="الفئة">
                            <MuiMenuItem value="event_payment">دفعة فعالية</MuiMenuItem>
                            <MuiMenuItem value="staff_salary">رواتب موظفين</MuiMenuItem>
                            <MuiMenuItem value="maintenance">صيانة</MuiMenuItem>
                            <MuiMenuItem value="utilities">مرافق</MuiMenuItem>
                            <MuiMenuItem value="supplies">مستلزمات</MuiMenuItem>
                            <MuiMenuItem value="other">أخرى</MuiMenuItem>
                        </MuiSelect>
                    </MuiFormControl>
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <MuiTextField label="المبلغ" type="number" value={formData.amount} onChange={handleChange('amount')} fullWidth required />
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <MuiFormControl fullWidth>
                        <MuiInputLabel>طريقة الدفع</MuiInputLabel>
                        <MuiSelect value={formData.paymentMethod} onChange={handleChange('paymentMethod')} label="طريقة الدفع">
                            <MuiMenuItem value="cash">نقدي</MuiMenuItem>
                            <MuiMenuItem value="bank_transfer">تحويل بنكي</MuiMenuItem>
                            <MuiMenuItem value="credit_card">بطاقة ائتمان</MuiMenuItem>
                        </MuiSelect>
                    </MuiFormControl>
                </MuiGrid>

                <MuiGrid item xs={12}>
                    <MuiTextField label="الوصف" value={formData.description} onChange={handleChange('description')} fullWidth />
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}
