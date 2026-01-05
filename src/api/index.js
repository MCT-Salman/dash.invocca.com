// src\api\index.js
/**
 * Central API exports
 * This file exports all API functions for easy importing
 */

// Auth APIs
export * from './auth'

// Admin APIs
export * from './admin'

// Financial APIs
export * from './financial'

// Manager APIs
export * from './manager'

// Client APIs
export * from './client'

// Scanner APIs
export * from './scanner'

// Services APIs
export * from './services'

// Employees APIs
export * from './employees'

// Songs APIs
export * from './songs'

// Events APIs
export * from './events'

// API Client
export { default as api } from './apiClient'