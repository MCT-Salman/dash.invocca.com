import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const MuiSwitch = ({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  color = 'primary',
  size = 'medium',
  name,
  label,
  labelPlacement = 'end',
  inputProps,
  className = '',
  ...props
}) => {
  const switchComponent = (
    <Switch
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      color={color}
      size={size}
      name={name}
      inputProps={inputProps}
      className="!text-secondary-500"
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={switchComponent}
        label={label}
        labelPlacement={labelPlacement}
        className={`!text-text-primary ${className}`}
      />
    );
  }

  return <div className={className}>{switchComponent}</div>;
};

export default MuiSwitch;
