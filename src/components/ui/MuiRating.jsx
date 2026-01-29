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
          color: 'var(--color-primary-500)',
        },
        '& .MuiRating-iconHover': {
          color: 'var(--color-primary-400)',
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
