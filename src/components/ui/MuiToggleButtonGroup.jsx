import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

const MuiToggleButtonGroup = ({
  value,
  onChange,
  exclusive = true,
  options = [], // [{label, value, disabled}]
  size = 'medium',
  color = 'primary',
  className = '',
  ...props
}) => {
  return (
    <ToggleButtonGroup
      value={value}
      onChange={onChange}
      exclusive={exclusive}
      size={size}
      color={color}
      className={className}
      {...props}
    >
      {options.map((opt) => (
        <ToggleButton
          key={opt.value}
          value={opt.value}
          disabled={opt.disabled}
          className="!text-text-primary !border-border hover:!bg-surface-hover transition-colors"
        >
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default MuiToggleButtonGroup;
