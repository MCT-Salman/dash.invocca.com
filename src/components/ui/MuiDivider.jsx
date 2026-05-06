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
      {children && <span style={{ color: 'var(--color-icon)', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'Alexandria, var(--font-family-base)' }}>{children}</span>}
    </Divider>
  );
};

export default MuiDivider;
