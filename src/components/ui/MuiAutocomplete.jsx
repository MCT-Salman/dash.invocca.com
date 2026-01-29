import Autocomplete from '@mui/material/Autocomplete';
import MuiTextField from './MuiTextField';

const MuiAutocomplete = ({
  options = [],
  value,
  onChange,
  label,
  placeholder,
  multiple = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(event, newValue) => onChange?.(newValue)}
      multiple={multiple}
      disabled={disabled}
      className={className}
      renderInput={(params) => (
        <MuiTextField
          {...params}
          label={label}
          placeholder={placeholder}
          fullWidth
        />
      )}
      PaperProps={{
        sx: {
          backgroundColor: 'var(--color-paper)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)',
          '& .MuiAutocomplete-listbox': {
            '& .MuiAutocomplete-option': {
              color: 'var(--color-text-primary)',
              '&.Mui-focused': {
                backgroundColor: 'var(--color-surface-hover)',
              },
              '&[aria-selected="true"]': {
                backgroundColor: 'var(--color-primary-500) !important',
                color: 'var(--color-text-on-primary) !important',
                fontWeight: 600
              }
            }
          }
        }
      }}
      {...props}
    />
  );
};

export default MuiAutocomplete;
