/**
 * AdvancedFilter Usage Examples
 * أمثلة على كيفية استخدام مكون الفلتر المتقدم
 */

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مثال 1: صفحة إدارة العملاء (Clients Management)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AdvancedFilter } from '@/components/common'
import { useDebounce } from '@/hooks'

export function ClientsManagementExample() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [activeFilters, setActiveFilters] = useState({})

    // تعريف الفلاتر المتاحة
    const filters = [
        {
            key: 'status',
            label: 'الحالة',
            type: 'select',
            options: [
                { value: 'active', label: 'نشط' },
                { value: 'inactive', label: 'غير نشط' },
                { value: 'suspended', label: 'معلق' }
            ]
        },
        {
            key: 'city',
            label: 'المدينة',
            type: 'select',
            options: [
                { value: 'riyadh', label: 'الرياض' },
                { value: 'jeddah', label: 'جدة' },
                { value: 'dammam', label: 'الدمام' }
            ]
        },
        {
            key: 'registrationDate',
            label: 'تاريخ التسجيل',
            type: 'dateRange'
        }
    ]

    // جلب البيانات بناءً على الفلاتر
    const { data: clients, isLoading, refetch } = useQuery({
        queryKey: ['clients', debouncedSearch, activeFilters],
        queryFn: () => getClients({
            search: debouncedSearch,
            ...activeFilters
        })
    })

    return (
        <>
            <AdvancedFilter
                onSearch={setSearchQuery}
                onFilterChange={setActiveFilters}
                filters={filters}
                onRefresh={refetch}
                searchPlaceholder="ابحث عن العمليات بالاسم أو الهاتف..."
            />
            {/* جدول العملاء */}
        </>
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مثال 2: صفحة إدارة الفعاليات (Events Management)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

export function EventsManagementExample() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [activeFilters, setActiveFilters] = useState({})

    const filters = [
        {
            key: 'status',
            label: 'حالة الفعالية',
            type: 'select',
            options: [
                { value: 'scheduled', label: 'مجدولة' },
                { value: 'ongoing', label: 'جارية' },
                { value: 'completed', label: 'منتهية' },
                { value: 'cancelled', label: 'ملغاة' }
            ]
        },
        {
            key: 'eventType',
            label: 'نوع الفعالية',
            type: 'select',
            options: [
                { value: 'wedding', label: 'حفل زفاف' },
                { value: 'birthday', label: 'حفل ميلاد' },
                { value: 'corporate', label: 'حفل شركي' },
                { value: 'conference', label: 'مؤتمر' }
            ]
        },
        {
            key: 'date',
            label: 'تاريخ الفعالية',
            type: 'dateRange'
        }
    ]

    const { data: events, refetch } = useQuery({
        queryKey: ['events', debouncedSearch, activeFilters],
        queryFn: () => getEvents({
            search: debouncedSearch,
            ...activeFilters
        })
    })

    return (
        <AdvancedFilter
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
            filters={filters}
            onRefresh={refetch}
            searchPlaceholder="ابحث عن الفعاليات..."
        />
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مثال 3: صفحة إدارة الخدمات (Services Management)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

export function ServicesManagementExample() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [activeFilters, setActiveFilters] = useState({})

    const filters = [
        {
            key: 'category',
            label: 'الفئة',
            type: 'select',
            options: [
                { value: 'catering', label: 'الطعام والشراب' },
                { value: 'decoration', label: 'الديكور' },
                { value: 'photography', label: 'التصوير' },
                { value: 'music', label: 'الموسيقى' }
            ]
        },
        {
            key: 'availability',
            label: 'التوفر',
            type: 'select',
            options: [
                { value: 'available', label: 'متاح' },
                { value: 'limited', label: 'محدود' },
                { value: 'unavailable', label: 'غير متاح' }
            ]
        },
        {
            key: 'createdDate',
            label: 'تاريخ الإضافة',
            type: 'dateRange'
        }
    ]

    const { data: services, refetch } = useQuery({
        queryKey: ['services', debouncedSearch, activeFilters],
        queryFn: () => getServices({
            search: debouncedSearch,
            ...activeFilters
        })
    })

    return (
        <AdvancedFilter
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
            filters={filters}
            onRefresh={refetch}
            searchPlaceholder="ابحث عن الخدمات..."
        />
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مثال 4: صفحة إدارة الموظفين (Staff Management)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

export function StaffManagementExample() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [activeFilters, setActiveFilters] = useState({})

    const filters = [
        {
            key: 'role',
            label: 'الدور',
            type: 'select',
            options: [
                { value: 'manager', label: 'مدير' },
                { value: 'staff', label: 'موظف' },
                { value: 'intern', label: 'متدرب' }
            ]
        },
        {
            key: 'department',
            label: 'القسم',
            type: 'select',
            options: [
                { value: 'catering', label: 'الطعام' },
                { value: 'decoration', label: 'الديكور' },
                { value: 'technical', label: 'التقني' }
            ]
        },
        {
            key: 'hireDate',
            label: 'تاريخ التوظيف',
            type: 'dateRange'
        }
    ]

    const { data: staff, refetch } = useQuery({
        queryKey: ['staff', debouncedSearch, activeFilters],
        queryFn: () => getStaff({
            search: debouncedSearch,
            ...activeFilters
        })
    })

    return (
        <AdvancedFilter
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
            filters={filters}
            onRefresh={refetch}
            searchPlaceholder="ابحث عن الموظفين..."
        />
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
مثال 5: صفحة إدارة الفواتير (Invoices Management)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

export function InvoicesManagementExample() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [activeFilters, setActiveFilters] = useState({})

    const filters = [
        {
            key: 'status',
            label: 'حالة الفاتورة',
            type: 'select',
            options: [
                { value: 'draft', label: 'مسودة' },
                { value: 'sent', label: 'مرسلة' },
                { value: 'paid', label: 'مدفوعة' },
                { value: 'overdue', label: 'متأخرة' }
            ]
        },
        {
            key: 'paymentMethod',
            label: 'طريقة الدفع',
            type: 'select',
            options: [
                { value: 'cash', label: 'نقداً' },
                { value: 'card', label: 'ببطاقة الائتمان' },
                { value: 'transfer', label: 'تحويل بنكي' }
            ]
        },
        {
            key: 'invoiceDate',
            label: 'تاريخ الفاتورة',
            type: 'dateRange'
        }
    ]

    const { data: invoices, refetch } = useQuery({
        queryKey: ['invoices', debouncedSearch, activeFilters],
        queryFn: () => getInvoices({
            search: debouncedSearch,
            ...activeFilters
        })
    })

    return (
        <AdvancedFilter
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
            filters={filters}
            onRefresh={refetch}
            searchPlaceholder="ابحث عن الفواتير برقمها أو اسم العميل..."
        />
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
استخدام بسيط بدون تاريخ (Simple Usage without date)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

export function SimpleFilterExample() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState({})

    const filters = [
        {
            key: 'category',
            label: 'الفئة',
            type: 'select',
            options: [
                { value: 'category1', label: 'فئة 1' },
                { value: 'category2', label: 'فئة 2' }
            ]
        }
    ]

    return (
        <AdvancedFilter
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilters}
            filters={filters}
            searchPlaceholder="ابحث..."
            showResetButton={true}
        />
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ملاحظات مهمة:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. خصائص المكون (Props):
   - onSearch: دالة تُستدعى عند تغيير البحث
   - onFilterChange: دالة تُستدعى عند تغيير أي فلتر (تستقبل جميع الفلاتر النشطة)
   - filters: مصفوفة تعريف الفلاتر
   - onRefresh: دالة تُستدعى عند الضغط على زر التحديث
   - searchPlaceholder: نص العنصر النائب في مربع البحث
   - showResetButton: إظهار أو إخفاء زر إعادة التعيين

2. نوع الفلتر:
   - type: 'select' للاختيارات الثابتة
   - type: 'dateRange' لنطاقات التاريخ

3. هيكل الفلتر:
   {
       key: 'uniqueKey',           // مفتاح فريد للفلتر
       label: 'عنوان الفلتر',      // النص المعروض
       type: 'select' | 'dateRange', // نوع الفلتر
       options: [                   // (ضروري للـ select فقط)
           { value: 'val1', label: 'Label 1' },
           { value: 'val2', label: 'Label 2' }
       ]
   }

4. القيم المُمررة إلى onFilterChange:
   {
       searchValue: 'نص البحث',
       filterKey1: 'قيمة الفلتر 1',
       filterKey2: 'قيمة الفلتر 2',
       dateFrom: '2024-01-01',      // إذا كان هناك dateRange
       dateTo: '2024-12-31'
   }

5. استخدام مع useDebounce:
   - ينصح به عند البحث جداً لتقليل عدد الاستدعاءات للـ API
   - استخدم debounced search في queryKey كما في الأمثلة

6. التنسيق (Styling):
   - يمكن تمرير `sx` prop لتخصيص الأنماط
   - المكون يدعم الوضع الليلي تلقائياً عبر CSS variables
*/
