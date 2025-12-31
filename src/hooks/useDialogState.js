/**
 * useDialogState Hook
 * Hook قابل لإعادة الاستخدام لإدارة حالة Dialogs
 */

import { useState, useCallback } from 'react'

/**
 * useDialogState Hook
 * @param {Object} options
 * @param {String} options.initialType - Initial dialog type
 * @returns {Object} Dialog state and handlers
 */
export function useDialogState(initialType = '') {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState(initialType)
    const [selectedItem, setSelectedItem] = useState(null)

    const openDialog = useCallback((type, item = null) => {
        setDialogType(type)
        setSelectedItem(item)
        setDialogOpen(true)
    }, [])

    const closeDialog = useCallback(() => {
        setDialogOpen(false)
        setDialogType('')
        setSelectedItem(null)
    }, [])

    const openCreateDialog = useCallback(() => {
        openDialog('create')
    }, [openDialog])

    const openEditDialog = useCallback((item) => {
        openDialog('edit', item)
    }, [openDialog])

    const openViewDialog = useCallback((item) => {
        openDialog('view', item)
    }, [openDialog])

    const openDeleteDialog = useCallback((item) => {
        openDialog('delete', item)
    }, [openDialog])

    return {
        dialogOpen,
        dialogType,
        selectedItem,
        openDialog,
        closeDialog,
        openCreateDialog,
        openEditDialog,
        openViewDialog,
        openDeleteDialog,
        isCreate: dialogType === 'create',
        isEdit: dialogType === 'edit',
        isView: dialogType === 'view',
        isDelete: dialogType === 'delete',
    }
}

