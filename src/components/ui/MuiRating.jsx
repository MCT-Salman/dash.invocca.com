import Rating from '@mui/material/Rating';

const MuiRating = ({
  value,
  onChange,
  max = 5,
  precision = 1,
  size = 'medium',
  disabled = false,
  readOnly = false,
  className = '',
  ...props
}) => {
  return (
    <Rating
      value={value}
      onChange={(event, newValue) => onChange?.(newValue)}
      max={max}
      precision={precision}
      size={size}
      disabled={disabled}
      readOnly={readOnly}
      className={`!text-warning-500 ${className}`}
      {...props}
    />
  );
};

export default MuiRating;
