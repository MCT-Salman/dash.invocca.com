import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MuiDatePicker = ({
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
      <DatePicker
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

export default MuiDatePicker;
