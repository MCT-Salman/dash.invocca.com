/**
 * AdvancedFilter تفاصيل تقنية
 * شرح شامل لكيفية عمل المكون والأكواد الداخلية
 */

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
معمارية المكون
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

المكون يتكون من:

1. Search Field (حقل البحث)
   - مراقبة مباشرة: onSearch متصل مباشرة
   - مع أيقونة بحث من lucide-react

2. Select Filters (فلاتر الاختيار)
   - يُنشأ ديناميكياً بناءً على filterConfig
   - كل فلتر يُعدِّل قيمة في filterValues object
   - يُرسل التغيير مباشرة إلى onFilterChange

3. Date Range Filters (فلاتر النطاق الزمني)
   - حقلان منفصلان (من - إلى)
   - يُجمعان في state واحد: dateRange
   - يُمررران كـ dateFrom و dateTo في onFilterChange

4. Action Buttons (أزرار الإجراءات)
   - زر Reset: ينظف جميع الفلاتر والبحث
   - زر Refresh: يعيد جلب البيانات (اختياري)
   - يظهران بناءً على الشروط

5. Active Filters Display (عرض الفلاتر النشطة)
   - Chips توضح الفلاتر المفعلة
   - يمكن إزالة كل فلتر بنقرة على X
   - تُظهر تلقائياً عند وجود فلاتر

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تدفق البيانات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

البحث:
  User Types → handleSearchChange → setSearchValue → onSearch(value)

اختيار الفلتر:
  User Selects → handleFilterChange → setFilterValues → onFilterChange(filters)

تعديل التاريخ:
  User Picks Date → handleDateChange → setDateRange → onFilterChange(filters)

إعادة التعيين:
  User Clicks Reset → handleReset → clears all states → onFilterChange({})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الدوال الرئيسية
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. handleSearchChange(value)
   - تحديث searchValue state
   - استدعاء onSearch(value)
   - استخدام useCallback لتحسين الأداء

2. handleFilterChange(key, value)
   - إضافة/تحديث filterValues[key] = value
   - تنظيف القيم الفارغة من الكائن
   - استدعاء onFilterChange مع الفلاتر المحدثة
   - استخدام useCallback

3. handleDateChange(type, value)
   - تحديث dateRange state (من/إلى)
   - دمج dateRange مع filterValues
   - تجميع البيانات وإرسالها إلى onFilterChange
   - استخدام useCallback

4. handleReset()
   - إعادة تعيين جميع الحالات إلى القيم الافتراضية
   - استدعاء onSearch مع '' (فارغ)
   - استدعاء onFilterChange مع {} (كائن فارغ)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الحالات (State)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. searchValue: string
   - القيمة الحالية في حقل البحث
   - مثال: "أحمد" or "ahmed@gmail"

2. filterValues: object
   - كائن يحتوي على قيم جميع فلاتر الاختيار المفعلة
   - مثال: { status: 'active', city: 'riyadh' }

3. dateRange: object
   - يحتوي على from و to للنطاق الزمني
   - مثال: { from: '2024-01-01', to: '2024-12-31' }

4. activeFilters: computed
   - ليس state حقيقي لكن محسوب من الحالات الأخرى
   - يستخدم لمعرفة ما إذا كان هناك فلاتر نشطة

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تحسينات الأداء
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. useCallback Hooks:
   - جميع دوال المعالجات مغلفة بـ useCallback
   - يمنع إعادة الدالة في كل render
   - يحسن من أداء المكونات الفرعية

2. تخطي Renders غير الضرورية:
   - filterConfig محسوب بـ filter() بدلاً من jsx في الـ render
   - تجنب الحسابات المتكررة

3. عدم إرسال undefined values:
   - الفلاتر الفارغة تُحذف من الكائن قبل الإرسال
   - يقلل من حجم البيانات المرسلة

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
هيكل CSS والاستجابة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Grid Layout:
  - استخدام MuiGrid مع responsive breakpoints
  - xs={12}: موبايل - 100% العرض
  - sm={6}: تابليت صغير - 50%
  - md={4}: تابليت - 33%
  - lg={3}: سطح المكتب - 25%

Search Field:
  - xs={12} sm={6} md={4} lg={3}

Select Filters:
  - كل واحد يأخذ xs={12} sm={6} md={4} lg={3}
  - يتجمعون أفقياً حسب الشاشة

Date Range:
  - Container: xs={12} md={6} lg={4}
  - كل input: xs={6}
  - يسمح بعرض تاريخين بجانب بعض

Action Buttons:
  - xs={12} sm={6} md={4} lg={3}
  - flex layout لعرض الأزرار بجانب بعضها

Active Filters Display:
  - xs={12} دائماً (عرض كامل)
  - flexWrap لالتفاف الـ Chips

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
نقل البيانات عبر المكونات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

التدفق الموصى به:

Parent Component:
  ↓
  const [activeFilters, setActiveFilters] = useState({})
  ↓
  <AdvancedFilter onFilterChange={setActiveFilters} ... />
  ↓
  query: { queryKey: [key, activeFilters], queryFn: () => API(...) }
  ↓
  <DataTable rows={data} ... />

استدعاء API:
  
  // عند الضغط على زر البحث/الفلتر
  API('/items', {
    search: 'نص البحث',
    status: 'قيمة الفلتر 1',
    category: 'قيمة الفلتر 2',
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31'
  })

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
المميزات الخاصة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Dynamic Filter Generation:
   - الفلاتر تُنشأ ديناميكياً من filterConfig
   - لا حاجة لكود مختلف لكل صفحة

2. Smart Reset Button:
   - يظهر فقط عند وجود فلاتر نشطة
   - يختفي تلقائياً عند تنظيف جميع الفلاتر

3. Responsive Filters Display:
   - عرض الفلاتر والبحث بشكل ديناميكي حسب الشاشة
   - جميع الحقول بنفس الارتفاع (56px)

4. Empty Filter Removal:
   - لا تُرسل قيم فارغة أو undefined للـ API
   - يحسن من سرعة البحث والفرز

5. RTL Support:
   - دعم النصوص من اليمين لليسار تلقائياً
   - جميع الأيقونات والترتيب صحيح

6. Theme Integration:
   - يستخدم CSS variables من theme
   - يدعم الوضع الليلي تلقائياً

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
أمثلة على الفلاتر المتقدمة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

نوع 1: Select بيانات ديناميكية
  const [departments, setDepartments] = useState([])
  
  useEffect(() => {
    fetchDepartments().then(setDepartments)
  }, [])
  
  const filters = [{
    key: 'department',
    label: 'القسم',
    type: 'select',
    options: departments.map(d => ({ value: d.id, label: d.name }))
  }]

نوع 2: فلاتر متعددة من نفس النوع
  const filters = [
    { key: 'status', label: 'الحالة', type: 'select', options: [...] },
    { key: 'priority', label: 'الأولوية', type: 'select', options: [...] },
    { key: 'assignee', label: 'المسؤول', type: 'select', options: [...] },
    { key: 'date', label: 'التاريخ', type: 'dateRange' }
  ]

نوع 3: فلاتر متقدمة مع validation
  const filters = [
    {
      key: 'priceRange',
      label: 'السعر',
      type: 'select',
      options: [
        { value: '0-100', label: 'أقل من 100 ريال' },
        { value: '100-500', label: '100 - 500 ريال' },
        { value: '500+', label: 'أكثر من 500 ريال' }
      ],
      validate: (value) => value !== null // اختياري
    }
  ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
المشاكل الشائعة والحلول
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

المشكلة 1: البيانات لا تتحدث
Reason: activeFilters ليس في queryKey
Solution: أضف activeFilters إلى queryKey

المشكلة 2: Select مفتوح ولا يغلق
Reason: قد يكون بسبب z-index
Solution: تأكد من عدم وجود Container بـ overflow: hidden

المشكلة 3: تاريخ من/إلى لا يعمل
Reason: قد تكون مشكلة من الـ Browser date picker
Solution: جرب في متصفح آخر أو أضف fallback

المشكلة 4: الأداء بطيئة وvisual lag
Reason: Renders كثيرة أو قائمة كبيرة جداً
Solution: استخدم useMemo أو استخدم virtualization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الملفات المتعلقة بالمكون
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

المكون الرئيسي:
  src/components/common/AdvancedFilter.jsx

التصدير:
  src/components/common/index.js

الأمثلة:
  src/components/common/ADVANCED_FILTER_EXAMPLES.md (أمثلة code)
  src/components/common/ADVANCED_FILTER_GUIDE.md (دليل الاستخدام)
  src/components/common/ADVANCED_FILTER_IMPLEMENTATION.md (خطوات التطبيق)
  src/components/common/ADVANCED_FILTER_TECHNICAL.md (التفاصيل التقنية - هذا الملف)

المكونات المشابهة:
  src/components/common/FilterBar.jsx (فلتر أساسي بسيط)
  src/components/common/DataTable.jsx (جدول البيانات)

*/

// كود النسخة الداخلية من المكون:

import { useState, useCallback } from 'react'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiInputAdornment from '@/components/ui/MuiInputAdornment'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiChip from '@/components/ui/MuiChip'
import { Search, RefreshCw, X } from 'lucide-react'

export default function AdvancedFilter({
    // Props المطلوبة
    onSearch,           // function: (value: string) => void
    onFilterChange,     // function: (filters: object) => void
    filters = [],       // Array<FilterConfig>
    
    // Props الاختيارية
    onRefresh,          // function?: () => void
    searchPlaceholder = 'بحث...',
    sx = {},
    showResetButton = true,
}) {
    // حالات المكون
    const [searchValue, setSearchValue] = useState('')
    const [filterValues, setFilterValues] = useState({})
    const [dateRange, setDateRange] = useState({ from: '', to: '' })

    // معالج تين البحث مع useCallback لتحسين الأداء
    const handleSearchChange = useCallback((value) => {
        setSearchValue(value)
        onSearch?.(value)
    }, [onSearch])

    // معالج تغيير الفلاتر
    const handleFilterChange = useCallback((key, value) => {
        setFilterValues(prev => {
            const newFilters = { ...prev, [key]: value }
            // تنظيف الفلاتر الفارغة
            Object.keys(newFilters).forEach(k => {
                if (!newFilters[k]) delete newFilters[k]
            })
            // استدعاء onFilterChange مع الفلاتر المحدثة
            setTimeout(() => onFilterChange?.(newFilters), 0)
            return newFilters
        })
    }, [onFilterChange])

    // معالج تغيير التاريخ
    const handleDateChange = useCallback((type, value) => {
        setDateRange(prev => {
            const newRange = { ...prev, [type]: value }
            const newFilters = {
                ...filterValues,
                ...(newRange.from && { dateFrom: newRange.from }),
                ...(newRange.to && { dateTo: newRange.to })
            }
            // تنظيف الفلاتر الفارغة
            Object.keys(newFilters).forEach(k => {
                if (!newFilters[k]) delete newFilters[k]
            })
            // استدعاء onFilterChange
            setTimeout(() => onFilterChange?.(newFilters), 0)
            return newRange
        })
    }, [filterValues, onFilterChange])

    // معالج إعادة التعيين
    const handleReset = useCallback(() => {
        setSearchValue('')
        setFilterValues({})
        setDateRange({ from: '', to: '' })
        onSearch?.('')
        onFilterChange?.({})
    }, [onSearch, onFilterChange])

    // التحقق من وجود فلاتر نشطة
    const hasActiveFilters = 
        searchValue || 
        Object.values(filterValues).some(v => v) || 
        dateRange.from || 
        dateRange.to

    // تصفية الفلاتر حسب النوع
    const selectFilters = filters.filter(f => f.type === 'select')
    const dateFilters = filters.filter(f => f.type === 'dateRange')

    return (
        <MuiPaper elevation={0} sx={{ p: 3, mb: 3, ...sx }}>
            <MuiGrid container spacing={2} alignItems="flex-end">
                {/* حقل البحث */}
                <MuiGrid item xs={12} sm={6} md={4} lg={3}>
                    <MuiTextField
                        fullWidth
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <MuiInputAdornment position="start">
                                    <Search size={20} />
                                </MuiInputAdornment>
                            ),
                        }}
                    />
                </MuiGrid>

                {/* فلاتر الاختيار */}
                {selectFilters.map((filter) => (
                    <MuiGrid item xs={12} sm={6} md={4} lg={3} key={filter.key}>
                        <MuiSelect
                            fullWidth
                            displayEmpty
                            value={filterValues[filter.key] || ''}
                            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        >
                            <MuiMenuItem value=""> {filter.label} </MuiMenuItem>
                            {filter.options?.map((option) => (
                                <MuiMenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MuiMenuItem>
                            ))}
                        </MuiSelect>
                    </MuiGrid>
                ))}

                {/* فلاتر النطاق الزمني */}
                {dateFilters.map((filter) => (
                    <MuiGrid item container spacing={1} xs={12} md={6} lg={4} key={filter.key}>
                        <MuiGrid item xs={6}>
                            <MuiTextField
                                fullWidth
                                type="date"
                                label={`${filter.label} من`}
                                value={dateRange.from}
                                onChange={(e) => handleDateChange('from', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </MuiGrid>
                        <MuiGrid item xs={6}>
                            <MuiTextField
                                fullWidth
                                type="date"
                                label={`${filter.label} إلى`}
                                value={dateRange.to}
                                onChange={(e) => handleDateChange('to', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </MuiGrid>
                    </MuiGrid>
                ))}

                {/* أزرار الإجراءات */}
                <MuiGrid item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {showResetButton && hasActiveFilters && (
                        <MuiButton variant="outlined" startIcon={<X size={20} />} onClick={handleReset}>
                            إعادة تعيين
                        </MuiButton>
                    )}
                    {onRefresh && (
                        <MuiButton variant="outlined" startIcon={<RefreshCw size={20} />} onClick={onRefresh}>
                            تحديث
                        </MuiButton>
                    )}
                </MuiGrid>

                {/* عرض الفلاتر النشطة */}
                {hasActiveFilters && (
                    <MuiGrid item xs={12}>
                        <MuiBox sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {searchValue && <MuiChip label={`البحث: "${searchValue}"`} onDelete={() => handleSearchChange('')} size="small" />}
                            {Object.entries(filterValues).map(([key, value]) => (
                                value && (
                                    <MuiChip
                                        key={key}
                                        label={`${filters.find(f => f.key === key)?.label}: ${value}`}
                                        onDelete={() => handleFilterChange(key, '')}
                                        size="small"
                                    />
                                )
                            ))}
                            {(dateRange.from || dateRange.to) && (
                                <MuiChip
                                    label={`التاريخ: ${dateRange.from || 'N/A'} إلى ${dateRange.to || 'N/A'}`}
                                    onDelete={() => setDateRange({ from: '', to: '' })}
                                    size="small"
                                />
                            )}
                        </MuiBox>
                    </MuiGrid>
                )}
            </MuiGrid>
        </MuiPaper>
    )
}
