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
      sx={{
        backgroundColor: 'var(--color-surface-glass)',
        color: 'var(--color-text-primary)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        ...props.sx
      }}
      className={className}
      {...props}
    >
      {children}
    </AppBar>
  );
};

export default MuiAppBar;
