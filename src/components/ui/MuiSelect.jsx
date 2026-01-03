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
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'var(--color-error-600) !important' : 'var(--color-primary-500) !important',
    },
  },
  '&.Mui-focused': {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    boxShadow: '0 0 0 2px rgba(216, 185, 138, 0.1)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
      borderWidth: '1px !important',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? 'var(--color-error-500) !important' : 'rgba(216, 185, 138, 0.3) !important',
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
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    color: 'var(--color-text-muted)',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-border-dark)',
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
    backgroundColor: 'rgba(216, 185, 138, 0.1)',
    color: 'var(--color-primary-500)',
    borderColor: 'var(--color-primary-500)',
    transform: 'translateX(4px)',
  },
  '&.Mui-selected': {
    backgroundColor: 'var(--color-primary-500) !important',
    color: '#000 !important',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'var(--color-primary-600) !important',
    },
  },
}));

const MuiSelect = ({
  label,
  value,
  defaultValue,
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
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            position: 'absolute',
            top: '-8px',
            '&.Mui-focused': {
              color: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
              fontWeight: 600,
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.5) !important',
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
        defaultValue={defaultValue}
        onChange={onChange}
        variant={variant}
        disabled={disabled}
        name={name}
        error={error}
        sx={{
          // Base styles from StyledSelect are already applied via styled component
          // Add additional base styles here to ensure they're always applied
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? 'var(--color-error-500) !important' : 'rgba(216, 185, 138, 0.3) !important',
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
          // Merge with sx prop - external sx can override base styles
          ...(sx || {})
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'var(--color-surface-dark)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
              marginTop: '8px',
              maxHeight: '240px', // 5 items * ~48px per item
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
