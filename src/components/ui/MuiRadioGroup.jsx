import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

const MuiRadioGroup = ({
  label,
  name,
  value,
  defaultValue,
  onChange,
  row = false,
  options = [], // [{label, value, disabled}]
  labelClassName = '',
  className = '',
  color = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <FormControl className={className}>
      {label && (
        <FormLabel className={`!text-text-primary !font-medium ${labelClassName}`}>
          {label}
        </FormLabel>
      )}
      <RadioGroup
        row={row}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        {...props}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio color={color} size={size} className="!text-primary-600" />}
            label={opt.label}
            disabled={opt.disabled}
            className="!text-text-primary"
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default MuiRadioGroup;
