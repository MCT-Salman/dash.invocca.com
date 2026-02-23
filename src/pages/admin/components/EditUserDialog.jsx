import { useState, useEffect } from 'react'
import MuiDialog from '@/components/ui/MuiDialog'
import MuiDialogTitle from '@/components/ui/MuiDialogTitle'
import MuiDialogContent from '@/components/ui/MuiDialogContent'
import MuiDialogActions from '@/components/ui/MuiDialogActions'
import MuiButton from '@/components/ui/MuiButton'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiTextField from '@/components/ui/MuiTextField'
import MuiSelect from '@/components/ui/MuiSelect'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiIconButton from '@/components/ui/MuiIconButton'
import { X, Save, User, Phone, Shield, Lock } from 'lucide-react'
import { editUser } from '@/api/admin'
import { USER_ROLES } from '@/config/constants'

export default function EditUserDialog({ open, onClose, user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    password: '',
    role: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        phone: user.phone || '',
        password: '', // Don't pre-fill password for security
        role: user.role || ''
      })
    }
  }, [user])

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSubmit = async () => {
    if (!user?._id && !user?.id) return

    setLoading(true)
    try {
      const userId = user._id || user.id
      const submitData = { ...formData }
      
      // Only include password if it's provided
      if (!submitData.password) {
        delete submitData.password
      }

      await editUser(userId, submitData)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { label: 'مدير نظام', value: USER_ROLES.ADMIN },
    { label: 'مدير قاعة/صالة', value: USER_ROLES.MANAGER },
    { label: 'عميل', value: USER_ROLES.CLIENT },
    { label: 'موظف', value: USER_ROLES.EMPLOYEE }
  ]

  return (
    <MuiDialog
      open={open && !!user}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: 'var(--color-surface-dark)',
          backgroundImage: 'none',
          border: '1px solid var(--color-border-glass)',
          zIndex: 1300
        }
      }}
    >
      {user ? (
        <>
          <MuiDialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            backgroundColor: 'var(--color-surface-dark)',
            borderBottom: '1px solid var(--color-border-glass)'
          }}>
            <MuiTypography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary-dark)' }}>
              تعديل بيانات المستخدم
            </MuiTypography>
            <MuiIconButton onClick={onClose} size="small">
              <X size={20} />
            </MuiIconButton>
          </MuiDialogTitle>

          <MuiDialogContent sx={{ p: 3 }}>
            <MuiGrid container spacing={3}>
              {/* Name Field */}
              <MuiGrid item xs={12}>
                <MuiTextField
                  fullWidth
                  label="الاسم الكامل"
                  value={formData.name}
                  onChange={handleChange('name')}
                  startIcon={<User size={20} />}
                  placeholder="أدخل الاسم الكامل"
                />
              </MuiGrid>

              {/* Username Field */}
              <MuiGrid item xs={12}>
                <MuiTextField
                  fullWidth
                  label="اسم المستخدم"
                  value={formData.username}
                  onChange={handleChange('username')}
                  startIcon={<User size={20} />}
                  placeholder="أدخل اسم المستخدم"
                />
              </MuiGrid>

              {/* Phone Field */}
              <MuiGrid item xs={12}>
                <MuiTextField
                  fullWidth
                  label="رقم الهاتف"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  startIcon={<Phone size={20} />}
                  placeholder="أدخل رقم الهاتف"
                />
              </MuiGrid>

              {/* Password Field */}
              <MuiGrid item xs={12}>
                <MuiTextField
                  fullWidth
                  label="كلمة المرور"
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  startIcon={<Lock size={20} />}
                  placeholder="اتركه فارغاً إذا لم ترغب في تغييره"
                />
              </MuiGrid>

              {/* Role Field */}
              <MuiGrid item xs={12}>
                <MuiSelect
                  fullWidth
                  label="الدور"
                  value={formData.role}
                  onChange={handleChange('role')}
                  options={roleOptions}
                  startIcon={<Shield size={20} />}
                />
              </MuiGrid>
            </MuiGrid>
          </MuiDialogContent>

          <MuiDialogActions sx={{ 
            p: 3, 
            backgroundColor: 'var(--color-surface-dark)',
            borderTop: '1px solid var(--color-border-glass)',
            gap: 1
          }}>
            <MuiButton 
              onClick={onClose} 
              variant="outlined"
              disabled={loading}
            >
              إلغاء
            </MuiButton>
            <MuiButton
              onClick={handleSubmit}
              variant="contained"
              startIcon={<Save size={18} />}
              loading={loading}
              disabled={!formData.name || !formData.username || !formData.phone || !formData.role}
            >
              حفظ التعديلات
            </MuiButton>
          </MuiDialogActions>
        </>
      ) : null}
    </MuiDialog>
  )
}
