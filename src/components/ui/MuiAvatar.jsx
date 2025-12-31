import Avatar from '@mui/material/Avatar';

const MuiAvatar = ({
  alt,
  src,
  children,
  variant = 'circular',
  className = '',
  sx = {},
  ...props
}) => {
  return (
    <Avatar
      alt={alt}
      src={src}
      variant={variant}
      className={`!bg-secondary-500 !text-primary-500 !font-semibold ${className}`}
      sx={sx}
      {...props}
    >
      {children}
    </Avatar>
  );
};

export default MuiAvatar;
