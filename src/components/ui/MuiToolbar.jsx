import Toolbar from '@mui/material/Toolbar';

const MuiToolbar = ({
  variant = 'regular',
  disableGutters = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Toolbar
      variant={variant}
      disableGutters={disableGutters}
      className={className}
      {...props}
    >
      {children}
    </Toolbar>
  );
};

export default MuiToolbar;
