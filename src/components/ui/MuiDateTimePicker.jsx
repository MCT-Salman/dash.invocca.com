import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MuiDateTimePicker = ({
  label,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className = '',
  error = false,
  helperText,
  fullWidth = true,
  required = false,
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        className={className}
        slotProps={{
          textField: {
            fullWidth,
            required,
            error,
            helperText,
            InputLabelProps: {
              shrink: true,
              sx: {
                color: error ? 'var(--color-icon) !important' : 'var(--color-icon) !important',
                fontFamily: 'var(--font-family-base)',
                fontWeight: 500,
                fontSize: '0.95rem',
                textAlign: 'right',
                direction: 'rtl',
                right: 0,
                left: 'auto',
                transformOrigin: 'top right',
                textShadow: 'none',
                position: 'absolute',
                top: '-8px',
                '&.Mui-focused': {
                  color: error ? 'var(--color-icon) !important' : 'var(--color-icon) !important',
                  fontWeight: 600,
                },
                '&.Mui-disabled': {
                  color: 'var(--color-text-muted) !important',
                },
                '&.Mui-error': {
                  color: 'var(--color-icon) !important',
                },
              }
            },
            sx: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px !important',
                backgroundColor: 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'var(--color-surface-hover)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: error ? 'var(--color-icon) !important' : 'var(--color-icon) !important',
                  },
                },
                '&.Mui-focused': {
                  backgroundColor: 'var(--color-surface-hover)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: error ? 'var(--color-icon) !important' : 'var(--color-icon) !important',
                    borderWidth: '1px !important',
                  },
                },
                '&.Mui-disabled': {
                  backgroundColor: 'var(--color-surface)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-border) !important',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: error ? 'var(--color-icon) !important' : 'var(--color-border) !important',
                  borderWidth: '1px !important',
                  borderRadius: '12px !important',
                },
              },
              '& .MuiInputBase-input': {
                color: 'var(--color-text-primary) !important',
                fontSize: '1rem',
                padding: '14px 16px',
                fontFamily: 'var(--font-family-base)',
                direction: 'rtl',
                textAlign: 'right',
                '&:focus': {
                  color: 'var(--color-text-primary) !important',
                  WebkitTextFillColor: 'var(--color-text-primary) !important',
                },
                '&::placeholder': {
                  color: 'var(--color-text-muted) !important',
                  WebkitTextFillColor: 'var(--color-text-muted) !important',
                  opacity: 0.6,
                  fontFamily: 'var(--font-family-base)',
                },
                '&.Mui-disabled': {
                  color: 'var(--color-text-muted) !important',
                  WebkitTextFillColor: 'var(--color-text-muted) !important',
                }
              },
              '& .MuiFormHelperText-root': {
                fontSize: '0.75rem',
                color: error ? 'var(--color-icon)' : 'var(--color-text-secondary)',
                marginTop: '6px',
                fontFamily: 'var(--font-family-base)',
              },
              '& .MuiInputAdornment-root': {
                '& .MuiSvgIcon-root': {
                  color: 'var(--color-icon) !important',
                },
              },
            }
          }
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default MuiDateTimePicker;
