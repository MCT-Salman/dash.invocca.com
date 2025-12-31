import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MuiDateTimePicker = ({
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
      <DateTimePicker
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

export default MuiDateTimePicker;
