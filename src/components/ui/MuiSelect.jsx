// src\components\ui\MuiSelect.jsx
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';

const StyledSelect = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'error',
})(({ error }) => ({
  borderRadius: '12px !important',
  backgroundColor: 'transparent',
  color: 'var(--color-text-primary)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'var(--color-surface-hover)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'var(--color-error-600) !important' : 'var(--color-primary-500) !important',
    },
  },
  '&.Mui-focused': {
    backgroundColor: 'var(--color-surface-hover)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
      borderWidth: '1px !important',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? 'var(--color-error-500) !important' : 'var(--color-border) !important',
    borderWidth: '1px !important',
    borderRadius: '12px !important',
  },
  '& .MuiSelect-select': {
    color: 'var(--color-text-primary)',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid transparent',
  '&:hover': {
    backgroundColor: 'var(--color-surface-hover)',
    color: 'var(--color-primary-500)',
    borderColor: 'var(--color-primary-500)',
    transform: 'translateX(4px)',
  },
  '&.Mui-selected': {
    backgroundColor: 'var(--color-primary-500) !important',
    color: 'var(--color-text-on-primary) !important',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'var(--color-primary-600) !important',
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
            color: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
            fontFamily: 'var(--font-family-base)',
            fontWeight: 500,
            fontSize: '0.95rem',
            textAlign: 'right',
            direction: 'rtl',
            right: 0,
            left: 'auto',
            transformOrigin: 'top right',
            position: 'absolute',
            top: '-8px',
            '&.Mui-focused': {
              color: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
              fontWeight: 600,
            },
            '&.Mui-disabled': {
              color: 'var(--color-text-muted) !important',
            },
            '&.Mui-error': {
              color: 'var(--color-error-500) !important',
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
            borderColor: error ? 'var(--color-error-500) !important' : 'var(--color-border) !important',
            borderWidth: '1px !important',
            borderRadius: '12px !important',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'var(--color-error-600) !important' : 'var(--color-primary-500) !important',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
            borderWidth: '1px !important',
          },
          ...(sx || {})
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'var(--color-paper)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-xl)',
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
