// src\components\common\PageHeader.jsx
/**
 * PageHeader Component
 * مكون موحد لعناوين الصفحات
 */

import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { styled, alpha } from '@mui/material/styles'
import MuiPagination from '@/components/ui/MuiPagination'
import MuiSelect from '@/components/ui/MuiSelect'

const HeaderContainer = styled(MuiBox)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  padding: '24px',
  backgroundColor: 'var(--color-paper)',
  border: '1px solid var(--color-border)',
  borderRadius: 16,
  boxShadow: 'var(--shadow-sm)',
  gap: '24px',
  marginBottom: '32px',
  transition: 'all 0.3s ease-out',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overflow: 'hidden',
  '&:hover': {
    boxShadow: 'var(--shadow-md)',
    transform: 'translateY(-2px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'var(--color-primary-500)',
    boxShadow: 'var(--shadow-glow)',
  },
}))

const IconWrapper = styled(MuiBox)(({ theme }) => ({
  padding: '16px',
  borderRadius: 12,
  backgroundColor: 'var(--color-primary-500)',
  color: 'var(--color-text-on-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'var(--color-primary-600)',
    transform: 'scale(1.05) rotate(5deg)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
}))

const TitleSection = styled(MuiBox)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  minWidth: 0,
  '& .MuiTypography-h4': {
    color: 'var(--color-text-primary)',
    fontWeight: 800,
  },
  '& .MuiTypography-body2': {
    color: 'var(--color-text-secondary)',
  },
}))

const ActionsSection = styled(MuiBox)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    width: 'auto',
  },
}))

const ActionsGroup = styled(MuiBox)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 12,
  padding: '8px 12px',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s ease',
  boxShadow: 'var(--shadow-xs)',
  '&:hover': {
    boxShadow: 'var(--shadow-sm)',
    transform: 'translateY(-1px)',
  },
}))

const Divider = styled('span')(({ theme }) => ({
  width: 1,
  height: 32,
  backgroundColor: 'var(--color-border)',
  margin: '0 8px',
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'inline-block',
  },
}))

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  actions,
  children,
  pagination,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions,
  className,
  actionsClassName,
  controlsClassName,
}) {
  const hasActions = Boolean(actions || children)
  const hasControls = Boolean(
    pagination || (typeof rowsPerPage !== 'undefined' && onRowsPerPageChange)
  )
  return (
    <HeaderContainer className={className}>
      <TitleSection>
        {Icon && (
          <IconWrapper>
            <Icon size={28} />
          </IconWrapper>
        )}
        <MuiBox>
          <MuiTypography
            variant="h4"
            sx={(theme) => ({
              fontWeight: 800,
              backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: 0.2,
            })}
          >
            {title}
          </MuiTypography>
          {subtitle && (
            <MuiTypography variant="body2" color="text.secondary">
              {subtitle}
            </MuiTypography>
          )}
        </MuiBox>
      </TitleSection>
      <ActionsSection>
        {hasActions && (
          <ActionsGroup className={actionsClassName}>
            {actions || children}
          </ActionsGroup>
        )}
        {hasActions && hasControls && <Divider />}
        {hasControls && (
          <ActionsGroup className={controlsClassName}>
            {typeof rowsPerPage !== 'undefined' && onRowsPerPageChange && (
              <MuiSelect
                label="عدد العناصر"
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                size="small"
                fullWidth={false}
                options={(rowsPerPageOptions || [5, 10, 20, 50]).map(v => ({ label: v, value: v }))}
                sx={{ minWidth: 120 }}
              />
            )}
            {pagination && (
              <MuiPagination
                count={pagination.count}
                page={pagination.page}
                onChange={pagination.onChange}
                // color={pagination.color || 'primary'}
                variant={pagination.variant || 'outlined'}
                shape={pagination.shape || 'rounded'}
                size={pagination.size || 'medium'}
                dir="ltr"
                className="bg-transparent text-primary-500"
              />
            )}
          </ActionsGroup>
        )}
      </ActionsSection>
    </HeaderContainer>
  )
}

