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
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        phone: user.phone || '',
        password: '', // Don't pre-fill password for security
        role: user.role || ''
      })
      setPreviewImage(null)
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
      const submitData = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (key === 'password' && !formData[key]) {
            // Only include password if it's provided
            return
        }
        if (formData[key] !== undefined && formData[key] !== '') {
            submitData.append(key, formData[key])
        }
      })

      if (previewImage) {
        submitData.append('image', previewImage)
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        // could show notification here
        return
      }
      setPreviewImage(file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
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

              {/* Image Upload */}
              <MuiGrid item xs={12}>
                  <MuiTypography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--color-primary-500)' }}>
                      صورة المستخدم
                  </MuiTypography>
                  <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <MuiBox
                          sx={{
                              border: '2px dashed var(--color-border-glass)',
                              borderRadius: '12px',
                              p: 3,
                              textAlign: 'center',
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              cursor: 'pointer',
                              '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  borderColor: 'var(--color-primary-500)',
                              }
                          }}
                      >
                          <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ display: 'none' }}
                              id="user-edit-image-upload"
                          />
                          <label htmlFor="user-edit-image-upload">
                              <MuiBox sx={{ cursor: 'pointer' }}>
                                  <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                      انقر لرفع صورة أو اسحب وأفلت
                                  </MuiTypography>
                                  <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                      (PNG, JPG - الحد الأقصى 5MB)
                                  </MuiTypography>
                              </MuiBox>
                          </label>
                      </MuiBox>

                      {/* Existing Image */}
                      {user?.avatar && !previewImage && (
                          <MuiBox sx={{ position: 'relative', display: 'inline-block' }}>
                              <img
                                  src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_BASE}${user.avatar}`}
                                  alt="Current User Avatar"
                                  style={{
                                      width: '100px',
                                      height: '100px',
                                      objectFit: 'cover',
                                      borderRadius: '50%',
                                      border: '2px solid var(--color-border-glass)'
                                  }}
                              />
                              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mt: 1, display: 'block' }}>
                                  الصورة الحالية
                              </MuiTypography>
                          </MuiBox>
                      )}

                      {/* New Image Preview */}
                      {previewImage && (
                          <MuiBox sx={{ position: 'relative', display: 'inline-block' }}>
                              <img
                                  src={URL.createObjectURL(previewImage)}
                                  alt="Preview"
                                  style={{
                                      width: '100px',
                                      height: '100px',
                                      objectFit: 'cover',
                                      borderRadius: '50%',
                                      border: '2px solid var(--color-primary-500)'
                                  }}
                              />
                              <MuiBox
                                  onClick={removeImage}
                                  sx={{
                                      position: 'absolute',
                                      top: 0,
                                      right: 0,
                                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                      color: 'var(--color-text-primary)',
                                      width: 24,
                                      height: 24,
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      '&:hover': { backgroundColor: 'rgba(220, 38, 38, 1)' }
                                  }}
                              >
                                  <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
                              </MuiBox>
                          </MuiBox>
                      )}
                  </MuiBox>
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
