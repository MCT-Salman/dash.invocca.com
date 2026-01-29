/**
 * Auth Layout
 * تخطيط صفحات المصادقة - تصميم محسّن
 */

import MuiBox from '@/components/ui/MuiBox';
import MuiPaper from '@/components/ui/MuiPaper';
import MuiTypography from '@/components/ui/MuiTypography';
import { SEOHead } from '@/components/common';

/**
 * Auth Layout Component
 * تخطيط أنيق لصفحات المصادقة مع تأثيرات جذابة
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - محتوى الصفحة
 * @param {string} props.title - عنوان الصفحة
 * @param {string} props.subtitle - العنوان الفرعي
 * @param {string} props.seoPageKey - مفتاح SEO للصفحة
 * @param {string} props.brandText - نص إضافي للعلامة التجارية
 */
export default function AuthLayout({
    children,
    title,
    subtitle,
    seoPageKey,
    brandText = "الحل الأمثل لإدارة وتنظيم حفلاتك ومناسباتك بكل سهولة واحترافية"
}) {
    return (
        <>
            {seoPageKey && <SEOHead pageKey={seoPageKey} />}

            <MuiBox sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'var(--color-bg)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* تأثيرات خلفية متحركة */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* دوائر متحركة */}
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-gradient-to-br from-secondary/10 to-beige-dark/10 animate-float"
                            style={{
                                width: `${100 + i * 80}px`,
                                height: `${100 + i * 80}px`,
                                top: `${15 + i * 15}%`,
                                left: `${10 + i * 10}%`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        />
                    ))}
                </div>

                {/* الجانب الأيمن - نموذج المصادقة */}
                <MuiBox sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 3, md: 4, lg: 6 },
                    position: 'relative',
                    zIndex: 10
                }}>
                    <MuiBox sx={{ width: '100%', maxWidth: '500px' }}>
                        {/* Header مع تأثيرات */}
                        {(title || subtitle) && (
                            <MuiBox sx={{ mb: 5, textAlign: 'center', position: 'relative' }}>

                                {title && (
                                    <MuiTypography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 800,
                                            mb: 2,
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-primary-500))',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: -12,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 80,
                                                height: 4,
                                                background: 'linear-gradient(90deg, transparent, var(--color-primary-500), transparent)',
                                                borderRadius: '2px',
                                            }
                                        }}
                                    >
                                        {title}
                                    </MuiTypography>
                                )}

                                {subtitle && (
                                    <MuiTypography
                                        variant="h6"
                                        sx={{
                                            color: 'var(--color-primary-400)',
                                            fontWeight: 500,
                                            mt: 3,
                                            position: 'relative',
                                            zIndex: 10,
                                            maxWidth: '400px',
                                            mx: 'auto',
                                            fontSize: { xs: '1rem', sm: '1.1rem' },
                                        }}
                                    >
                                        {subtitle}
                                    </MuiTypography>
                                )}
                            </MuiBox>
                        )}

                        {/* حاوية النموذج مع تأثيرات */}
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: { xs: 4, md: 5 },
                                borderRadius: '24px',
                                background: 'var(--color-paper)',
                                backdropFilter: 'blur(30px)',
                                WebkitBackdropFilter: 'blur(30px)',
                                border: '1px solid var(--color-border)',
                                boxShadow: 'var(--shadow-xl)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    boxShadow: 'var(--shadow-2xl)',
                                    borderColor: 'var(--color-primary-500)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    right: '-20%',
                                    width: '500px',
                                    height: '500px',
                                    background: 'radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)',
                                    opacity: 0.12,
                                    borderRadius: '50%',
                                    animation: 'pulse 4s ease-in-out infinite',
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-30%',
                                    left: '-10%',
                                    width: '400px',
                                    height: '400px',
                                    background: 'radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)',
                                    opacity: 0.08,
                                    borderRadius: '50%',
                                    animation: 'pulse 5s ease-in-out infinite',
                                }
                            }}
                        >
                            {/* محتوى النموذج */}
                            <MuiBox sx={{ position: 'relative', zIndex: 10 }}>
                                {children}
                            </MuiBox>
                        </MuiPaper>

                        {/* تذييل الصفحة */}
                        <MuiBox sx={{ mt: 4, textAlign: 'center' }}>
                            <MuiTypography
                                variant="caption"
                                sx={{
                                    color: 'var(--color-text-secondary)',
                                    display: 'block',
                                    fontSize: '0.75rem'
                                }}
                            >
                                © {new Date().getFullYear()} INVOCCA. جميع الحقوق محفوظة
                            </MuiTypography>
                        </MuiBox>
                    </MuiBox>
                </MuiBox>

                {/* الجانب الأيسر - العلامة التجارية */}
                <MuiBox sx={{
                    display: { xs: 'none', lg: 'flex' },
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%)',
                }}>
                    {/* تأثيرات خلفية متقدمة */}
                    <div className="absolute inset-0">
                        {/* شبكة خلفية */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-20" />

                        {/* موجات متحركة */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent animate-wave" />

                        {/* جسيمات متحركة */}
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-white/30 rounded-full animate-particle"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${3 + Math.random() * 4}s`,
                                }}
                            />
                        ))}
                    </div>

                    {/* محتوى العلامة التجارية */}
                    <div className="text-center z-10 !p-8 !lg:p-12 max-w-2xl animate-slideInRight">
                        {/* شعار مع تأثيرات */}
                        <div className="relative !mb-10 !mx-auto w-56 h-56">
                            {/* هالة حول الشعار */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-3xl animate-pulse-slow" />

                            {/* دائرة متحركة */}
                            {/* <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin-slow" /> */}
                            {/* <div className="absolute inset-8 border border-white/10 rounded-full animate-spin-slow-reverse" /> */}

                            {/* الشعار الرئيسي */}
                            <MuiBox
                                component="img"
                                src="/logo/invocca_icon.png"
                                alt="شعار INVOCCA"
                                className="
                                    w-full 
                                    h-full 
                                    object-contain 
                                    drop-shadow-2xl 
                                    relative 
                                    z-10 
                                    transform 
                                    hover:scale-110 
                                    hover:rotate-3 
                                    transition-all 
                                    duration-700
                                "
                            />
                        </div>

                        {/* اسم التطبيق مع تأثيرات */}
                        <MuiTypography
                            variant="h1"
                            className="
                                font-black 
                                text-white 
                                !mb-6 
                                drop-shadow-2xl
                                relative
                                bg-gradient-to-r 
                                from-white 
                                via-yellow-100 
                                to-white 
                                bg-clip-text 
                                text-transparent
                                animate-glow
                            "
                        >
                            INVOCCA
                            {/* تأثير توهج */}
                            <div className="absolute -inset-4 blur-3xl bg-white/20 opacity-50 rounded-full" />
                        </MuiTypography>

                        {/* وصف التطبيق */}
                        <MuiTypography
                            variant="h4"
                            className="
                                text-white/95 
                                font-bold 
                                !mb-6 
                                drop-shadow-lg
                                max-w-lg 
                                !mx-auto
                                relative
                                bg-gradient-to-r 
                                from-white 
                                to-yellow-100 
                                bg-clip-text 
                                text-transparent
                            "
                        >
                            تطبيق تنظيم حفلات الصالات
                        </MuiTypography>

                        {/* نص إضافي */}
                        <MuiTypography
                            variant="h6"
                            className="
                                text-white/85 
                                !mb-8 
                                leading-relaxed
                                max-w-xl 
                                !mx-auto
                                font-medium
                                relative
                                z-10
                            "
                        >
                            {brandText}
                        </MuiTypography>


                    </div>

                    {/* تصميم زاوية */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-white/5 to-transparent rounded-br-full" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-white/5 to-transparent rounded-tl-full" />
                </MuiBox>
            </MuiBox>

        </>
    );
}