import LinearProgress from '@mui/material/LinearProgress';

const MuiLinearProgress = ({
  variant = 'indeterminate',
  value,
  valueBuffer,
  color = 'primary',
  className = '',
  ...props
}) => {
  return (
    <LinearProgress
      variant={variant}
      value={value}
      valueBuffer={valueBuffer}
      color={color}
      className={`!bg-beige-light !rounded-full ${className}`}
      {...props}
    />
  );
};

export default MuiLinearProgress;
