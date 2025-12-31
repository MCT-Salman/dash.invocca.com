// src\pages\employee\Scanner.jsx
import { useState } from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiButton from '@/components/ui/MuiButton'
import MuiChip from '@/components/ui/MuiChip'
import { QrCode, Camera, ShieldCheck, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { SEOHead } from '@/components/common'

export default function Scanner() {
  const [status, setStatus] = useState('idle') // idle, scanning, success, error
  const [scannedData, setScannedData] = useState(null)

  const handleScan = () => {
    setStatus('scanning')
    // Simulate scanning - replace with actual QR scanner implementation
    setTimeout(() => {
      setStatus('success')
      setScannedData({
        guestName: 'أحمد محمد',
        eventName: 'حفل زفاف',
        ticketId: 'TKT-12345',
        status: 'confirmed'
      })
    }, 2000)
  }

  const handleReset = () => {
    setStatus('idle')
    setScannedData(null)
  }

  return (
    <MuiBox sx={{ p: { xs: 2, sm: 3 } }}>
      <SEOHead title="ماسح التذاكر - INVOCCA" />

      {/* Header */}
      <MuiBox sx={{ mb: 4, textAlign: 'center' }}>
        <MuiTypography variant="h4" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
          ماسح التذاكر (QR)
        </MuiTypography>
        <MuiTypography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
          قم بتوجيه الكاميرا نحو كود الـ QR الخاص بالضيف
        </MuiTypography>
      </MuiBox>

      {/* Scanner View */}
      <MuiBox sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <MuiPaper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            aspectRatio: '1/1',
            background: status === 'scanning' ? '#000' : 'var(--color-surface-dark)',
            borderRadius: '24px',
            border: '2px solid var(--color-border-glass)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'var(--color-primary-500)',
            }
          }}
        >
          {status === 'idle' && (
            <MuiBox sx={{ textAlign: 'center', p: 3 }}>
              <MuiBox
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '16px',
                  background: 'rgba(216, 185, 138, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  border: '2px solid var(--color-primary-500)',
                }}
              >
                <Camera size={40} style={{ color: 'var(--color-primary-500)' }} />
              </MuiBox>
              <MuiButton
                variant="contained"
                onClick={handleScan}
                startIcon={<QrCode size={20} />}
                sx={{
                  background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                  color: '#000',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(216, 185, 138, 0.3)',
                }}
              >
                تفعيل الكاميرا
              </MuiButton>
            </MuiBox>
          )}

          {status === 'scanning' && (
            <MuiBox
              sx={{
                width: '80%',
                height: '80%',
                border: '2px solid var(--color-primary-500)',
                borderRadius: '12px',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'var(--color-primary-500)',
                  boxShadow: '0 0 15px var(--color-primary-500)',
                  animation: 'scan 2s ease-in-out infinite'
                },
                '@keyframes scan': {
                  '0%': { top: '0%' },
                  '50%': { top: '100%' },
                  '100%': { top: '0%' }
                }
              }}
            />
          )}

          {status === 'success' && scannedData && (
            <MuiBox sx={{ textAlign: 'center', p: 3, width: '100%' }}>
              <MuiBox
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  border: '2px solid #22c55e',
                }}
              >
                <CheckCircle2 size={40} style={{ color: '#22c55e' }} />
              </MuiBox>
              <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700, mb: 1 }}>
                تم المسح بنجاح
              </MuiTypography>
              <MuiChip
                label="مؤكد"
                sx={{
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  fontWeight: 600,
                  mb: 2,
                }}
              />
            </MuiBox>
          )}
        </MuiPaper>
      </MuiBox>

      {/* Scanned Data Display */}
      {status === 'success' && scannedData && (
        <MuiPaper
          elevation={0}
          sx={{
            p: 3,
            background: 'var(--color-surface-dark)',
            border: '1px solid var(--color-border-glass)',
            borderRadius: '16px',
            mb: 3,
          }}
        >
          <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <MuiTypography variant="h6" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 700 }}>
              معلومات التذكرة
            </MuiTypography>
            <MuiButton
              size="small"
              onClick={handleReset}
              startIcon={<X size={16} />}
              sx={{
                color: 'var(--color-text-secondary)',
                borderColor: 'var(--color-border-glass)',
              }}
              variant="outlined"
            >
              مسح جديد
            </MuiButton>
          </MuiBox>
          <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <MuiBox>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                اسم الضيف
              </MuiTypography>
              <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                {scannedData.guestName}
              </MuiTypography>
            </MuiBox>
            <MuiBox>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                اسم الفعالية
              </MuiTypography>
              <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                {scannedData.eventName}
              </MuiTypography>
            </MuiBox>
            <MuiBox>
              <MuiTypography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}>
                رقم التذكرة
              </MuiTypography>
              <MuiTypography variant="body1" sx={{ color: 'var(--color-text-primary-dark)', fontWeight: 600 }}>
                {scannedData.ticketId}
              </MuiTypography>
            </MuiBox>
          </MuiBox>
        </MuiPaper>
      )}

      {/* Action Buttons */}
      {status === 'scanning' && (
        <MuiBox sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <MuiButton
            variant="outlined"
            onClick={handleReset}
            startIcon={<X size={18} />}
            sx={{
              color: 'var(--color-text-secondary)',
              borderColor: 'var(--color-border-glass)',
              borderRadius: '12px',
              px: 3,
            }}
          >
            إلغاء
          </MuiButton>
        </MuiBox>
      )}
    </MuiBox>
  )
}
