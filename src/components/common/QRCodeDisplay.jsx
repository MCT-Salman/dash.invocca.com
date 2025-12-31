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
              font-family: 'Montserrat', sans-serif;
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
        <MuiPaper className="p-6 rounded-2xl shadow-lg border border-border bg-gradient-to-br from-white to-secondary-50">
            <MuiBox className="flex flex-col items-center gap-4">
                {/* Title */}
                {title && (
                    <MuiTypography variant="h6" className="font-bold text-text-primary text-center">
                        {title}
                    </MuiTypography>
                )}

                {/* Subtitle */}
                {subtitle && (
                    <MuiTypography variant="body2" className="text-text-secondary text-center">
                        {subtitle}
                    </MuiTypography>
                )}

                {/* QR Code */}
                <MuiBox
                    ref={qrRef}
                    className="p-4 bg-white rounded-xl shadow-md border-2 border-secondary-200"
                >
                    <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        width={size}
                        height={size}
                        className="block"
                    />
                </MuiBox>

                {/* Value Display */}
                <MuiTypography
                    variant="caption"
                    className="text-text-secondary font-mono bg-surface px-3 py-1 rounded-lg"
                >
                    {value}
                </MuiTypography>

                {/* Actions */}
                <MuiBox className="flex gap-3 mt-2">
                    {showDownload && (
                        <MuiButton
                            variant="outlined"
                            startIcon={<Download size={18} />}
                            onClick={handleDownload}
                            className="!border-secondary-500 !text-secondary-700 hover:!bg-secondary-50 transition-all duration-200"
                        >
                            تحميل
                        </MuiButton>
                    )}
                    {showPrint && (
                        <MuiButton
                            variant="contained"
                            startIcon={<Printer size={18} />}
                            onClick={handlePrint}
                            className="bg-gradient-to-br from-secondary-500 to-beige-dark hover:from-beige-dark hover:to-secondary-500 transition-all duration-300"
                        >
                            طباعة
                        </MuiButton>
                    )}
                </MuiBox>
            </MuiBox>
        </MuiPaper>
    )
}
