// src\components\ui\MuiSelect.jsx
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'error',
})(({ error }) => ({
  borderRadius: '0 !important',
  backgroundColor: 'transparent',
  color: 'var(--color-text-primary)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'var(--color-surface-hover)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'var(--color-icon) !important' : 'var(--color-border) !important',
    },
  },
  '&.Mui-focused': {
    backgroundColor: 'var(--color-surface-hover)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'var(--color-icon) !important' : 'var(--color-border) !important',
      borderWidth: '1px !important',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important',
    borderRadius: '0 !important',
  },
  border: 'none',
  borderBottom: `1px solid ${error ? 'var(--color-icon)' : 'var(--color-border)'}`,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: '-1px',
    height: '2px',
    backgroundColor: error ? 'var(--color-icon)' : 'var(--color-icon)',
    transform: 'scaleX(0)',
    transformOrigin: 'right center',
    transition: 'transform 260ms cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
  },
  '&.Mui-focused:after': {
    transform: 'scaleX(1)',
  },
  '& .MuiSelect-select': {
    color: 'var(--color-text-primary)',
    padding: '14px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'Alexandria, var(--font-family-base)',
    justifyContent: 'flex-start',
    textAlign: 'start',
  },
  '& .MuiSvgIcon-root': {
    color: 'var(--color-text-secondary)',
  },
  '&.Mui-disabled': {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-muted)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-border) !important',
    },
    '& .MuiSvgIcon-root': {
      color: 'var(--color-text-muted)',
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  borderRadius: '8px',
  margin: '4px 8px',
  color: 'var(--color-text-primary)',
  fontFamily: 'Alexandria, var(--font-family-base)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid transparent',
  '&:hover': {
    backgroundColor: 'color-mix(in srgb, var(--color-gold) 12%, transparent)',
    borderColor: 'var(--color-border)',
  },
  '&.Mui-selected': {
    backgroundColor: 'var(--color-icon) !important',
    color: 'var(--color-dark) !important',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'var(--color-icon) !important',
      opacity: 0.9,
    },
  },
}));

const MuiSelect = ({
  label,
  value,
  onChange,
  options = [],
  size = 'medium',
  variant = 'outlined',
  fullWidth = true,
  disabled = false,
  error = false,
  className = '',
  labelClassName = '',
  name,
  sx,
  children,
  ...props
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      size={size}
      className={className}
      error={error}
    >
      {label && (
        <InputLabel
          sx={{
            color: error ? 'var(--color-icon) !important' : 'var(--color-text-primary) !important',
            fontFamily: 'Alexandria, var(--font-family-base)',
            fontWeight: 700,
            fontSize: '0.95rem',
            textAlign: 'right',
            direction: 'rtl',
            right: 0,
            left: 'auto',
            transformOrigin: 'top right',
            position: 'absolute',
            top: '-8px',
            '&.Mui-focused': {
              color: error ? 'var(--color-icon) !important' : 'var(--color-text-primary) !important',
              fontWeight: 700,
            },
            '&.Mui-disabled': {
              color: 'var(--color-text-muted) !important',
            },
            '&.Mui-error': {
              color: 'var(--color-icon) !important',
            },
          }}
          className={labelClassName}
          shrink={true}
        >
          {label}
        </InputLabel>
      )}
      <StyledSelect
        label={label}
        value={value}
        onChange={onChange}
        variant={variant}
        disabled={disabled}
        name={name}
        error={error}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none !important',
          },
          ...(sx || {})
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'var(--color-paper)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              boxShadow: 'none',
              backdropFilter: 'blur(12px)',
              marginTop: '8px',
              maxHeight: '240px',
              overflow: 'auto',
              '& .MuiList-root': {
                padding: '4px',
                maxHeight: 'none',
              },
            }
          }
        }}
        {...props}
      >
        {options.length > 0 ? options.map((opt) => (
          <StyledMenuItem
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
          >
            {typeof opt.label === 'object' ? (opt.label.label || opt.label.name || String(opt.label)) : opt.label}
          </StyledMenuItem>
        )) : children}
      </StyledSelect>
    </FormControl>
  );
};

export default MuiSelect;
