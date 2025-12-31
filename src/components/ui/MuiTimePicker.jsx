import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MuiTimePicker = ({
  label,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className = '',
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        className={className}
        slotProps={{
          textField: {
            InputLabelProps: {
              className: '!text-text-secondary'
            }
          }
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default MuiTimePicker;
