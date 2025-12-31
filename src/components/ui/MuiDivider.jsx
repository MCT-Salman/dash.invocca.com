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
      className={`!border-beige-light ${className}`}
      {...props}
    >
      {children && <span className="!text-primary-500 !text-sm !font-semibold">{children}</span>}
    </Divider>
  );
};

export default MuiDivider;
