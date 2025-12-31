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
  padding: theme.spacing(3),
  backgroundColor: 'var(--color-yellow-pale, #FFF8DA)',
  border: '2px solid var(--color-secondary-200, #f5e9d2)',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
  transition: 'all 0.3s ease-out',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'var(--color-secondary-500, #D8B98A)',
    boxShadow: '-2px 0 8px rgba(216, 185, 138, 0.3)',
  },
}))

const IconWrapper = styled(MuiBox)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: 'var(--color-secondary-500, #D8B98A)',
  color: 'var(--color-primary-500, #1A1A1A)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'var(--color-secondary-600, #c4a578)',
    transform: 'scale(1.05) rotate(5deg)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
}))

const TitleSection = styled(MuiBox)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  minWidth: 0,
  '& .MuiTypography-h4': {
    color: 'var(--color-primary-500, #1A1A1A)',
    fontWeight: 700,
  },
  '& .MuiTypography-body2': {
    color: 'var(--color-secondary-900, #856c45)',
  },
}))

const ActionsSection = styled(MuiBox)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
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
  gap: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  border: '2px solid var(--color-secondary-200, #f5e9d2)',
  borderRadius: 12,
  padding: theme.spacing(1, 1.5),
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-1px)',
  },
  '& .MuiButton-root': {
    backgroundColor: 'var(--color-secondary-500, #D8B98A)',
    color: 'var(--color-primary-500, #1A1A1A)',
    borderRadius: '10px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'var(--color-secondary-600, #c4a578)',
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
}))

const Divider = styled('span')(({ theme }) => ({
  width: 1,
  height: 32,
  backgroundColor: theme.palette.divider,
  margin: `0 ${theme.spacing(1)}`,
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

