// src\pages\manager\components\CreateEditInvoiceDialog.jsx
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import { FormDialog } from '@/components/common'
import { useQuery } from '@tanstack/react-query'
import { getClients } from '@/api/manager'

const invoiceSchema = z.object({
    clientId: z.string().min(1, 'يجب اختيار العميل'),
    totalAmount: z.coerce.number().min(1, 'المبلغ يجب أن يكون أكبر من 0'),
    status: z.enum(['paid', 'unpaid', 'partial']).default('unpaid'),
    dueDate: z.string().optional(),
    notes: z.string().optional(),
})

export default function CreateEditInvoiceDialog({ open, onClose, onSubmit, editingInvoice, loading }) {
    const { data: clientsData } = useQuery({
        queryKey: ['manager-clients-minimal'],
        queryFn: () => getClients({ limit: 100 }),
        enabled: open
    })

    const clients = clientsData?.data || clientsData?.clients || []

    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            clientId: '',
            totalAmount: 0,
            status: 'unpaid',
            dueDate: '',
            notes: '',
        }
    })

    useEffect(() => {
        if (open) {
            if (editingInvoice) {
                reset({
                    clientId: editingInvoice.clientId?._id || editingInvoice.clientId || '',
                    totalAmount: editingInvoice.totalAmount || 0,
                    status: editingInvoice.status || 'unpaid',
                    dueDate: editingInvoice.dueDate ? editingInvoice.dueDate.split('T')[0] : '',
                    notes: editingInvoice.notes || '',
                })
            } else {
                reset({ clientId: '', totalAmount: 0, status: 'unpaid', dueDate: '', notes: '' })
            }
        }
    }, [open, editingInvoice, reset])

    return (
        <FormDialog
            open={open}
            onClose={onClose}
            title={editingInvoice ? 'تعديل فاتورة' : 'إضافة فاتورة جديدة'}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
            submitText={editingInvoice ? 'تعديل' : 'إضافة'}
            maxWidth="sm"
        >
            <MuiGrid container spacing={2}>
                <MuiGrid item xs={12}>
                    <Controller
                        name="clientId"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField
                                {...field}
                                select
                                label="العميل"
                                fullWidth
                                required
                                error={!!errors.clientId}
                                helperText={errors.clientId?.message}
                            >
                                <MuiMenuItem value="">اختر العميل</MuiMenuItem>
                                {clients.map(client => (
                                    <MuiMenuItem key={client._id} value={client._id}>{client.name}</MuiMenuItem>
                                ))}
                            </MuiTextField>
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="totalAmount"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="المبلغ الإجمالي" type="number" fullWidth required error={!!errors.totalAmount} helperText={errors.totalAmount?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12} sm={6}>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} select label="الحالة" fullWidth error={!!errors.status} helperText={errors.status?.message}>
                                <MuiMenuItem value="paid">مدفوعة</MuiMenuItem>
                                <MuiMenuItem value="unpaid">غير مدفوعة</MuiMenuItem>
                                <MuiMenuItem value="partial">مدفوعة جزئياً</MuiMenuItem>
                            </MuiTextField>
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12}>
                    <Controller
                        name="dueDate"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="تاريخ الاستحقاق" type="date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.dueDate} helperText={errors.dueDate?.message} />
                        )}
                    />
                </MuiGrid>
                <MuiGrid item xs={12}>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <MuiTextField {...field} label="ملاحظات" fullWidth multiline rows={2} error={!!errors.notes} helperText={errors.notes?.message} />
                        )}
                    />
                </MuiGrid>
            </MuiGrid>
        </FormDialog>
    )
}
