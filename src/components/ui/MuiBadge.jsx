import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

const MuiBadge = ({
  children,
  badgeContent,
  max = 99,
  color = 'primary',
  variant = 'standard',
  overlap = 'rectangular',
  invisible = false,
  showZero = false,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'right',
  },

  // خصائص التخصيص الإضافية
  customColor, // لون مخصص
  customBackgroundColor, // خلفية مخصصة
  size = 'medium', // small, medium, large
  shape = 'rectangular', // rectangular, circular, rounded
  animation = 'none', // none, pulse, bounce

  // الكلاسات
  className = '',
  badgeClassName = '',

  ...props
}) => {

  // إنشاء بادج مخصص بناء على الخصائص
  const CustomBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      // الحجم
      ...(size === 'small' && {
        fontSize: 'var(--font-size-xs)',
        height: '16px',
        minWidth: '16px',
        padding: '0 4px',
      }),
      ...(size === 'medium' && {
        fontSize: 'var(--font-size-sm)',
        height: '20px',
        minWidth: '20px',
        padding: '0 6px',
      }),
      ...(size === 'large' && {
        fontSize: 'var(--font-size-base)',
        height: '24px',
        minWidth: '24px',
        padding: '0 8px',
      }),

      // الشكل
      ...(shape === 'circular' && {
        borderRadius: 'var(--radius-full)',
      }),
      ...(shape === 'rounded' && {
        borderRadius: 'var(--radius-xl)',
      }),

      // الألوان المخصصة
      ...(customBackgroundColor && {
        backgroundColor: customBackgroundColor,
      }),
      ...(customColor && {
        color: customColor,
      }),

      // الرسوم المتحركة
      ...(animation === 'pulse' && {
        animation: 'pulse 1.5s ease-in-out infinite',
      }),
      ...(animation === 'bounce' && {
        animation: 'bounce 1s ease-in-out infinite',
      }),
    },

    // تعريفات الرسوم المتحركة
    ...(animation !== 'none' && {
      '@keyframes pulse': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.1)' },
        '100%': { transform: 'scale(1)' },
      },
      '@keyframes bounce': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-4px)' },
      },
    }),
  }));

  const BadgeComponent = customColor || customBackgroundColor || size !== 'medium' || shape !== 'rectangular' || animation !== 'none'
    ? CustomBadge
    : Badge;

  return (
    <BadgeComponent
      badgeContent={badgeContent}
      max={max}
      color={color}
      variant={variant}
      overlap={overlap}
      invisible={invisible}
      showZero={showZero}
      anchorOrigin={anchorOrigin}
      className={className}
      classes={{
        badge: badgeClassName,
      }}
      {...props}
    >
      {children}
    </BadgeComponent>
  );
};

export default MuiBadge;