import Slider from '@mui/material/Slider';

const MuiSlider = ({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  marks,
  valueLabelDisplay = 'auto',
  color = 'primary',
  className = '',
  ...props
}) => {
  return (
    <Slider
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      marks={marks}
      valueLabelDisplay={valueLabelDisplay}
      color={color}
      className={`!text-primary-600 ${className}`}
      {...props}
    />
  );
};

export default MuiSlider;
