/**
 * usePagination Hook
 * Hook لإدارة Pagination
 */

import { useState, useMemo, useCallback } from 'react'
import { PAGINATION } from '@/config/constants'

/**
 * Manage pagination state
 * @param {Object} options - Pagination options
 * @returns {Object} Pagination state and methods
 */
export function usePagination(options = {}) {
    const {
        initialPage = PAGINATION.DEFAULT_PAGE,
        initialLimit = PAGINATION.DEFAULT_LIMIT,
        totalItems = 0,
    } = options

    const [currentPage, setCurrentPage] = useState(initialPage)
    const [itemsPerPage, setItemsPerPage] = useState(initialLimit)

    // Calculate total pages
    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage) || 1
    }, [totalItems, itemsPerPage])

    // Calculate start and end indices
    const startIndex = useMemo(() => {
        return (currentPage - 1) * itemsPerPage
    }, [currentPage, itemsPerPage])

    const endIndex = useMemo(() => {
        return Math.min(startIndex + itemsPerPage, totalItems)
    }, [startIndex, itemsPerPage, totalItems])

    // Check if has next/prev page
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

    // Go to specific page
    const goToPage = useCallback((page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages))
        setCurrentPage(pageNumber)
    }, [totalPages])

    // Go to next page
    const nextPage = useCallback(() => {
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1)
        }
    }, [hasNextPage])

    // Go to previous page
    const prevPage = useCallback(() => {
        if (hasPrevPage) {
            setCurrentPage(prev => prev - 1)
        }
    }, [hasPrevPage])

    // Go to first page
    const firstPage = useCallback(() => {
        setCurrentPage(1)
    }, [])

    // Go to last page
    const lastPage = useCallback(() => {
        setCurrentPage(totalPages)
    }, [totalPages])

    // Change items per page
    const changeItemsPerPage = useCallback((newLimit) => {
        setItemsPerPage(newLimit)
        setCurrentPage(1) // Reset to first page
    }, [])

    // Reset pagination
    const reset = useCallback(() => {
        setCurrentPage(initialPage)
        setItemsPerPage(initialLimit)
    }, [initialPage, initialLimit])

    // Paginate array
    const paginateArray = useCallback((array) => {
        if (!Array.isArray(array)) return []
        return array.slice(startIndex, endIndex)
    }, [startIndex, endIndex])

    return {
        // State
        currentPage,
        itemsPerPage,
        totalPages,
        totalItems,
        startIndex,
        endIndex,
        hasNextPage,
        hasPrevPage,

        // Methods
        goToPage,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        changeItemsPerPage,
        reset,
        paginateArray,
    }
}
