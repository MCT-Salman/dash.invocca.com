import Divider from '@mui/material/Divider';

const MuiDivider = ({
  orientation = 'horizontal',
  flexItem = false,
  textAlign,
  className = '',
  children,
  ...props
}) => {
  return (
    <Divider
      orientation={orientation}
      flexItem={flexItem}
      textAlign={children ? textAlign : undefined}
      sx={{ borderColor: 'var(--color-border)', ...props.sx }}
      className={className}
      {...props}
    >
      {children && <span style={{ color: 'var(--color-primary-500)', fontSize: '0.875rem', fontWeight: 600 }}>{children}</span>}
    </Divider>
  );
};

export default MuiDivider;
