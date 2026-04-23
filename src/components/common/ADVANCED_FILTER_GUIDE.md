/**
 * AdvancedFilter Component - دليل الاستخدام الشامل
 * 
 * مكون فلتر متقدم قابل لإعادة الاستخدام في جميع صفحات إدارة الجداول
 */

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الاستخدام الأساسي
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

import { useState } from 'react'
import { AdvancedFilter } from '@/components/common'
import { useDebounce } from '@/hooks'

function MyComponent() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [filters, setFilters] = useState({})

    // تعريف الفلاتر المتاحة
    const filterConfig = [
        {
            key: 'status',
            label: 'الحالة',
            type: 'select',
            options: [
                { value: 'active', label: 'نشط' },
                { value: 'inactive', label: 'غير نشط' }
            ]
        },
        {
            key: 'date',
            label: 'التاريخ',
            type: 'dateRange'
        }
    ]

    return (
        <AdvancedFilter
            onSearch={setSearchQuery}
            onFilterChange={setFilters}
            filters={filterConfig}
            onRefresh={() => console.log('تحديث البيانات')}
        />
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الخصائص المتوفرة (Props)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. onSearch: (value: string) => void
   - تُستدعى عند تغيير نص البحث
   - تُمرر قيمة البحث الحالية

2. onFilterChange: (filters: Object) => void
   - تُستدعى عند تغيير أي فلتر
   - تُمرر كائن يحتوي على جميع الفلاتر النشطة
   مثال: { status: 'active', dateFrom: '2024-01-01', dateTo: '2024-12-31' }

3. filters: Array<FilterConfig>
   - مصفوفة تعريف الفلاتر المتاحة
   - كل فلتر يجب أن يحتوي على: key, label, type, options (للـ select فقط)

4. onRefresh: () => void
   - دالة اختيارية تُستدعى عند الضغط على زر التحديث
   - عادة تكون refetch من useQuery

5. searchPlaceholder: string
   - النص الافتراضي: 'بحث...'
   - النص المعروض في مربع البحث

6. showResetButton: boolean
   - الافتراضي: true
   - إظهار/إخفاء زر إعادة التعيين وتنظيف جميع الفلاتر

7. sx: Object
   - كائن أنماط Material-UI اختياري
   - يطبق على المكون الرئيسي (Paper)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
هيكل الفلتر (Filter Configuration)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

نوع 1: SELECT FILTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
    key: 'status',              // مفتاح فريد يُستخدم في onFilterChange
    label: 'الحالة',            // النص المعروض
    type: 'select',             // نوع الفلتر
    options: [                  // خيارات الاختيار
        {
            value: 'active',    // القيمة المُمررة عند الاختيار
            label: 'نشط'        // النص المعروض
        },
        {
            value: 'inactive',
            label: 'غير نشط'
        }
    ]
}

نوع 2: DATE RANGE FILTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
    key: 'date',                // يُستخدم كبادئة (dateFrom, dateTo)
    label: 'التاريخ',           // يُستخدم مع 'من' و 'إلى'
    type: 'dateRange'           // نوع الفلتر
}

سيُنتج عنه في onFilterChange:
{
    // ... فلاتر أخرى
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31'
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
قيم النتج (Output)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

عند تغيير أي فلتر، يتم استدعاء onFilterChange مع كائن يحتوي على:

{
    status: 'active',           // من select filter
    category: 'food',           // من select filter آخر
    dateFrom: '2024-01-01',     // من date range filter
    dateTo: '2024-12-31',       // من نفس date range filter
    // ملاحظة: الفلاتر الفارغة لا تُضاف إلى الكائن
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مثال متكامل - صفحة إدارة الموارد البشرية
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/common'

export function HumanResourcesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [activeFilters, setActiveFilters] = useState({})

    // تعريف الفلاتر
    const filters = [
        {
            key: 'department',
            label: 'القسم',
            type: 'select',
            options: [
                { value: 'hr', label: 'الموارد البشرية' },
                { value: 'finance', label: 'المالية' },
                { value: 'it', label: 'تكنولوجيا المعلومات' },
                { value: 'sales', label: 'المبيعات' }
            ]
        },
        {
            key: 'position',
            label: 'المنصب',
            type: 'select',
            options: [
                { value: 'manager', label: 'مدير' },
                { value: 'senior', label: 'أول' },
                { value: 'staff', label: 'موظف' }
            ]
        },
        {
            key: 'salary_range',
            label: 'نطاق الراتب',
            type: 'select',
            options: [
                { value: '0-10000', label: '0 - 10,000 ريال' },
                { value: '10000-20000', label: '10,000 - 20,000 ريال' },
                { value: '20000+', label: '20,000+ ريال' }
            ]
        },
        {
            key: 'hire_date',
            label: 'تاريخ التوظيف',
            type: 'dateRange'
        }
    ]

    // جلب البيانات
    const { data: employees, isLoading, refetch } = useQuery({
        queryKey: ['employees', debouncedSearch, activeFilters],
        queryFn: async () => {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    search: debouncedSearch,
                    ...activeFilters
                })
            })
            return response.json()
        }
    })

    // تعريف أعمدة الجدول
    const columns = [
        { field: 'name', headerName: 'الاسم', width: 200 },
        { field: 'email', headerName: 'البريد الإلكتروني', width: 250 },
        { field: 'department', headerName: 'القسم', width: 150 },
        { field: 'position', headerName: 'المنصب', width: 150 },
        { field: 'hire_date', headerName: 'تاريخ التوظيف', width: 150 }
    ]

    return (
        <div>
            {/* مكون الفلتر المتقدم */}
            <AdvancedFilter
                onSearch={setSearchQuery}
                onFilterChange={setActiveFilters}
                filters={filters}
                onRefresh={refetch}
                searchPlaceholder="ابحث عن الموظفين بالاسم أو البريد الإلكتروني..."
                sx={{ mb: 3 }}
            />

            {/* جدول البيانات */}
            <DataTable
                rows={employees?.data || []}
                columns={columns}
                loading={isLoading}
            />
        </div>
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
نصائح وأفضل الممارسات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ افعل:
─────────

1. استخدم useDebounce للبحث:
   const debouncedSearch = useDebounce(searchQuery, 500)
   ثم استخدم debouncedSearch في queryKey

2. ضع الفلاتر في queryKey من useQuery:
   queryKey: ['items', debouncedSearch, activeFilters]
   هذا يضمن إعادة جلب البيانات عند تغيير الفلاتر

3. استخدم معرفات فريدة للفلاتر:
   key: 'unique_key_per_filter'
   تجنب التضارب بين المفاتيح

4. وفر خيارات ذات معنى:
   options: [{ value: 'actual_db_value', label: 'نص معروض' }]

❌ لا تفعل:
──────────

1. لا تستدعِ API مباشرة في onFilterChange:
   ❌ onFilterChange={(f) => fetch(...)} // خطأ!
   ✅ استخدم useQuery مع queryKey بدلاً من ذلك

2. لا تضع الفلاتر الخام مباشرة في queryKey:
   ❌ queryKey: [searchValue] // قد يؤدي إلى استدعاءات كثيرة
   ✅ queryKey: [debouncedSearch]

3. لا تنسَ تنظيف الفلاتر الفارغة من API requests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الميزات الإضافية
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. عرض الفلاتر النشطة:
   - المكون يعرض تلقائياً Chips توضح الفلاتر المفعلة
   - يمكن إزالة كل فلتر بنقرة واحدة على الـ X

2. زر إعادة التعيين:
   - يظهر تلقائياً عند وجود فلاتر نشطة
   - ينظف جميع الفلاتر والبحث

3. زر التحديث:
   - اختياري (فقط إذا تم تمرير onRefresh)
   - يعيد جلب البيانات من الـ API

4. سهولة الاستخدام:
   - جميع الحقول لها ارتفاع موحد (56px)
   - استجابة كاملة (Responsive)
   - يدعم RTL تلقائياً

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الأخطاء الشائعة والحلول
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ المشكلة: البيانات لا تتحدث عند تغيير الفلاتر
   الحل: تأكد من أن activeFilters موجود في queryKey من useQuery

⚠️ المشكلة: استدعاءات API كثيرة جداً
   الحل: استخدم useDebounce للبحث وقلل التأخير إذا لزم الأمر

⚠️ المشكلة: الفلاتر لا تظهر بشكل صحيح
   الحل: تحقق من أن options لديها value و label صحيحة

⚠️ المشكلة: الفلتر لا يرسل قيم التاريخ الصحيحة
   الحل: تأكد من استخدام type: 'dateRange' وليس 'select'
*/
