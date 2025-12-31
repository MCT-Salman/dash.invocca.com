import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

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
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputLabelProps={{
            className: '!text-primary-500'
          }}
        />
      )}
      {...props}
    />
  );
};

export default MuiAutocomplete;
