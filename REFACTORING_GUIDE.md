# دليل إعادة هيكلة الكود - Code Refactoring Guide

## نظرة عامة

تم إعادة هيكلة الكود لجعله أكثر قابلية لإعادة الاستخدام ومركزية. تم إنشاء مكونات مشتركة و Hooks قابلة لإعادة الاستخدام لتقليل التكرار وتحسين الصيانة.

## البنية الجديدة

### 1. المكونات المشتركة (`src/components/shared/`)

#### BaseViewDialog
مكون أساسي لعرض البيانات في Dialog. يمكن استخدامه بدلاً من ViewClientDialog، ViewStaffDialog، إلخ.

**قبل:**
```jsx
// في كل صفحة، مكون ViewDialog منفصل
<ViewClientDialog open={open} onClose={handleClose} client={client} />
```

**بعد:**
```jsx
import { BaseViewDialog } from '@/components/shared'

<BaseViewDialog
    open={open}
    onClose={handleClose}
    title="تفاصيل العميل"
    maxWidth="md"
>
    {/* محتوى مخصص */}
</BaseViewDialog>
```

#### BaseFormDialog
مكون أساسي للنماذج. يحل محل FormDialog الحالي ويوفر المزيد من المرونة.

**قبل:**
```jsx
<FormDialog
    open={open}
    onClose={handleClose}
    title="إضافة عميل"
    onSubmit={handleSubmit}
>
    {/* محتوى النموذج */}
</FormDialog>
```

**بعد:**
```jsx
import { BaseFormDialog } from '@/components/shared'

<BaseFormDialog
    open={open}
    onClose={handleClose}
    title="إضافة عميل"
    subtitle="أدخل بيانات العميل"
    onSubmit={handleSubmit}
    loading={isLoading}
    submitText="حفظ"
    cancelText="إلغاء"
>
    {/* محتوى النموذج */}
</BaseFormDialog>
```

#### FormField
مكون قالب لحقول النماذج يقلل من التكرار.

**قبل:**
```jsx
<Controller
    name="name"
    control={control}
    render={({ field, fieldState: { error } }) => (
        <MuiTextField
            {...field}
            label="الاسم"
            error={!!error}
            helperText={error?.message}
        />
    )}
/>
```

**بعد:**
```jsx
import { FormField } from '@/components/shared'

<FormField
    control={control}
    name="name"
    label="الاسم"
    type="text"
    required
/>
```

### 2. Custom Hooks (`src/hooks/`)

#### useDialogState
Hook لإدارة حالة Dialogs يقلل من التكرار في إدارة الحالة.

**قبل:**
```jsx
const [dialogOpen, setDialogOpen] = useState(false)
const [dialogType, setDialogType] = useState('')
const [selectedItem, setSelectedItem] = useState(null)

const openCreateDialog = () => {
    setDialogType('create')
    setDialogOpen(true)
}

const openEditDialog = (item) => {
    setDialogType('edit')
    setSelectedItem(item)
    setDialogOpen(true)
}
```

**بعد:**
```jsx
import { useDialogState } from '@/hooks'

const {
    dialogOpen,
    dialogType,
    selectedItem,
    openCreateDialog,
    openEditDialog,
    openViewDialog,
    openDeleteDialog,
    closeDialog,
    isCreate,
    isEdit,
    isView,
    isDelete,
} = useDialogState()
```

#### useCRUD
Hook للعمليات CRUD يقلل من التكرار في إدارة Mutations.

**قبل:**
```jsx
const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
        success('تمت العملية بنجاح')
        queryClient.invalidateQueries([QUERY_KEYS.MANAGER_CLIENTS])
    },
    onError: (err) => {
        showError(err?.message || 'حدث خطأ')
    },
})

const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateClient(id, data),
    onSuccess: () => {
        success('تمت العملية بنجاح')
        queryClient.invalidateQueries([QUERY_KEYS.MANAGER_CLIENTS])
    },
    onError: (err) => {
        showError(err?.message || 'حدث خطأ')
    },
})
```

**بعد:**
```jsx
import { useCRUD } from '@/hooks'

const {
    createMutation,
    updateMutation,
    deleteMutation,
    handleCreate,
    handleUpdate,
    handleDelete,
    isLoading,
} = useCRUD({
    createFn: createClient,
    updateFn: updateClient,
    deleteFn: deleteClient,
    queryKey: QUERY_KEYS.MANAGER_CLIENTS,
    successMessage: 'تمت العملية بنجاح',
    errorMessage: 'حدث خطأ',
})
```

### 3. Validation Schemas (`src/utils/validations.js`)

Schemas قابلة لإعادة الاستخدام للتحقق من البيانات.

**قبل:**
```jsx
// في كل صفحة، schema منفصل
const createClientSchema = z.object({
    name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
    phone: z.string().regex(/^\d+$/, 'رقم الهاتف يجب أن يكون أرقام فقط'),
    // ...
})
```

**بعد:**
```jsx
import { createUserSchema } from '@/utils/validations'

const schema = createUserSchema(false) // false = create, true = edit
```

## مثال على الاستخدام الكامل

### صفحة إدارة العملاء (مثال)

**قبل:**
```jsx
export default function ClientsManagement() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState('')
    const [selectedClient, setSelectedClient] = useState(null)
    
    const createMutation = useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            success('تمت العملية بنجاح')
            queryClient.invalidateQueries([QUERY_KEYS.MANAGER_CLIENTS])
        },
        // ...
    })
    
    // ... الكثير من الكود المكرر
}
```

**بعد:**
```jsx
import { useDialogState } from '@/hooks'
import { useCRUD } from '@/hooks'
import { BaseFormDialog, BaseViewDialog, FormField } from '@/components/shared'
import { createUserSchema } from '@/utils/validations'
import { createClient, updateClient, deleteClient } from '@/api/manager'
import { QUERY_KEYS } from '@/config/constants'

export default function ClientsManagement() {
    const {
        dialogOpen,
        dialogType,
        selectedItem,
        openCreateDialog,
        openEditDialog,
        openViewDialog,
        openDeleteDialog,
        closeDialog,
        isCreate,
        isEdit,
    } = useDialogState()
    
    const {
        createMutation,
        updateMutation,
        deleteMutation,
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading,
    } = useCRUD({
        createFn: createClient,
        updateFn: updateClient,
        deleteFn: deleteClient,
        queryKey: QUERY_KEYS.MANAGER_CLIENTS,
    })
    
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(createUserSchema(isEdit)),
    })
    
    const onSubmit = async (data) => {
        if (isCreate) {
            await handleCreate(data)
        } else {
            await handleUpdate(selectedItem?._id || selectedItem?.id, data)
        }
        closeDialog()
    }
    
    return (
        <>
            {/* DataTable */}
            <DataTable
                columns={columns}
                data={data}
                onView={openViewDialog}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
            />
            
            {/* Create/Edit Dialog */}
            <BaseFormDialog
                open={isCreate || isEdit}
                onClose={closeDialog}
                title={isCreate ? 'إضافة عميل' : 'تعديل عميل'}
                onSubmit={handleSubmit(onSubmit)}
                loading={isLoading}
            >
                <FormField control={control} name="name" label="الاسم" required />
                <FormField control={control} name="phone" label="رقم الهاتف" type="tel" required />
                <FormField control={control} name="username" label="اسم المستخدم" required={isCreate} />
                <FormField control={control} name="password" label="كلمة المرور" type="password" required={isCreate} />
            </BaseFormDialog>
            
            {/* View Dialog */}
            <BaseViewDialog
                open={isView}
                onClose={closeDialog}
                title="تفاصيل العميل"
            >
                {/* محتوى العرض */}
            </BaseViewDialog>
        </>
    )
}
```

## الفوائد

1. **تقليل التكرار**: الكود المكرر تم استبداله بمكونات و Hooks قابلة لإعادة الاستخدام
2. **سهولة الصيانة**: التغييرات في مكان واحد تؤثر على جميع الاستخدامات
3. **اتساق الواجهة**: جميع Dialogs و Forms تستخدم نفس المكونات الأساسية
4. **سهولة الاختبار**: المكونات المشتركة أسهل في الاختبار
5. **تحسين الأداء**: تقليل حجم الكود وتحسين إعادة الاستخدام

## الخطوات التالية

1. **تحديث الصفحات الموجودة**: استبدال المكونات القديمة بالمكونات الجديدة
2. **إضافة المزيد من المكونات**: حسب الحاجة (FormSection، FormGrid، إلخ)
3. **تحسين التوثيق**: إضافة المزيد من الأمثلة والاستخدامات
4. **الاختبار**: اختبار جميع المكونات الجديدة

## ملاحظات

- المكونات القديمة لا تزال تعمل ولا تحتاج إلى تحديث فوري
- يمكن تحديث الصفحات تدريجياً عند الحاجة
- جميع المكونات الجديدة متوافقة مع المكونات القديمة

