import CircularProgress from '@mui/material/CircularProgress';

const MuiCircularProgress = ({
  size = 40,
  thickness = 3.6,
  color = 'primary',
  variant = 'indeterminate',
  value,
  className = '',
  ...props
}) => {
  return (
    <CircularProgress
      size={size}
      thickness={thickness}
      color={color}
      variant={variant}
      value={value}
      className={`!text-secondary-500 ${className}`}
      {...props}
    />
  );
};

export default MuiCircularProgress;
