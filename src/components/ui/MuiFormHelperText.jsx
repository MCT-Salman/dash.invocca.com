import FormHelperText from '@mui/material/FormHelperText';

const MuiFormHelperText = ({
  error = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <FormHelperText
      error={error}
      disabled={disabled}
      className={`!text-text-secondary !text-sm ${error ? '!text-error-500' : ''} ${className}`}
      {...props}
    >
      {children}
    </FormHelperText>
  );
};

export default MuiFormHelperText;
