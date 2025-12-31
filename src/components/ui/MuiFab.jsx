import Fab from '@mui/material/Fab';

const MuiFab = ({
  children,
  color = 'primary',
  size = 'large',
  variant = 'circular',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <Fab
      color={color}
      size={size}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      className={`!bg-secondary-500 hover:!bg-secondary-600 !text-primary-500 !shadow-lg hover:!shadow-2xl !transition-all !duration-300 hover:!scale-110 ${className}`}
      {...props}
    >
      {children}
    </Fab>
  );
};

export default MuiFab;
