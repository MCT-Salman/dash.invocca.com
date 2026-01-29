import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const MuiCheckbox = ({
    // القيمة والحالة
    //   checked = false,
    //   defaultChecked = false,

    // التسمية
    label,
    labelPlacement = 'end',
    labelClassName = '',
    labelSx = {},
    labelProps = {},

    // الحالة
    disabled = false,
    required = false,
    indeterminate = false,

    // الأحداث
    onChange,
    onFocus,
    onBlur,

    // النمط
    size = 'medium',
    color = 'primary',

    // المجموعة
    name,
    value,

    // الإعدادات
    disableRipple = false,

    // الخصائص الإضافية
    ...props
}) => {

    // إذا كان هناك تسمية، استخدم FormControlLabel
    if (label) {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        // checked={checked}
                        // defaultChecked={defaultChecked}
                        disabled={disabled}
                        required={required}
                        indeterminate={indeterminate}
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        size={size}
                        color={color}
                        name={name}
                        value={value}
                        disableRipple={disableRipple}
                        sx={{
                            color: 'var(--color-primary-500)',
                            '&.Mui-checked': {
                                color: 'var(--color-primary-500)',
                            },
                        }}
                        className="transition-colors"
                        {...props}
                    />
                }
                label={label}
                labelPlacement={labelPlacement}
                sx={{
                    '& .MuiFormControlLabel-label': {
                        color: 'var(--color-text-primary)',
                        fontWeight: 500,
                    }
                }}
                className={labelClassName}
            />
        );
    }

    // بدون تسمية
    return (
        <Checkbox
            //   checked={checked}
            //   defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            indeterminate={indeterminate}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            size={size}
            color={color}
            name={name}
            value={value}
            disableRipple={disableRipple}
            sx={{
                color: 'var(--color-primary-500)',
                '&.Mui-checked': {
                    color: 'var(--color-primary-500)',
                },
            }}
            className="rounded-md transition-colors"
            {...props}
        />
    );
};

export default MuiCheckbox;