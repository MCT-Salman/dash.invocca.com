// Example usage of hall editing functionality with image management
// This demonstrates how to use the new hall editing features

import { 
    updateHallInfo, 
    uploadHallImage, 
    updateHallImage, 
    deleteHallImage, 
    setPrimaryHallImage 
} from '@/api/manager'

// Example 1: Update basic hall information
const updateHallBasicInfo = async () => {
  try {
    const hallData = {
      name: 'قاعة الوردة الذهبية المحدثة',
      location: 'الرياض، حي النخيل',
      capacity: 60,
      tables: 25,
      chairs: 25,
      description: 'قاعة فاخرة محدثة للأفراح والمناسبات الخاصة مع تجهيزات حديثة'
    }

    const result = await updateHallInfo(null, hallData)
    console.log('Hall updated successfully:', result)
    return result
  } catch (error) {
    console.error('Error updating hall:', error)
    throw error
  }
}

// Example 2: Upload a new hall image
const uploadHallImageExample = async () => {
  try {
    // Create a file input element to select image
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    return new Promise((resolve, reject) => {
      input.onchange = async (event) => {
        const file = event.target.files[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }

        // Validate file
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error('File size must be less than 5MB'))
          return
        }

        if (!file.type.startsWith('image/')) {
          reject(new Error('File must be an image'))
          return
        }

        const formData = new FormData()
        formData.append('image', file)
        
        try {
          const result = await uploadHallImage(formData)
          console.log('Image uploaded successfully:', result)
          resolve(result)
        } catch (error) {
          console.error('Error uploading image:', error)
          reject(error)
        }
      }
      
      input.click()
    })
  } catch (error) {
    console.error('Error in image upload process:', error)
    throw error
  }
}

// Example 3: Update image caption
const updateImageCaption = async (imageId, caption) => {
  try {
    const formData = new FormData()
    formData.append('caption', caption)
    
    const result = await updateHallImage(imageId, formData)
    console.log('Image caption updated successfully:', result)
    return result
  } catch (error) {
    console.error('Error updating image caption:', error)
    throw error
  }
}

// Example 4: Set primary image
const setPrimaryImageExample = async (imageId) => {
  try {
    const result = await setPrimaryHallImage(imageId)
    console.log('Primary image set successfully:', result)
    return result
  } catch (error) {
    console.error('Error setting primary image:', error)
    throw error
  }
}

// Example 5: Delete hall image
const deleteHallImageExample = async (imageId) => {
  try {
    const result = await deleteHallImage(imageId)
    console.log('Image deleted successfully:', result)
    return result
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

// Example 6: Complete hall update with images
const completeHallUpdate = async () => {
  try {
    // Step 1: Update basic hall info
    const hallData = {
      name: 'قاعة الأحلام الماسية',
      location: 'جدة، حي الروضة',
      capacity: 100,
      tables: 40,
      chairs: 40,
      description: 'قاعة فاخرة جداً مع إطلالة بحرية وتجهيزات عصرية'
    }
    
    await updateHallInfo(null, hallData)
    console.log('✅ Basic info updated')
    
    // Step 2: Upload multiple images
    const imageFiles = [
      // You would get these from file inputs
      // { file: file1, caption: 'الواجهة الرئيسية للقاعة' },
      // { file: file2, caption: 'الديكور الداخلي' },
      // { file: file3, caption: 'منطقة الاستقبال' }
    ]
    
    const uploadedImages = []
    for (const imageFile of imageFiles) {
      if (imageFile.file) {
        const formData = new FormData()
        formData.append('image', imageFile.file)
        
        const uploadResult = await uploadHallImage(formData)
        if (uploadResult?.image) {
          // Update caption if provided
          if (imageFile.caption) {
            await updateImageCaption(uploadResult.image._id, imageFile.caption)
          }
          
          uploadedImages.push(uploadResult.image)
        }
      }
    }
    
    console.log('✅ Images uploaded:', uploadedImages.length)
    
    // Step 3: Set first image as primary if any images were uploaded
    if (uploadedImages.length > 0) {
      await setPrimaryHallImage(uploadedImages[0]._id)
      console.log('✅ Primary image set')
    }
    
    return {
      success: true,
      message: 'Hall updated completely with images',
      imagesUploaded: uploadedImages.length
    }
  } catch (error) {
    console.error('Error in complete hall update:', error)
    throw error
  }
}

// Example 7: React component usage
/*
import React, { useState } from 'react'
import { 
    updateHallInfo, 
    uploadHallImage, 
    updateHallImage, 
    deleteHallImage, 
    setPrimaryHallImage 
} from '@/api/manager'
import { useNotification } from '@/hooks'

function HallEditForm({ hall, onSuccess }) {
    const { addNotification } = useNotification()
    const [formData, setFormData] = useState({
        name: hall?.name || '',
        location: hall?.location || '',
        capacity: hall?.capacity || 0,
        tables: hall?.tables || 0,
        chairs: hall?.chairs || 0,
        description: hall?.description || ''
    })
    const [images, setImages] = useState(hall?.images || [])
    const [uploading, setUploading] = useState(false)

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)
            
            const result = await uploadHallImage(formData)
            if (result?.image) {
                setImages(prev => [...prev, result.image])
                addNotification({
                    title: 'نجاح',
                    message: 'تم رفع الصورة بنجاح',
                    type: 'success'
                })
            }
        } catch (error) {
            addNotification({
                title: 'خطأ',
                message: 'فشل في رفع الصورة',
                type: 'error'
            })
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteImage = async (imageId) => {
        try {
            await deleteHallImage(imageId)
            setImages(prev => prev.filter(img => img._id !== imageId))
            addNotification({
                title: 'نجاح',
                message: 'تم حذف الصورة بنجاح',
                type: 'success'
            })
        } catch (error) {
            addNotification({
                title: 'خطأ',
                message: 'فشل في حذف الصورة',
                type: 'error'
            })
        }
    }

    const handleSetPrimary = async (imageId) => {
        try {
            await setPrimaryHallImage(imageId)
            setImages(prev => prev.map(img => ({
                ...img,
                isPrimary: img._id === imageId
            })))
            addNotification({
                title: 'نجاح',
                message: 'تم تعيين الصورة الرئيسية',
                type: 'success'
            })
        } catch (error) {
            addNotification({
                title: 'خطأ',
                message: 'فشل في تعيين الصورة الرئيسية',
                type: 'error'
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const submitData = {
                ...formData,
                images: images
            }
            
            await updateHallInfo(null, submitData)
            onSuccess()
            addNotification({
                title: 'نجاح',
                message: 'تم تحديث القاعة بنجاح',
                type: 'success'
            })
        } catch (error) {
            addNotification({
                title: 'خطأ',
                message: 'فشل في تحديث القاعة',
                type: 'error'
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="اسم القاعة"
                required
            />
            <input
                type="text"
                value={formData.location}
                onChange={handleInputChange('location')}
                placeholder="الموقع"
                required
            />
            <input
                type="number"
                value={formData.capacity}
                onChange={handleInputChange('capacity')}
                placeholder="السعة"
                required
            />
            <input
                type="number"
                value={formData.tables}
                onChange={handleInputChange('tables')}
                placeholder="عدد الطاولات"
            />
            <input
                type="number"
                value={formData.chairs}
                onChange={handleInputChange('chairs')}
                placeholder="عدد الكراسي"
            />
            <textarea
                value={formData.description}
                onChange={handleInputChange('description')}
                placeholder="الوصف"
                rows={4}
            />
            
            <div>
                <h3>الصور</h3>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                />
                {uploading && <p>جاري الرفع...</p>}
                
                <div>
                    {images.map(image => (
                        <div key={image._id}>
                            <img src={image.url} alt={image.caption} width="100" />
                            <input
                                type="text"
                                value={image.caption || ''}
                                onChange={(e) => updateImageCaption(image._id, e.target.value)}
                                placeholder="تعليق الصورة"
                            />
                            {image.isPrimary && <span>رئيسية</span>}
                            {!image.isPrimary && (
                                <button type="button" onClick={() => handleSetPrimary(image._id)}>
                                    تعيين كرئيسية
                                </button>
                            )}
                            <button type="button" onClick={() => handleDeleteImage(image._id)}>
                                حذف
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            <button type="submit" disabled={uploading}>
                حفظ التغييرات
            </button>
        </form>
    )
}

export default HallEditForm
*/

export {
  updateHallBasicInfo,
  uploadHallImageExample,
  updateImageCaption,
  setPrimaryImageExample,
  deleteHallImageExample,
  completeHallUpdate
}
