import AppBar from '@mui/material/AppBar';

const MuiAppBar = ({
  position = 'fixed',
  color = 'primary',
  elevation = 4,
  className = '',
  children,
  ...props
}) => {
  return (
    <AppBar
      position={position}
      color={color}
      elevation={elevation}
      className={`!bg-secondary-500 !text-primary-500 !shadow-lg !border-b-2 !border-beige-dark ${className}`}
      {...props}
    >
      {children}
    </AppBar>
  );
};

export default MuiAppBar;
