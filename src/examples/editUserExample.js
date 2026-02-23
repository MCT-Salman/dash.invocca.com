// Example usage of the editUser API function
// This demonstrates how to use the new editUser endpoint

import { editUser } from '@/api/admin'

// Example 1: Basic user update
const updateUserExample = async () => {
  try {
    const userId = '68f88b92fefff9749340f85f'
    const userData = {
      name: 'مدير عام',
      username: 'admin',
      phone: '123456',
      password: '123456',
      role: 'admin'
    }

    const result = await editUser(userId, userData)
    console.log('User updated successfully:', result)
    return result
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// Example 2: Update without changing password
const updateUserWithoutPassword = async () => {
  try {
    const userId = '68f88b92fefff9749340f85f'
    const userData = {
      name: 'مدير عام محدث',
      username: 'admin_updated',
      phone: '654321',
      role: 'admin'
      // Note: password field is omitted to keep existing password
    }

    const result = await editUser(userId, userData)
    console.log('User updated successfully (password unchanged):', result)
    return result
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// Example 3: Update only specific fields
const partialUpdate = async () => {
  try {
    const userId = '68f88b92fefff9749340f85f'
    const userData = {
      phone: '987654321'
      // Only update phone number
    }

    const result = await editUser(userId, userData)
    console.log('User phone updated successfully:', result)
    return result
  } catch (error) {
    console.error('Error updating user phone:', error)
    throw error
  }
}

// Export examples for testing
export {
  updateUserExample,
  updateUserWithoutPassword,
  partialUpdate
}

// Example usage in a React component:
/*
import { useState } from 'react'
import { editUser } from '@/api/admin'

function UserEditForm({ userId, initialData }) {
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await editUser(userId, formData)
      alert('تم تحديث المستخدم بنجاح!')
    } catch (error) {
      alert('حدث خطأ أثناء التحديث')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="الاسم"
      />
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        placeholder="اسم المستخدم"
      />
      <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        placeholder="رقم الهاتف"
      />
      <input
        type="password"
        value={formData.password || ''}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="كلمة المرور (اترك فارغاً إذا لم ترغب في التغيير)"
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
      >
        <option value="admin">مدير نظام</option>
        <option value="manager">مدير قاعة/صالة</option>
        <option value="client">عميل</option>
        <option value="employee">موظف</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
      </button>
    </form>
  )
}
*/
