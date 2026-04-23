/**
 * 🚀 AdvancedFilter - البدء السريع
 * 
 * ابدأ باستخدام مكون الفلتر المتقدم في دقيقتين فقط!
 */

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الخطوة 1️⃣: استيراد المكون والـ Hooks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AdvancedFilter } from '@/components/common'
import { useDebounce } from '@/hooks'

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الخطوة 2️⃣: إعداد الحالات (States)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

export default function MyPage() {
    // البحث
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    
    // الفلاتر
    const [activeFilters, setActiveFilters] = useState({})

    /*
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    الخطوة 3️⃣: تعريف الفلاتر المتاحة
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    */

    const filterConfig = [
        // فلتر اختيار بسيط
        {
            key: 'status',
            label: 'الحالة',
            type: 'select',
            options: [
                { value: 'active', label: '✅ نشط' },
                { value: 'inactive', label: '❌ غير نشط' }
            ]
        },
        
        // فلتر اختيار آخر
        {
            key: 'category',
            label: 'الفئة',
            type: 'select',
            options: [
                { value: 'food', label: '🍕 طعام' },
                { value: 'drink', label: '🥤 شراب' },
                { value: 'decoration', label: '✨ ديكور' }
            ]
        },
        
        // فلتر نطاق تاريخ
        {
            key: 'date',
            label: 'التاريخ',
            type: 'dateRange'
        }
    ]

    /*
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    الخطوة 4️⃣: جلب البيانات مع الفلاتر
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    */

    const { data, isLoading, refetch } = useQuery({
        // تضمين الفلاتر في queryKey
        queryKey: ['items', debouncedSearch, activeFilters],
        
        queryFn: async () => {
            // بناء URL queries
            const params = new URLSearchParams({
                search: debouncedSearch,
                ...activeFilters  // ✨ أضفنا الفلاتر النشطة
            })
            
            // استدعاء الـ API
            const res = await fetch(`/api/items?${params}`)
            return res.json()
        }
    })

    /*
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    الخطوة 5️⃣: استخدام المكون
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    */

    return (
        <div>
            {/* 🎯 المكون الفلتر المتقدم */}
            <AdvancedFilter
                // تُستدعى عند تغيير البحث
                onSearch={setSearchQuery}
                
                // تُستدعى عند تغيير أي فلتر
                onFilterChange={setActiveFilters}
                
                // الفلاتر المتاحة
                filters={filterConfig}
                
                // دالة لإعادة جلب البيانات
                onRefresh={refetch}
                
                // جميع الـ props الأخرى اختيارية
                searchPlaceholder="ابحث عن البيانات..."
            />

            {/* عرض البيانات */}
            {isLoading && <p>جاري التحميل...</p>}
            {data?.data?.length > 0 ? (
                <div>
                    {data.data.map(item => (
                        <div key={item.id}>{item.name}</div>
                    ))}
                </div>
            ) : (
                <p>لا توجد نتائج</p>
            )}
        </div>
    )
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ هذا كل شيء! لديك الآن فلتر فعّال
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

عندما يستخدم المستخدم المكون، يحدث التالي:

1. يكتب في البحث
   → onSearch يُستدعى
   → searchQuery يتحدث
   → refetch يعاد استدعاؤه بـ البحث الجديد

2. يختار فلتر
   → onFilterChange يُستدعى
   → activeFilters يتحدث
   → refetch يعاد استدعاؤه مع الفلاتر الجديدة

3. يختار نطاق تاريخ
   → onFilterChange يُستدعى مع dateFrom و dateTo
   → البيانات تتحدث تلقائياً

4. يضغط على "إعادة تعيين"
   → جميع الفلاتر تُنظف
   → البيانات تُعاد لحالتها الأولى

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 الملفات الإضافية للمراجعة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 ADVANCED_FILTER_GUIDE.md - دليل شامل مع نصائح
📗 ADVANCED_FILTER_EXAMPLES.md - 5+ أمثلة عملية
📙 ADVANCED_FILTER_IMPLEMENTATION.md - خطوات التطبيق
📕 ADVANCED_FILTER_TECHNICAL.md - تفاصيل تقنية عميقة

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ نصائح سريعة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 فلاتر ديناميكية من API:

const [filterOptions, setFilterOptions] = useState({})

useEffect(() => {
    fetch('/api/filter-options')
        .then(r => r.json())
        .then(data => setFilterOptions(data))
}, [])

const filterConfig = [
    {
        key: 'status',
        label: 'الحالة',
        type: 'select',
        options: filterOptions.status || []
    },
    // ...
]

💡 فلتر مخصص (Conditional):

const filterConfig = [
    {
        key: 'category',
        label: 'الفئة',
        type: 'select',
        options: userRole === 'admin' ? allCategories : publicCategories
    }
]

💡 التعامل مع الأخطاء:

const { data, isLoading, error } = useQuery({
    queryKey: ['items', debouncedSearch, activeFilters],
    queryFn: async () => {
        const res = await fetch(...)
        if (!res.ok) throw new Error('Failed')
        return res.json()
    }
})

if (error) <p>حدث خطأ: {error.message}</p>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐛 استكشاف الأخطاء
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ المكون لا يظهر؟
→ تأكد من أنك استوردته من '@/components/common'

❓ البيانات لا تتحدث عند تغيير الفلاتر؟
→ أضف activeFilters إلى queryKey في useQuery

❓ الفلاتر لا تُمرر للـ API؟
→ تحقق من أن هيكل URL queries صحيح

❓ الأداء بطيئة جداً؟
→ استخدم useDebounce للبحث

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 الآن أنت مستعد!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

يمكنك الآن:
✅ إضافة المكون إلى أي صفحة بجدول
✅ إعداد فلاتر مخصصة في ثوان
✅ جلب البيانات بناءً على الفلاتر تلقائياً

استمتع بالفلترة الذكية! 🚀
*/
