# INVOCCA - Invitation Management System

نظام إدارة الدعوات والمناسبات

## المميزات

- لوحة تحكم متكاملة للإدارة والموظفين والعملاء
- إدارة القاعات والخدمات
- إدارة الفعاليات والحجوزات
- نظام القوالب للدعوات
- إدارة الموظفين والعملاء
- تقارير وإحصائيات شاملة

## التقنيات المستخدمة

- React 19
- Vite
- Material-UI (MUI)
- TanStack Query
- React Router
- Zod (Validation)
- Tailwind CSS

## التثبيت

```bash
npm install
```

## التشغيل

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## التحقق من الكود

```bash
# Lint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Validate (lint + build)
npm run validate
```

## CI/CD

المشروع يحتوي على CI/CD pipeline تلقائي عبر GitHub Actions:

- **Lint**: فحص الكود تلقائياً
- **Build**: بناء المشروع
- **Security Audit**: فحص الثغرات الأمنية
- **Deploy**: نشر تلقائي عند push إلى main

## البنية

```
src/
├── api/          # API clients
├── components/   # React components
├── contexts/     # React contexts
├── hooks/        # Custom hooks
├── pages/        # Page components
├── utils/        # Utility functions
└── config/       # Configuration files
```

## المساهمة

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## الترخيص

MIT
