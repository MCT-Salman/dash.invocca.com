# Shared Components

مكونات مشتركة قابلة لإعادة الاستخدام في جميع أنحاء التطبيق.

## المكونات

### BaseViewDialog
مكون أساسي لعرض البيانات في Dialog.

```jsx
import { BaseViewDialog } from '@/components/shared'

<BaseViewDialog
    open={open}
    onClose={handleClose}
    title="عنوان Dialog"
    maxWidth="md"
    fullWidth
>
    {/* محتوى Dialog */}
</BaseViewDialog>
```

**Props:**
- `open` (Boolean): حالة فتح/إغلاق Dialog
- `onClose` (Function): دالة إغلاق Dialog
- `title` (String): عنوان Dialog
- `children` (ReactNode): محتوى Dialog
- `maxWidth` (String): الحد الأقصى للعرض (xs, sm, md, lg, xl)
- `fullWidth` (Boolean): عرض كامل
- `headerImage` (ReactNode): صورة/محتوى رأس اختياري
- `closeText` (String): نص زر الإغلاق
- `showCloseButton` (Boolean): إظهار زر الإغلاق في Actions

### BaseFormDialog
مكون أساسي للنماذج في Dialog.

```jsx
import { BaseFormDialog } from '@/components/shared'

<BaseFormDialog
    open={open}
    onClose={handleClose}
    title="إضافة عنصر جديد"
    onSubmit={handleSubmit}
    loading={isLoading}
>
    {/* محتوى النموذج */}
</BaseFormDialog>
```

**Props:**
- `open` (Boolean): حالة فتح/إغلاق Dialog
- `onClose` (Function): دالة إغلاق Dialog
- `title` (String): عنوان Dialog
- `subtitle` (String): عنوان فرعي اختياري
- `children` (ReactNode): محتوى النموذج
- `onSubmit` (Function): دالة إرسال النموذج
- `loading` (Boolean): حالة التحميل
- `submitText` (String): نص زر الإرسال
- `cancelText` (String): نص زر الإلغاء
- `maxWidth` (String): الحد الأقصى للعرض
- `fullWidth` (Boolean): عرض كامل
- `showCancel` (Boolean): إظهار زر الإلغاء

### FormField
مكون قالب لحقول النماذج.

```jsx
import { FormField } from '@/components/shared'
import { useForm } from 'react-hook-form'

const { control } = useForm()

<FormField
    control={control}
    name="name"
    label="الاسم"
    type="text"
    required
/>
```

**Props:**
- `control` (Object): React Hook Form control
- `name` (String): اسم الحقل
- `label` (String): تسمية الحقل
- `type` (String): نوع الحقل (text, password, email, tel, number, select, textarea)
- `options` (Array): خيارات لحقل Select
- `rows` (Number): عدد الأسطر لحقل Textarea
- `placeholder` (String): نص توضيحي
- `required` (Boolean): حقل مطلوب
- `disabled` (Boolean): حقل معطل
- `sx` (Object): أنماط إضافية

## Hooks

### useDialogState
Hook لإدارة حالة Dialogs.

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

### useCRUD
Hook للعمليات CRUD.

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

## Validation Schemas

Schemas قابلة لإعادة الاستخدام في `src/utils/validations.js`:

- `createUserSchema(isEdit)` - للعملاء والمستخدمين
- `createStaffSchema(isEdit, allowedRoles)` - للموظفين
- `createEventSchema()` - للفعاليات
- `createTemplateSchema()` - للقوالب
- `createHallSchema()` - للقاعات

```jsx
import { createUserSchema } from '@/utils/validations'
import { zodResolver } from '@hookform/resolvers/zod'

const { control } = useForm({
    resolver: zodResolver(createUserSchema(false)),
})
```

