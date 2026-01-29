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
          sx={{
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-border)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'var(--color-surface-hover)',
            },
            '&.Mui-selected': {
              backgroundColor: 'var(--color-primary-500) !important',
              color: 'var(--color-text-on-primary) !important',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'var(--color-primary-600) !important',
              }
            }
          }}
        >
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default MuiToggleButtonGroup;
