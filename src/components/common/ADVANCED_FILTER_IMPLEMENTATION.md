/**
 * نموذج تطبيق المكون على صفحة ClientsManagementNew.jsx
 * 
 * يمكنك نسخ هذا الكود وتطبيقه على أي صفحة أخرى تحتوي على جدول
 */

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الآن في ClientsManagementNew.jsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// في الـ imports:
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce, useCRUD, useNotification } from '@/hooks'
import {
    LoadingScreen,
    EmptyState,
    SEOHead,
    DataTable,
    ConfirmDialog,
    AdvancedFilter  // ✅ أضفناها
} from '@/components/common'

// في المكون:
export default function ClientsManagement() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    
    // ✅ إضافة حالة للفلاتر
    const [activeFilters, setActiveFilters] = useState({})
    
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotification()

    // ✅ تعريف الفلاتر المتاحة
    const filterConfig = [
        {
            key: 'status',
            label: 'حالة العميل',
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
                { value: 'dammam', label: 'الدمام' },
                { value: 'madina', label: 'المدينة' }
            ]
        },
        {
            key: 'registrationDate',
            label: 'تاريخ التسجيل',
            type: 'dateRange'
        }
    ]

    // ✅ تحديث query عند تغيير الفلاتر
    const { data: clientsData, isLoading, refetch } = useQuery({
        queryKey: [QUERY_KEYS.MANAGER_CLIENTS, debouncedSearch, activeFilters],
        queryFn: () => getClients({
            search: debouncedSearch,
            ...activeFilters  // ✅ إرسال الفلاتر النشطة
        }),
    })

    // ... باقي الكود يبقى كما هو ...

    return (
        <MuiBox>
            <SEOHead page="clients" />

            {/* ✅ إضافة مكون الفلتر المتقدم */}
            <AdvancedFilter
                onSearch={setSearchQuery}
                onFilterChange={setActiveFilters}
                filters={filterConfig}
                onRefresh={refetch}
                searchPlaceholder="ابحث عن العملاء بالاسم أو رقم الهاتف..."
                showResetButton={true}
            />

            {/* الجدول والباقي كما هو */}
            {isLoading ? (
                <LoadingScreen />
            ) : clients?.length > 0 ? (
                <DataTable
                    rows={clients}
                    columns={columns}
                    // ... باقي props
                />
            ) : (
                <EmptyState message="لا توجد بيانات" />
            )}
        </MuiBox>
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
خطوات التطبيق على أي صفحة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ استيراد المكون:
   import { AdvancedFilter } from '@/components/common'

2️⃣ إضافة state للفلاتر:
   const [activeFilters, setActiveFilters] = useState({})

3️⃣ تعريف الفلاتر:
   const filterConfig = [{ key, label, type, options }, ...]

4️⃣ إضافة الفلاتر إلى queryKey من useQuery:
   queryKey: [KEY, debouncedSearch, activeFilters]

5️⃣ إرسال الفلاتر في API call:
   queryFn: () => getList({ search: debouncedSearch, ...activeFilters })

6️⃣ إضافة المكون قبل الجدول:
   <AdvancedFilter
       onSearch={setSearchQuery}
       onFilterChange={setActiveFilters}
       filters={filterConfig}
       onRefresh={refetch}
       searchPlaceholder="...ابحث"
   />

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
أمثلة API responses المتوقعة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API Call:
  GET /api/clients?search=ahmed&status=active&city=riyadh&dateFrom=2024-01-01&dateTo=2024-12-31

Response:
  {
    success: true,
    data: [
      { id: 1, name: 'أحمد محمد', city: 'riyadh', status: 'active', ... },
      { id: 2, name: 'أحمد علي', city: 'riyadh', status: 'active', ... }
    ],
    total: 2
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
نموذج تطبيق كامل - صفحة إدارة الخدمات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// مثال على صفحة Services Management المحسّنة:

export function ServicesManagementEnhanced() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [activeFilters, setActiveFilters] = useState({})

    // تعريف الفلاتر
    const filterConfig = [
        {
            key: 'category',
            label: 'فئة الخدمة',
            type: 'select',
            options: [
                { value: 'catering', label: 'الطعام والشراب' },
                { value: 'decoration', label: 'الديكور' },
                { value: 'photography', label: 'التصوير والفيديو' },
                { value: 'music', label: 'الموسيقى والفنانين' },
                { value: 'transport', label: 'النقل والمواصلات' }
            ]
        },
        {
            key: 'availability',
            label: 'توفر الخدمة',
            type: 'select',
            options: [
                { value: 'available', label: 'متاح' },
                { value: 'limited', label: 'محدود' },
                { value: 'unavailable', label: 'غير متاح' }
            ]
        },
        {
            key: 'priceRange',
            label: 'نطاق السعر',
            type: 'select',
            options: [
                { value: '0-1000', label: '0 - 1,000 ريال' },
                { value: '1000-5000', label: '1,000 - 5,000 ريال' },
                { value: '5000-10000', label: '5,000 - 10,000 ريال' },
                { value: '10000+', label: '10,000+ ريال' }
            ]
        },
        {
            key: 'createdDate',
            label: 'تاريخ الإضافة',
            type: 'dateRange'
        }
    ]

    const { data: servicesData, isLoading, refetch } = useQuery({
        queryKey: ['services', debouncedSearch, activeFilters],
        queryFn: async () => {
            const params = new URLSearchParams({
                search: debouncedSearch,
                ...activeFilters
            })
            const res = await fetch(`/api/services?${params}`)
            return res.json()
        }
    })

    const columns = [
        { field: 'name', headerName: 'اسم الخدمة', width: 200 },
        { field: 'category', headerName: 'الفئة', width: 150 },
        { field: 'price', headerName: 'السعر', width: 120 },
        { field: 'availability', headerName: 'التوفر', width: 120 },
        { field: 'createdDate', headerName: 'تاريخ الإضافة', width: 150 }
    ]

    return (
        <MuiBox sx={{ p: 3 }}>
            <SEOHead page="services" />

            <AdvancedFilter
                onSearch={setSearchQuery}
                onFilterChange={setActiveFilters}
                filters={filterConfig}
                onRefresh={refetch}
                searchPlaceholder="ابحث عن الخدمات..."
            />

            {isLoading ? (
                <LoadingScreen />
            ) : (
                <DataTable
                    rows={servicesData?.data || []}
                    columns={columns}
                    loading={isLoading}
                />
            )}
        </MuiBox>
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الملفات التي يمكن تطبيق المكون عليها
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ صفحات Manager:
   - src/pages/manager/ClientsManagementNew.jsx
   - src/pages/manager/EventsManagementNew.jsx
   - src/pages/manager/StaffManagementNew.jsx
   - src/pages/manager/HallManagementNew.jsx
   - src/pages/manager/ServicesManagement.jsx
   - src/pages/manager/SongsManagement.jsx
   - src/pages/manager/ManagerFinancial.jsx
   - src/pages/manager/ManagerRatings.jsx

✅ صفحات Admin:
   - src/pages/admin/ClientsManagement.jsx
   - src/pages/admin/EventsManagement.jsx
   - src/pages/admin/UsersManagement.jsx
   - src/pages/admin/HallsManagement.jsx
   - src/pages/admin/TemplatesManagement.jsx
   - src/pages/admin/ServicesManagement.jsx
   - src/pages/admin/ManagersManagement.jsx
   - src/pages/admin/ReportsManagement.jsx

✅ صفحات Client:
   - src/pages/client/Invitations.jsx
   - src/pages/client/Songs.jsx
   - src/pages/client/ClientRatings.jsx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
إذا واجهت مشاكل
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 تحقق من:
   1. استيراد المكون بشكل صحيح
   2. وجود useDebounce hook
   3. تعريف filterConfig صحيح
   4. أن queryKey يحتوي على activeFilters
   5. البيانات تُرسل بشكل صحيح من API

❓ أسئلة شائعة:
   - هل أحتاج لتغيير البيانات الموجودة؟ لا، يمكنك إضافة المكون دون تغيير
   - هل يدعم Pagination؟ نعم، استخدم DataTable مع pagination prop
   - هل يدعم الفحص عن بيانات مخصصة؟ نعم، يمكنك تخصيص filterConfig كأمثلة مختلفة

*/
