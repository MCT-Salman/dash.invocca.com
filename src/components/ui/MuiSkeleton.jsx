import Skeleton from '@mui/material/Skeleton';

const MuiSkeleton = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  children,
  ...props
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      className={`!bg-beige-light ${className}`}
      {...props}
    >
      {children}
    </Skeleton>
  );
};

export default MuiSkeleton;
