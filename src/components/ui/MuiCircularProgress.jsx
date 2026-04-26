import CircularProgress from '@mui/material/CircularProgress';

const MuiCircularProgress = ({
  size = 40,
  thickness = 3.6,
  color = 'primary',
  variant = 'indeterminate',
  value,
  className = '',
  sx,
  ...props
}) => {
  return (
    <CircularProgress
      size={size}
      thickness={thickness}
      color={color}
      variant={variant}
      value={value}
      className={className}
      sx={{
        color: color === 'inherit' ? 'inherit' : undefined,
        ...sx,
      }}
      {...props}
    />
  );
};

export default MuiCircularProgress;
