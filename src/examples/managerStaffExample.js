// Example usage of manager staff management functionality
// This demonstrates how to add and edit managers and scanners

import { addStaff, updateStaff, getStaff } from '@/api/manager'

// Example 1: Add a new scanner
const addScannerExample = async () => {
  try {
    const scannerData = {
      name: 'أحمد محمد',
      phone: '0501234567',
      username: 'ahmed_scanner',
      password: 'Scanner123',
      role: 'scanner'
    }

    const result = await addStaff(scannerData)
    console.log('Scanner added successfully:', result)
    return result
  } catch (error) {
    console.error('Error adding scanner:', error)
    throw error
  }
}

// Example 2: Add a new manager
const addManagerExample = async () => {
  try {
    const managerData = {
      name: 'خالد علي',
      phone: '0509876543',
      username: 'khaled_manager',
      password: 'Manager123',
      role: 'manager'
    }

    const result = await addStaff(managerData)
    console.log('Manager added successfully:', result)
    return result
  } catch (error) {
    console.error('Error adding manager:', error)
    throw error
  }
}

// Example 3: Update existing staff member
const updateStaffExample = async () => {
  try {
    const staffId = '60f88b92fefff9749340f85f'
    const updateData = {
      name: 'اسم محدث',
      phone: '0505555555',
      role: 'manager' // Change from scanner to manager
      // Note: password and username are optional when updating
      // If not provided, they won't be changed
    }

    const result = await updateStaff(staffId, updateData)
    console.log('Staff updated successfully:', result)
    return result
  } catch (error) {
    console.error('Error updating staff:', error)
    throw error
  }
}

// Example 4: Get all staff (both managers and scanners)
const getAllStaffExample = async () => {
  try {
    const result = await getStaff()
    console.log('All staff:', result)
    
    // Filter by role
    const staff = result.staff || result.data || []
    const managers = staff.filter(s => s.role === 'manager')
    const scanners = staff.filter(s => s.role === 'scanner')
    
    console.log('Managers:', managers)
    console.log('Scanners:', scanners)
    
    return { managers, scanners, all: staff }
  } catch (error) {
    console.error('Error fetching staff:', error)
    throw error
  }
}

// Example usage in React component:
/*
import { useState } from 'react'
import { addStaff, updateStaff } from '@/api/manager'

function StaffForm({ editingStaff, onSuccess }) {
  const [formData, setFormData] = useState({
    name: editingStaff?.name || '',
    phone: editingStaff?.phone || '',
    username: editingStaff?.username || '',
    password: '',
    role: editingStaff?.role || 'scanner'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingStaff) {
        // Update existing staff
        const updateData = { ...formData }
        if (!updateData.password) {
          delete updateData.password // Don't update password if empty
        }
        if (!updateData.username) {
          delete updateData.username // Don't update username if empty
        }
        await updateStaff(editingStaff._id, updateData)
      } else {
        // Add new staff
        await addStaff(formData)
      }
      
      onSuccess()
    } catch (error) {
      alert('حدث خطأ أثناء حفظ البيانات')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="الاسم"
        required
      />
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        placeholder="رقم الهاتف"
        required
      />
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        placeholder="اسم المستخدم"
        required={!editingStaff}
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder={editingStaff ? 'كلمة المرور (اتركها فارغة للحفاظ على الحالية)' : 'كلمة المرور'}
        required={!editingStaff}
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
        required
      >
        <option value="scanner">ماسح</option>
        <option value="manager">مدير</option>
      </select>
      <button type="submit">
        {editingStaff ? 'تحديث' : 'إضافة'}
      </button>
    </form>
  )
}
*/

export {
  addScannerExample,
  addManagerExample,
  updateStaffExample,
  getAllStaffExample
}
