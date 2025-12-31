import FormControl from '@mui/material/FormControl';

const MuiFormControl = ({
  variant = 'outlined',
  fullWidth = true,
  size = 'medium',
  error = false,
  disabled = false,
  required = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <FormControl
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      error={error}
      disabled={disabled}
      required={required}
      className={className}
      {...props}
    >
      {children}
    </FormControl>
  );
};

export default MuiFormControl;
