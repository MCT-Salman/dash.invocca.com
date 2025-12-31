// src\components\shared\FormField.jsx
/**
 * FormField Component
 * مكون قالب لإعادة الاستخدام لحقول النماذج
 */

import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiFormControl from '@/components/ui/MuiFormControl'
import MuiInputLabel from '@/components/ui/MuiInputLabel'
import MuiMenuItem from '@/components/ui/MuiMenuItem'
import MuiFormHelperText from '@/components/ui/MuiFormHelperText'
import { Controller } from 'react-hook-form'

/**
 * FormField Component
 * @param {Object} props
 * @param {Object} props.control - React Hook Form control
 * @param {String} props.name - Field name
 * @param {String} props.label - Field label
 * @param {String} props.type - Field type (text, password, email, tel, number, select, textarea)
 * @param {Array} props.options - Options for select field
 * @param {Number} props.rows - Rows for textarea
 * @param {String} props.placeholder - Placeholder text
 * @param {Boolean} props.required - Required field
 * @param {Boolean} props.disabled - Disabled field
 * @param {Object} props.sx - Additional styles
 * @param {Object} props.gridItemProps - Props for MuiGrid item wrapper (e.g., { xs: 12 })
 */
export default function FormField({
    control,
    name,
    label,
    type = 'text',
    options = [],
    rows = 4,
    placeholder,
    required = false,
    disabled = false,
    sx = {},
    gridItemProps,
    ...props
}) {
    const renderField = (field, error) => {
        if (type === 'select') {
            return (
                <MuiFormControl fullWidth error={!!error} required={required} disabled={disabled} sx={sx}>
                    <MuiInputLabel>{label}</MuiInputLabel>
                    <MuiSelect
                        {...field}
                        label={label}
                        value={field.value || ''}
                    >
                        {options.map((option) => (
                            <MuiMenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MuiMenuItem>
                        ))}
                    </MuiSelect>
                    {error && <MuiFormHelperText>{error.message}</MuiFormHelperText>}
                </MuiFormControl>
            )
        }

        if (type === 'textarea') {
            return (
                <MuiTextField
                    {...field}
                    label={label}
                    type="text"
                    multiline
                    rows={rows}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                    sx={sx}
                    {...props}
                />
            )
        }

        return (
            <MuiTextField
                {...field}
                label={label}
                type={type}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                fullWidth
                sx={sx}
                {...props}
            />
        )
    }

    const fieldContent = (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => renderField(field, error)}
        />
    )

    // If gridItemProps is provided, wrap in MuiGrid item
    if (gridItemProps) {
        return (
            <MuiGrid item {...gridItemProps}>
                {fieldContent}
            </MuiGrid>
        )
    }

    // Otherwise, wrap in MuiBox
    return <MuiBox sx={sx}>{fieldContent}</MuiBox>
}

