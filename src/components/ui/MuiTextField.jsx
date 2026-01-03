// src\components\ui\MuiTextField.jsx
import { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const MuiTextField = ({
    // النوع الأساسي
    type = 'text',

    // القيمة
    value,
    defaultValue,

    // التسمية والمكان النائب
    label,
    placeholder,

    // الحالة
    disabled = false,
    required = false,
    readOnly = false,
    error = false,

    // الأحداث
    onChange,
    onFocus,
    onBlur,
    onKeyDown,

    // النمط والمظهر
    size = 'medium',
    variant = 'outlined',
    color = 'primary',
    className = '',
    fullWidth = true,

    // الأيقونات
    startIcon,
    endIcon,

    // إعدادات محددة حسب النوع
    // للنوع الرقمي
    min,
    max,
    step,
    allowDecimals = true,
    decimalScale,

    // للنوع النصي
    multiline = false,
    rows,
    maxRows,
    minRows,

    // للنوع password
    showPasswordToggle = true,

    // المساعدة والنص المساعد
    helperText,

    // إمكانيات الوصول
    id,
    name,
    autoComplete,

    // الإعدادات
    autoFocus = false,

    // التحقق
    pattern,
    inputMode,

    // كلاسات مخصصة لكل جزء
    labelClassName = '',      // كلاس للتسمية
    inputClassName = '',      // كلاس لحقل الإدخال نفسه
    helperTextClassName = '', // كلاس للنص المساعد
    containerClassName = '',  // كلاس للحاوية

    // الخصائص الإضافية
    ...props
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    const currentValue = value !== undefined ? value : internalValue;

    // Force text color when value changes (for loaded values)
    useEffect(() => {
        if (inputRef.current) {
            const inputElement = inputRef.current.querySelector('input') || inputRef.current.querySelector('textarea');
            if (inputElement) {
                inputElement.style.color = '#EDEDED';
                inputElement.style.WebkitTextFillColor = '#EDEDED';
            }
        }
    }, [currentValue, value]);

    // تحديد النوع الفعلي بناء على الإعدادات
    const getActualType = () => {
        if (type === 'password' && showPassword) {
            return 'text';
        }
        if (type === 'number') {
            return 'text';
        }
        return type;
    };

    const handleChange = (event) => {
        let inputValue = event.target.value;

        // معالجة خاصة للنوع الرقمي
        if (type === 'number') {
            if (allowDecimals) {
                inputValue = inputValue.replace(/[^\d.]/g, '');

                // السماح بنقطة عشرية واحدة فقط
                const decimalCount = (inputValue.match(/\./g) || []).length;
                if (decimalCount > 1) {
                    inputValue = inputValue.slice(0, -1);
                }
            } else {
                inputValue = inputValue.replace(/\D/g, '');
            }

            // التحقق من القيمة الدنيا والقصوى
            if (inputValue !== '' && inputValue !== '.') {
                const numericValue = parseFloat(inputValue);

                if (min !== undefined && numericValue < min) {
                    inputValue = min.toString();
                }

                if (max !== undefined && numericValue > max) {
                    inputValue = max.toString();
                }
            }
        }

        if (value === undefined) {
            setInternalValue(inputValue);
        }

        if (onChange) {
            // Always pass event object for compatibility with standard React patterns
            const syntheticEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: inputValue,
                    name: name || event.target.name || '',
                },
            };
            onChange(syntheticEvent);
        }
    };

    const handleFocus = (event) => {
        if (onFocus) onFocus(event);
    };

    const handleBlur = (event) => {
        // ... Logic for cleaning number inputs ...
        if (type === 'number' && currentValue !== '' && currentValue !== '.') {
            let cleanedValue = currentValue;
            if (cleanedValue === '.') cleanedValue = '';
            if (decimalScale !== undefined && cleanedValue.includes('.')) {
                const [integer, decimal] = cleanedValue.split('.');
                cleanedValue = `${integer}.${decimal.slice(0, decimalScale)}`;
            }
            if (min !== undefined && parseFloat(cleanedValue) < min) cleanedValue = min.toString();
            if (value === undefined && cleanedValue !== currentValue) setInternalValue(cleanedValue);
        }
        if (onBlur) onBlur(event);
    };

    const handleKeyDown = (event) => {
        if (type === 'number') {
            if (
                !/[0-9]|\./.test(event.key) &&
                !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
            ) {
                event.preventDefault();
            }
        }
        if (onKeyDown) onKeyDown(event);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // بناء InputProps ديناميكيًا
    const getInputProps = () => {
        const inputProps = {
            startAdornment: startIcon && (
                <InputAdornment position="start" sx={{ color: 'var(--color-primary-500)' }}>
                    {startIcon}
                </InputAdornment>
            ),
            className: inputClassName,
        };

        if (endIcon || (type === 'password' && showPasswordToggle)) {
            inputProps.endAdornment = (
                <InputAdornment position="end">
                    {type === 'password' && showPasswordToggle ? (
                        <IconButton
                            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            onClick={handleTogglePassword}
                            edge="end"
                            disabled={disabled}
                            sx={{ color: 'var(--color-text-secondary)', '&:hover': { color: 'var(--color-primary-500)' } }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    ) : (
                        endIcon
                    )}
                </InputAdornment>
            );
        }

        return inputProps;
    };

    // إعدادات inputMode بناء على النوع
    const getInputMode = () => {
        if (inputMode) return inputMode;
        if (type === 'number') return 'decimal';
        if (type === 'tel') return 'tel';
        if (type === 'email') return 'email';
        return 'text';
    };

    return (
        <div className={containerClassName} ref={inputRef}>
            <TextField
                type={getActualType()}
                value={currentValue}
                label={label}
                placeholder={placeholder || label}
                disabled={disabled}
                required={required}
                error={error}
                readOnly={readOnly}
                onInput={(e) => {
                    // Force text color aggressively using HEX to avoid variable resolution issues
                    const inputElement = e.target.querySelector('input') || e.target.querySelector('textarea') || e.target;
                    if (inputElement) {
                        inputElement.style.color = '#EDEDED';
                        inputElement.style.WebkitTextFillColor = '#EDEDED';
                        inputElement.style.fontFamily = 'var(--font-family-base)';
                        // Force placeholder color
                        inputElement.style.setProperty('--placeholder-color', 'rgba(255, 255, 255, 0.25)');
                    }

                    if (props.onInput) props.onInput(e);
                }}
                onChange={(e) => {
                    // Force text color on change
                    setTimeout(() => {
                        const inputElement = e.target.querySelector('input') || e.target.querySelector('textarea') || e.target;
                        if (inputElement) {
                            inputElement.style.color = '#EDEDED';
                            inputElement.style.WebkitTextFillColor = '#EDEDED';
                            // Force placeholder color
                            inputElement.style.setProperty('--placeholder-color', 'rgba(255, 255, 255, 0.2)');
                        }
                    }, 0);
                    handleChange(e);
                }}
                onFocus={(e) => {
                    // Force text color on focus
                    setTimeout(() => {
                        const inputElement = e.target.querySelector('input') || e.target.querySelector('textarea') || e.target;
                        if (inputElement) {
                            inputElement.style.color = '#EDEDED';
                            inputElement.style.WebkitTextFillColor = '#EDEDED';
                            // Force placeholder color
                            inputElement.style.setProperty('--placeholder-color', 'rgba(255, 255, 255, 0.2)');
                        }
                    }, 0);
                    handleFocus(e);
                }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                size={size}
                variant={variant}
                color={color}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px !important',
                        backgroundColor: 'transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: error ? 'var(--color-error-600) !important' : 'var(--color-primary-500) !important',
                            },
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
                                borderWidth: '1px !important',
                            },
                            boxShadow: error
                                ? '0 0 0 2px rgba(239, 68, 68, 0.1)'
                                : '0 0 0 2px rgba(216, 185, 138, 0.1)',
                        },
                        '&.Mui-disabled': {
                            backgroundColor: 'rgba(255, 255, 255, 0.01)',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--color-border-dark) !important',
                            },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: error ? 'var(--color-error-500) !important' : 'rgba(216, 185, 138, 0.3) !important',
                            borderWidth: '1px !important',
                            borderRadius: '12px !important',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#EDEDED !important', // Force white text (Hex)
                        fontSize: size === 'small' ? '0.875rem' : '1rem',
                        padding: size === 'small' ? '10.5px 14px' : '14px 16px',
                        fontFamily: 'var(--font-family-base)',
                        '&:focus': {
                            color: '#EDEDED !important',
                            WebkitTextFillColor: '#EDEDED !important',
                        },
                        // Date/Time picker icon styling
                        '&::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1) brightness(2)',
                            cursor: 'pointer',
                            opacity: 0.9,
                            '&:hover': {
                                opacity: 1,
                            },
                        },
                        '&::-webkit-inner-spin-button': {
                            filter: 'invert(1) brightness(2)',
                            cursor: 'pointer',
                            opacity: 0.9,
                        },
                        '&::-webkit-outer-spin-button': {
                            filter: 'invert(1) brightness(2)',
                            cursor: 'pointer',
                            opacity: 0.9,
                        },
                        '&::placeholder': {
                            color: 'rgba(255, 255, 255, 0.2) !important',
                            WebkitTextFillColor: 'rgba(255, 255, 255, 0.2) !important',
                            opacity: 1,
                            fontFamily: 'var(--font-family-base)',
                        },
                        '&::-webkit-input-placeholder': {
                            color: 'rgba(255, 255, 255, 0.2) !important',
                            WebkitTextFillColor: 'rgba(255, 255, 255, 0.2) !important',
                            opacity: 1,
                        },
                        '&::-moz-placeholder': {
                            color: 'rgba(255, 255, 255, 0.2) !important',
                            opacity: 1,
                        },
                        '&:-ms-input-placeholder': {
                            color: 'rgba(255, 255, 255, 0.2) !important',
                            opacity: 1,
                        },
                        '&:-moz-placeholder': {
                            color: 'rgba(255, 255, 255, 0.2) !important',
                            opacity: 1,
                        },
                        // TARGETING AUTOFILL SPECIFICALLY
                        '&:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0 100px var(--color-surface-dark) inset !important',
                            WebkitTextFillColor: '#EDEDED !important', // Explicit hex fallback
                            caretColor: '#EDEDED',
                            transition: 'background-color 5000s ease-in-out 0s', // Trick to delay background color change
                        },
                        // Fallback for other browsers
                        '&:autofill': {
                            WebkitBoxShadow: '0 0 0 100px var(--color-surface-dark) inset !important',
                            WebkitTextFillColor: '#EDEDED !important',
                            caretColor: '#EDEDED',
                        },
                        '&.Mui-disabled': {
                            color: 'var(--color-text-muted) !important',
                            WebkitTextFillColor: 'var(--color-text-muted) !important',
                        }
                    },
                    '& .MuiInputLabel-root': {
                        color: error ? 'var(--color-error-500)' : 'var(--color-primary-500)',
                        fontFamily: 'var(--font-family-base)',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        '&.Mui-focused': {
                            color: error ? 'var(--color-error-500)' : 'var(--color-primary-500)',
                            fontWeight: 600,
                        },
                        '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-error': {
                            color: 'var(--color-error-500)',
                        }
                    },
                    // Merge with sx prop - external sx can override base styles
                    ...(props.sx || {})
                }}
                className={className}
                fullWidth={fullWidth}
                multiline={multiline}
                rows={rows}
                maxRows={maxRows}
                minRows={minRows}
                inputProps={{
                    inputMode: getInputMode(),
                    pattern: pattern,
                    min: type === 'number' ? min : undefined,
                    max: type === 'number' ? max : undefined,
                    step: type === 'number' ? step : undefined,
                    className: inputClassName,
                    autoComplete: 'off', // Try to disable autocomplete to prevent browser styles interference
                    ...props.inputProps
                }}
                InputProps={getInputProps()}
                helperText={helperText}
                FormHelperTextProps={{
                    sx: {
                        fontSize: '0.75rem',
                        color: error ? 'var(--color-error-500)' : 'var(--color-text-secondary)',
                        marginTop: '6px',
                        fontFamily: 'var(--font-family-base)',
                    },
                    className: helperTextClassName
                }}
                InputLabelProps={{
                    sx: {
                        color: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
                        fontFamily: 'var(--font-family-base)',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        textAlign: 'right',
                        direction: 'rtl',
                        right: 0,
                        left: 'auto',
                        transformOrigin: 'top right',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        position: 'absolute',
                        top: '-8px',
                        '&.Mui-focused': {
                            color: error ? 'var(--color-error-500) !important' : 'var(--color-primary-500) !important',
                            fontWeight: 600,
                        },
                        '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.5) !important',
                        },
                        '&.Mui-error': {
                            color: 'var(--color-error-500) !important',
                        },
                    },
                    className: labelClassName,
                    shrink: true
                }}
                id={id}
                name={name}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                {...props}
            />
        </div>
    );
};

export default MuiTextField;