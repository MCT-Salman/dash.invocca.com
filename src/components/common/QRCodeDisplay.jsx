/**
 * QRCodeDisplay Component
 * عرض QR code مع خيارات التحميل والطباعة
 */

import { useRef } from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiButton from '@/components/ui/MuiButton'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiPaper from '@/components/ui/MuiPaper'
import { Download, Printer, QrCode } from 'lucide-react'

/**
 * QRCodeDisplay Component
 * @param {Object} props
 * @param {String} props.value - QR code value
 * @param {String} props.title - Display title
 * @param {String} props.subtitle - Display subtitle
 * @param {Number} props.size - QR code size in pixels
 * @param {Boolean} props.showDownload - Show download button
 * @param {Boolean} props.showPrint - Show print button
 */
export default function QRCodeDisplay({
    value,
    title,
    subtitle,
    size = 256,
    showDownload = true,
    showPrint = true,
}) {
    const qrRef = useRef(null)

    // Generate QR code URL using a QR code API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = qrCodeUrl
        link.download = `qr-code-${value}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handlePrint = () => {
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>طباعة QR Code</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: 'Alexandria', 'Montserrat', sans-serif;
              margin: 0;
              padding: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              text-align: center;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
              margin-bottom: 20px;
              text-align: center;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${title ? `<div class="title">${title}</div>` : ''}
          ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
          <img src="${qrCodeUrl}" alt="QR Code" />
        </body>
      </html>
    `)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
            printWindow.print()
            printWindow.close()
        }, 250)
    }

    return (
        <MuiPaper sx={{
            p: 3,
            borderRadius: '24px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-paper)',
            boxShadow: 'var(--shadow-lg)'
        }}>
            <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {/* Title */}
                {title && (
                    <MuiTypography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center' }}>
                        {title}
                    </MuiTypography>
                )}

                {/* Subtitle */}
                {subtitle && (
                    <MuiTypography variant="body2" sx={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                        {subtitle}
                    </MuiTypography>
                )}

                {/* QR Code */}
                <MuiBox
                    ref={qrRef}
                    sx={{
                        p: 2,
                        backgroundColor: '#fff', // QR codes always need high contrast white bg
                        borderRadius: '16px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '2px solid var(--color-primary-500)'
                    }}
                >
                    <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        width={size}
                        height={size}
                        style={{ display: 'block' }}
                    />
                </MuiBox>

                {/* Value Display */}
                <MuiTypography
                    variant="caption"
                    sx={{
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'monospace',
                        backgroundColor: 'var(--color-surface)',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px'
                    }}
                >
                    {value}
                </MuiTypography>

                {/* Actions */}
                <MuiBox sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {showDownload && (
                        <MuiButton
                            variant="outlined"
                            start_icon={<Download size={18} />}
                            onClick={handleDownload}
                        >
                            تحميل
                        </MuiButton>
                    )}
                    {showPrint && (
                        <MuiButton
                            variant="contained"
                            start_icon={<Printer size={18} />}
                            onClick={handlePrint}
                        >
                            طباعة
                        </MuiButton>
                    )}
                </MuiBox>
            </MuiBox>
        </MuiPaper>
    )
}
