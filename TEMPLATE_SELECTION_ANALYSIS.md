# تحليل آلية اختيار القالب لإنشاء كرت الدعوة

## نظرة عامة
يتم اختيار القالب لإنشاء كرت الدعوة في صفحة `Invitations.jsx` من خلال مكون `InvitationCardView`.

---

## 1. State Management (إدارة الحالة)

### في المكون الرئيسي `Invitations`:
```javascript
// State for invitation card display
const [showInvitationCard, setShowInvitationCard] = useState(false)
const [selectedInvitation, setSelectedInvitation] = useState(null)
const [selectedTemplateId, setSelectedTemplateId] = useState(null)
```

- `showInvitationCard`: يتحكم في عرض/إخفاء ديالوج كرت الدعوة
- `selectedInvitation`: الدعوة المحددة لعرضها
- `selectedTemplateId`: معرف القالب المحدد من قبل المستخدم

---

## 2. جلب البيانات (Data Fetching)

### أ. جلب بيانات Dashboard:
```javascript
// Fetch dashboard to get templates
const { data: dashboardData } = useQuery({
  queryKey: QUERY_KEYS.CLIENT_DASHBOARD,
  queryFn: getClientDashboard,
  enabled: showInvitationCard, // Only fetch when viewing card
})
```

- يتم جلب البيانات من `/client/dashboard` فقط عند فتح كرت الدعوة
- الـ API: `getClientDashboard()` من `@/api/client`

### ب. بنية البيانات المسترجعة:
```javascript
const allEvents = useMemo(() => {
  const responseData = dashboardData?.data || dashboardData || {}
  return responseData.allEvents || 
         responseData.recentActivity?.events || 
         responseData.events || []
}, [dashboardData])
```

الـ Dashboard يحتوي على:
- `allEvents`: جميع الفعاليات
- `recentActivity.events`: الفعاليات الأخيرة
- `events`: الفعاليات (fallback)

---

## 3. استخراج القوالب المتاحة (Available Templates)

### أ. استخراج القوالب من الفعاليات:
```javascript
const availableTemplates = useMemo(() => {
  const templates = []
  allEvents.forEach(evt => {
    // Check for template object
    if (evt.template && typeof evt.template === 'object' && 
        !templates.find(t => (t._id || t.id) === (evt.template._id || evt.template))) {
      templates.push(evt.template)
    }
    // Check for templateId object
    if (evt.templateId && typeof evt.templateId === 'object' && 
        !templates.find(t => (t._id || t.id) === (evt.templateId._id || evt.templateId))) {
      templates.push(evt.templateId)
    }
  })
  return templates
}, [allEvents])
```

**المنطق:**
1. يتم التكرار على جميع الفعاليات (`allEvents`)
2. يتم البحث عن `template` أو `templateId` في كل فعالية
3. يتم إضافة القالب إلى القائمة إذا:
   - كان موجوداً
   - كان من نوع object
   - لم يكن موجوداً مسبقاً في القائمة (تجنب التكرار)

---

## 4. تحديد القالب المحدد (Selected Template)

### أ. أولويات اختيار القالب:
```javascript
const selectedTemplate = useMemo(() => {
  // 1. إذا اختار المستخدم قالباً من القائمة المنسدلة
  if (selectedTemplateId) {
    return availableTemplates.find(t => (t._id || t.id) === selectedTemplateId)
  }
  
  // 2. قالب الفعالية الحالية (currentEvent)
  if (currentEvent?.template && typeof currentEvent.template === 'object') 
    return currentEvent.template
  if (currentEvent?.templateId && typeof currentEvent.templateId === 'object') 
    return currentEvent.templateId
  
  // 3. قالب الفعالية من invitation.eventId
  if (invitation?.eventId?.template && typeof invitation.eventId.template === 'object') 
    return invitation.eventId.template
  if (invitation?.eventId?.templateId && typeof invitation.eventId.templateId === 'object') 
    return invitation.eventId.templateId
  
  // 4. قالب الفعالية من event
  if (event?.template && typeof event.template === 'object') 
    return event.template
  if (event?.templateId && typeof event.templateId === 'object') 
    return event.templateId
  
  // 5. أول قالب متاح (fallback)
  return availableTemplates[0] || null
}, [selectedTemplateId, availableTemplates, currentEvent, invitation, event])
```

**ترتيب الأولويات:**
1. **المستخدم يختار**: `selectedTemplateId` من القائمة المنسدلة
2. **قالب الفعالية الحالية**: `currentEvent.template` أو `currentEvent.templateId`
3. **قالب من invitation**: `invitation.eventId.template` أو `invitation.eventId.templateId`
4. **قالب من event**: `event.template` أو `event.templateId`
5. **أول قالب متاح**: `availableTemplates[0]`

---

## 5. الحصول على صورة القالب (Template Image)

### أ. استخراج صورة القالب:
```javascript
const templateImage = useMemo(() => {
  return selectedTemplate?.imageUrl || 
         selectedTemplate?.image || 
         currentEvent?.template?.imageUrl || 
         currentEvent?.template?.image ||
         currentEvent?.templateId?.imageUrl || 
         currentEvent?.templateId?.image ||
         currentEvent?.templateImage || 
         invitation?.eventId?.template?.imageUrl ||
         invitation?.eventId?.template?.image ||
         invitation?.eventId?.templateId?.imageUrl ||
         invitation?.eventId?.templateId?.image ||
         event?.template?.imageUrl ||
         event?.template?.image ||
         event?.templateId?.imageUrl ||
         event?.templateId?.image ||
         null
}, [selectedTemplate, currentEvent, invitation, event])
```

### ب. بناء URL الصورة:
```javascript
const templateImageUrl = useMemo(() => {
  return templateImage 
    ? (templateImage.startsWith('http') 
        ? templateImage 
        : `http://82.137.244.167:5001${templateImage}`)
    : null
}, [templateImage])
```

**المنطق:**
- إذا كانت الصورة تبدأ بـ `http` → استخدامها مباشرة
- وإلا → إضافة الـ base URL: `http://82.137.244.167:5001`

---

## 6. واجهة المستخدم (UI)

### أ. قائمة اختيار القالب:
```javascript
{availableTemplates.length > 0 && (
  <MuiFormControl sx={{ minWidth: 250 }}>
    <MuiInputLabel id="template-select-label">اختر القالب</MuiInputLabel>
    <MuiSelect
      labelId="template-select-label"
      value={selectedTemplateId || selectedTemplate?._id || selectedTemplate?.id || ''}
      onChange={(e) => onTemplateChange(e.target.value)}
      label="اختر القالب"
    >
      {availableTemplates.map((template) => (
        <MuiMenuItem key={template._id || template.id} value={template._id || template.id}>
          {template.templateName || template.name || 'قالب بدون اسم'}
        </MuiMenuItem>
      ))}
    </MuiSelect>
  </MuiFormControl>
)}
```

**الميزات:**
- تظهر فقط إذا كان هناك قوالب متاحة (`availableTemplates.length > 0`)
- القيمة المحددة: `selectedTemplateId` أو معرف القالب الحالي
- عند التغيير: يتم استدعاء `onTemplateChange(e.target.value)`
- عرض اسم القالب: `template.templateName` أو `template.name`

### ب. استخدام صورة القالب في الكرت:
```javascript
background: templateImageUrl
  ? `url(${templateImageUrl}) center/cover no-repeat`
  : 'linear-gradient(135deg, rgba(216, 185, 138, 0.2), rgba(255, 227, 108, 0.1))'
```

---

## 7. تدفق العمل (Workflow)

```
1. المستخدم يفتح كرت دعوة
   ↓
2. يتم جلب dashboard data (إذا لم تكن محملة)
   ↓
3. استخراج جميع القوالب من الفعاليات
   ↓
4. تحديد القالب الافتراضي حسب الأولويات
   ↓
5. عرض قائمة اختيار القالب (إذا كانت متاحة)
   ↓
6. المستخدم يختار قالباً (اختياري)
   ↓
7. تحديث selectedTemplateId
   ↓
8. إعادة حساب selectedTemplate
   ↓
9. تحديث templateImageUrl
   ↓
10. عرض الكرت بخلفية القالب المحدد
```

---

## 8. نقاط مهمة

### أ. مصادر القوالب:
- القوالب موجودة داخل الفعاليات (`events`)
- كل فعالية قد تحتوي على `template` أو `templateId`
- لا يوجد endpoint منفصل لجلب القوالب للعميل

### ب. هيكل القالب:
```javascript
{
  _id: "template_id",
  templateName: "اسم القالب",
  imageUrl: "/uploads/image.jpg",
  // أو
  image: "/uploads/image.jpg"
}
```

### ج. إعادة تعيين القالب:
```javascript
onClose={() => {
  setShowInvitationCard(false)
  setSelectedInvitation(null)
  setSelectedTemplateId(null) // إعادة تعيين القالب المحدد
}}
```

---

## 9. التحسينات المقترحة

1. **جلب القوالب من endpoint منفصل**: بدلاً من استخراجها من الفعاليات
2. **تخزين القالب المحدد**: حفظ اختيار المستخدم في localStorage
3. **معاينة القالب**: إضافة معاينة قبل التطبيق
4. **فلترة القوالب**: حسب الفعالية أو القاعة
5. **تحسين الأداء**: استخدام React.memo للقوالب

---

## 10. الملفات ذات الصلة

- `src/pages/client/Invitations.jsx` - المكون الرئيسي
- `src/api/client.js` - API functions
- `src/components/ui/MuiSelect.jsx` - مكون الاختيار
- `src/components/ui/MuiMenuItem.jsx` - عنصر القائمة

---

## الخلاصة

آلية اختيار القالب تعمل من خلال:
1. استخراج القوالب من الفعاليات في dashboard
2. تحديد القالب الافتراضي حسب الأولويات
3. السماح للمستخدم باختيار قالب من القائمة المنسدلة
4. تطبيق صورة القالب كخلفية لكرت الدعوة

