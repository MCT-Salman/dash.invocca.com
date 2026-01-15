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
      dir="ltr"
      sx={{
        direction: 'ltr',
        '& .MuiRating-iconFilled': {
          color: '#faaf00',
        },
        '& .MuiRating-iconHover': {
          color: '#faaf00',
        },
        '& .MuiRating-iconEmpty': {
          color: 'var(--color-text-secondary)',
        },
        ...props.sx
      }}
      className={className}
      {...props}
    />
  );
};

export default MuiRating;
