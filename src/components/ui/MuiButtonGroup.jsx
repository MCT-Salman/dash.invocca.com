import ButtonGroup from '@mui/material/ButtonGroup';

const MuiButtonGroup = ({
  variant = 'outlined',
  size = 'medium',
  color = 'primary',
  orientation = 'horizontal',
  disabled = false,
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <ButtonGroup
      variant={variant}
      size={size}
      color={color}
      orientation={orientation}
      disabled={disabled}
      fullWidth={fullWidth}
      className={`!rounded-xl !border-2 !border-secondary-500 ${className}`}
      {...props}
    >
      {children}
    </ButtonGroup>
  );
};

export default MuiButtonGroup;
