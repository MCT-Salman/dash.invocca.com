import AvatarGroup from '@mui/material/AvatarGroup';

const MuiAvatarGroup = ({
  max = 3,
  spacing = 'medium',
  total,
  className = '',
  children,
  ...props
}) => {
  return (
    <AvatarGroup
      max={max}
      spacing={spacing}
      total={total}
      className={className}
      {...props}
    >
      {children}
    </AvatarGroup>
  );
};

export default MuiAvatarGroup;
