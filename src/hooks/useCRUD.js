// src\hooks\useCRUD.js
/**
 * useCRUD Hook
 * Hook قابل لإعادة الاستخدام للعمليات CRUD
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from './index'

/**
 * Helper function to check if response contains an error
 * Some APIs return status 200 with {"error": "..."} in the body
 */
function hasErrorInResponse(data) {
    try {
        // Check for error field in response
        if (data?.error) {
            return true
        }
        // Check for success: false
        if (data?.success === false) {
            return true
        }
        // Check nested error
        if (data?.data?.error) {
            return true
        }
        return false
    } catch {
        return false
    }
}

/**
 * Helper function to extract error message from response data (when status is 200 but error exists)
 */
function extractErrorFromResponse(data, defaultMessage) {
    let errorMsg = defaultMessage
    try {
        // 1. Direct error field - e.g., {"error": "عدد الأسماء أكبر من عدد الأشخاص"}
        if (data?.error && typeof data.error === 'string') {
            errorMsg = data.error
        } else if (data?.error && typeof data.error === 'object' && data.error?.message) {
            errorMsg = String(data.error.message)
        } else if (data?.error) {
            errorMsg = String(data.error)
        }
        // 2. Nested error
        else if (data?.data?.error && typeof data.data.error === 'string') {
            errorMsg = data.data.error
        } else if (data?.data?.error) {
            errorMsg = String(data.data.error)
        }
        // 3. Message field when success is false
        else if (data?.success === false && data?.message) {
            errorMsg = String(data.message)
        }
        // 4. Errors array - show all error messages
        else if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            // Collect all error messages
            const errorMessages = data.errors
                .map(error => {
                    if (error?.msg && typeof error.msg === 'string') return error.msg
                    if (error?.message && typeof error.message === 'string') return error.message
                    if (error?.error && typeof error.error === 'string') return error.error
                    if (error?.msg) return String(error.msg)
                    if (error?.message) return String(error.message)
                    if (error?.error) return String(error.error)
                    return null
                })
                .filter(Boolean)
            
            // Join all messages with newlines or show first if only one
            if (errorMessages.length > 0) {
                errorMsg = errorMessages.length === 1 
                    ? errorMessages[0] 
                    : errorMessages.join('\n')
            } else {
                const firstError = data.errors[0]
                if (firstError?.msg) errorMsg = String(firstError.msg)
                else if (firstError?.message) errorMsg = String(firstError.message)
                else if (firstError?.error) errorMsg = String(firstError.error)
            }
        }
    } catch {
        errorMsg = defaultMessage
    }
    return String(errorMsg)
}

/**
 * Helper function to extract success message from response
 */
function extractSuccessMessage(data, defaultMessage) {
    let successMsg = defaultMessage
    try {
        // Priority order for success messages:
        // 1. Direct message field
        if (data?.message && typeof data.message === 'string') {
            successMsg = data.message
        }
        // 2. data.message when success is true
        else if (data?.success === true && data?.message && typeof data.message === 'string') {
            successMsg = data.message
        }
        // 3. Nested data.message
        else if (data?.data?.message && typeof data.data.message === 'string') {
            successMsg = data.data.message
        }
        // 4. Response data message
        else if (data?.response?.data?.message && typeof data.response.data.message === 'string') {
            successMsg = data.response.data.message
        }
        // Convert to string if found but not string
        if (successMsg === defaultMessage && data?.message) {
            successMsg = String(data.message)
        }
    } catch {
        // Use default success message
        successMsg = defaultMessage
    }
    return successMsg
}

/**
 * Helper function to extract error message from error object
 */
function extractErrorMessage(err, defaultMessage) {
    let errorMsg = defaultMessage
    try {
        // Try different error message locations (priority order)
        // 1. Direct error field (most common) - e.g., {"error": "عدد الأسماء أكبر من عدد الأشخاص"}
        if (err?.response?.data?.error) {
            const errorValue = err.response.data.error
            if (typeof errorValue === 'string') {
                errorMsg = errorValue
            } else if (typeof errorValue === 'object' && errorValue?.message) {
                errorMsg = String(errorValue.message)
            } else {
                errorMsg = String(errorValue)
            }
        }
        // 2. Message field - e.g., {"message": "بيانات غير صحيحة"}
        else if (err?.response?.data?.message) {
            errorMsg = String(err.response.data.message)
        }
        // 3. Errors array - show all error messages - e.g., {"errors": [{"msg": "..."}]}
        else if (err?.response?.data?.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
            // Collect all error messages
            const errorMessages = err.response.data.errors
                .map(error => {
                    if (error?.msg && typeof error.msg === 'string') return error.msg
                    if (error?.message && typeof error.message === 'string') return error.message
                    if (error?.error && typeof error.error === 'string') return error.error
                    if (error?.msg) return String(error.msg)
                    if (error?.message) return String(error.message)
                    if (error?.error) return String(error.error)
                    return null
                })
                .filter(Boolean)
            
            // Join all messages with newlines or show first if only one
            if (errorMessages.length > 0) {
                errorMsg = errorMessages.length === 1 
                    ? errorMessages[0] 
                    : errorMessages.join('\n')
            } else {
                const firstError = err.response.data.errors[0]
                if (firstError?.msg) errorMsg = String(firstError.msg)
                else if (firstError?.message) errorMsg = String(firstError.message)
                else if (firstError?.error) errorMsg = String(firstError.error)
            }
        }
        // 4. Error object message
        else if (err?.response?.data?.error?.message) {
            errorMsg = String(err.response.data.error.message)
        }
        // 5. Generic error message
        else if (err?.message) {
            errorMsg = String(err.message)
        }
    } catch (extractError) {
        // If extraction fails, use default error message
        errorMsg = defaultMessage
    }
    // Always ensure errorMsg is a string before returning
    return String(errorMsg)
}

/**
 * useCRUD Hook
 * @param {Object} config
 * @param {Function} config.createFn - Create function
 * @param {Function} config.updateFn - Update function
 * @param {Function} config.deleteFn - Delete function
 * @param {String} config.queryKey - Query key for invalidation
 * @param {String} config.successMessage - Success message
 * @param {String} config.errorMessage - Error message
 * @returns {Object} CRUD mutations and handlers
 */
export function useCRUD({
    createFn,
    updateFn,
    deleteFn,
    queryKey,
    successMessage = 'تمت العملية بنجاح',
    errorMessage = 'حدث خطأ أثناء العملية',
    onSuccess,
}) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotification()

    const createMutation = useMutation({
        mutationFn: createFn,
        onSuccess: (data) => {
            // Check if response contains an error (some APIs return status 200 with error in body)
            if (hasErrorInResponse(data)) {
                const errorMsg = extractErrorFromResponse(data, errorMessage)
                showError(errorMsg)
                return
            }
            // Otherwise, treat as success
            const successMsg = extractSuccessMessage(data, successMessage)
            success(successMsg)
            if (queryKey) {
                queryClient.invalidateQueries({ queryKey })
            }
            if (onSuccess) {
                onSuccess(data)
            }
        },
        onError: (err) => {
            const errorMsg = extractErrorMessage(err, errorMessage)
            showError(errorMsg)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateFn(id, data),
        onSuccess: (data) => {
            // Check if response contains an error (some APIs return status 200 with error in body)
            if (hasErrorInResponse(data)) {
                const errorMsg = extractErrorFromResponse(data, errorMessage)
                showError(errorMsg)
                return
            }
            // Otherwise, treat as success
            const successMsg = extractSuccessMessage(data, successMessage)
            success(successMsg)
            if (queryKey) {
                queryClient.invalidateQueries({ queryKey })
            }
            if (onSuccess) {
                onSuccess(data)
            }
        },
        onError: (err) => {
            const errorMsg = extractErrorMessage(err, errorMessage)
            showError(errorMsg)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteFn,
        onSuccess: (data) => {
            // Check if response contains an error (some APIs return status 200 with error in body)
            if (hasErrorInResponse(data)) {
                const errorMsg = extractErrorFromResponse(data, errorMessage)
                showError(errorMsg)
                return
            }
            // Otherwise, treat as success
            const successMsg = extractSuccessMessage(data, successMessage)
            success(successMsg)
            if (queryKey) {
                queryClient.invalidateQueries({ queryKey })
            }
            if (onSuccess) {
                onSuccess(data)
            }
        },
        onError: (err) => {
            const errorMsg = extractErrorMessage(err, errorMessage)
            showError(errorMsg)
        },
    })

    const handleCreate = async (data) => {
        try {
            const result = await createMutation.mutateAsync(data)
            // Check if response contains an error (some APIs return status 200 with error in body)
            if (hasErrorInResponse(result)) {
                return { success: false, error: { response: { data: result } } }
            }
            return { success: true, ...result }
        } catch (error) {
            return { success: false, error }
        }
    }

    const handleUpdate = async (id, data) => {
        try {
            const result = await updateMutation.mutateAsync({ id, data })
            // Check if response contains an error (some APIs return status 200 with error in body)
            if (hasErrorInResponse(result)) {
                return { success: false, error: { response: { data: result } } }
            }
            return { success: true }
        } catch (error) {
            return { success: false, error }
        }
    }

    const handleDelete = async (id) => {
        try {
            const result = await deleteMutation.mutateAsync(id)
            // Check if response contains an error (some APIs return status 200 with error in body)
            if (hasErrorInResponse(result)) {
                return { success: false, error: { response: { data: result } } }
            }
            return { success: true }
        } catch (error) {
            return { success: false, error }
        }
    }

    return {
        createMutation,
        updateMutation,
        deleteMutation,
        handleCreate,
        handleUpdate,
        handleDelete,
        isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    }
}
