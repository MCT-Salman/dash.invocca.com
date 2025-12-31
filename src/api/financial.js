// src/api/financial.js
import api from './apiClient'

// ==================== Invoices Management ====================

/**
 * GET - عرض الفواتير
 * GET /admin/financial/invoices
 */
export const getInvoices = async (params = {}) => {
  try {
    const response = await api.get('/admin/financial/invoices', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Transactions Management ====================

/**
 * GET - عرض المعاملات
 * GET /admin/financial/transactions
 */
export const getTransactions = async (params = {}) => {
  try {
    const response = await api.get('/admin/financial/transactions', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Financial Dashboard ====================

/**
 * GET - لوحة التحكم المالية
 * GET /admin/financial/dashboard
 */
export const getFinancialDashboard = async () => {
  try {
    const response = await api.get('/admin/financial/dashboard')
    return response.data
  } catch (error) {
    throw error
  }
}

// ==================== Reports ====================

/**
 * GET - تقارير مالية
 * GET /admin/financial/report
 */
export const getFinancialReport = async (params = {}) => {
  try {
    const response = await api.get('/admin/financial/report', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * GET - تقرير ملخص
 * GET /admin/financial/summary-report
 */
export const getSummaryReport = async (params = {}) => {
  try {
    const response = await api.get('/admin/financial/summary-report', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

// Export all functions
export default {
  // Invoices
  getInvoices,
  
  // Transactions
  getTransactions,
  
  // Dashboard
  getFinancialDashboard,
  
  // Reports
  getFinancialReport,
  getSummaryReport
}