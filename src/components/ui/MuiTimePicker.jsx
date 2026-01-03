import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';

const MuiTimePicker = ({
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
  const handleChange = (newValue) => {
    if (onChange) {
      // Convert dayjs object to time string (HH:mm)
      if (newValue && dayjs.isDayjs(newValue)) {
        onChange(newValue.format('HH:mm'));
      } else {
        onChange(newValue);
      }
    }
  };

  // Convert time string to dayjs object
  const dayjsValue = value ? (dayjs.isDayjs(value) ? value : dayjs(value, 'HH:mm')) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={dayjsValue}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        className={className}
        enableAccessibleFieldDOMStructure={false}
        slots={{
          textField: TextField
        }}
        slotProps={{
          textField: {
            fullWidth,
            required,
            error,
            helperText,
            InputLabelProps: {
              shrink: true,
              sx: {
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
              }
            },
            sx: {
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px !important',
                backgroundColor: 'transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: error ? 'var(--color-error-600) !important' : 'var(--color-primary-500) !important',
                  },
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
                    borderWidth: '1px !important',
                  },
                  boxShadow: error
                    ? '0 0 0 2px rgba(239, 68, 68, 0.1)'
                    : '0 0 0 2px rgba(216, 185, 138, 0.1)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-border-dark) !important',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: error ? 'var(--color-error-500) !important' : 'rgba(216, 185, 138, 0.3) !important',
                  borderWidth: '1px !important',
                  borderRadius: '12px !important',
                },
              },
              '& .MuiInputBase-input': {
                color: '#EDEDED !important',
                fontSize: '1rem',
                padding: '14px 16px',
                fontFamily: 'var(--font-family-base)',
                direction: 'rtl',
                textAlign: 'right',
                '&:focus': {
                  color: '#EDEDED !important',
                  WebkitTextFillColor: '#EDEDED !important',
                },
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.2) !important',
                  WebkitTextFillColor: 'rgba(255, 255, 255, 0.2) !important',
                  opacity: 1,
                  fontFamily: 'var(--font-family-base)',
                },
                '&::-webkit-input-placeholder': {
                  color: 'rgba(255, 255, 255, 0.2) !important',
                  WebkitTextFillColor: 'rgba(255, 255, 255, 0.2) !important',
                  opacity: 1,
                },
                '&::-moz-placeholder': {
                  color: 'rgba(255, 255, 255, 0.2) !important',
                  opacity: 1,
                },
                '&:-ms-input-placeholder': {
                  color: 'rgba(255, 255, 255, 0.2) !important',
                  opacity: 1,
                },
                '&:-moz-placeholder': {
                  color: 'rgba(255, 255, 255, 0.2) !important',
                  opacity: 1,
                },
                '&.Mui-disabled': {
                  color: 'var(--color-text-muted) !important',
                  WebkitTextFillColor: 'var(--color-text-muted) !important',
                }
              },
              '& .MuiFormHelperText-root': {
                fontSize: '0.75rem',
                color: error ? 'var(--color-error-500)' : 'var(--color-text-secondary)',
                marginTop: '6px',
                fontFamily: 'var(--font-family-base)',
              },
              '& .MuiInputAdornment-root': {
                '& .MuiSvgIcon-root': {
                  color: '#FFFFFF !important',
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

export default MuiTimePicker;
