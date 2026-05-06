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
              backgroundColor: 'var(--color-icon) !important',
              color: 'var(--color-dark) !important',
              fontWeight: 600,
              borderColor: 'var(--color-icon) !important',
              '&:hover': {
                backgroundColor: 'var(--color-icon) !important',
                opacity: 0.9
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
