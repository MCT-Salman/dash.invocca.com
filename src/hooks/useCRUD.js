// src\hooks\useCRUD.js
/**
 * useCRUD Hook
 * Hook قابل لإعادة الاستخدام للعمليات CRUD
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from './index'

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
        onSuccess: () => {
            success(successMessage)
            if (queryKey) {
                queryClient.invalidateQueries({ queryKey })
            }
            if (onSuccess) {
                onSuccess()
            }
        },
        onError: (err) => {
            // Extract error message from various possible locations
            // Ensure we always get a string to avoid circular reference errors
            let errorMsg = errorMessage
            try {
                if (err?.response?.data?.message) {
                    errorMsg = String(err.response.data.message)
                } else if (err?.response?.data?.error) {
                    errorMsg = String(err.response.data.error)
                } else if (err?.response?.data?.errors?.[0]?.msg) {
                    errorMsg = String(err.response.data.errors[0].msg)
                } else if (err?.message) {
                    errorMsg = String(err.message)
                }
            } catch {
                // If extraction fails, use default error message
                errorMsg = errorMessage
            }
            showError(errorMsg)
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateFn(id, data),
        onSuccess: () => {
            success(successMessage)
            if (queryKey) {
                queryClient.invalidateQueries({ queryKey })
            }
            if (onSuccess) {
                onSuccess()
            }
        },
        onError: (err) => {
            // Extract error message from various possible locations
            // Ensure we always get a string to avoid circular reference errors
            let errorMsg = errorMessage
            try {
                if (err?.response?.data?.message) {
                    errorMsg = String(err.response.data.message)
                } else if (err?.response?.data?.error) {
                    errorMsg = String(err.response.data.error)
                } else if (err?.response?.data?.errors?.[0]?.msg) {
                    errorMsg = String(err.response.data.errors[0].msg)
                } else if (err?.message) {
                    errorMsg = String(err.message)
                }
            } catch {
                // If extraction fails, use default error message
                errorMsg = errorMessage
            }
            showError(errorMsg)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteFn,
        onSuccess: () => {
            success(successMessage)
            if (queryKey) {
                queryClient.invalidateQueries({ queryKey })
            }
            if (onSuccess) {
                onSuccess()
            }
        },
        onError: (err) => {
            // Extract error message from various possible locations
            // Ensure we always get a string to avoid circular reference errors
            let errorMsg = errorMessage
            try {
                if (err?.response?.data?.message) {
                    errorMsg = String(err.response.data.message)
                } else if (err?.response?.data?.error) {
                    errorMsg = String(err.response.data.error)
                } else if (err?.response?.data?.errors?.[0]?.msg) {
                    errorMsg = String(err.response.data.errors[0].msg)
                } else if (err?.message) {
                    errorMsg = String(err.message)
                }
            } catch {
                // If extraction fails, use default error message
                errorMsg = errorMessage
            }
            showError(errorMsg)
        },
    })

    const handleCreate = async (data) => {
        try {
            const result = await createMutation.mutateAsync(data)
            return { success: true, ...result }
        } catch (error) {
            return { success: false, error }
        }
    }

    const handleUpdate = async (id, data) => {
        try {
            await updateMutation.mutateAsync({ id, data })
            return { success: true }
        } catch (error) {
            return { success: false, error }
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteMutation.mutateAsync(id)
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

