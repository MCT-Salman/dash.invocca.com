// src\pages\manager\ManagerSongs.jsx
import MuiBox from '@/components/ui/MuiBox'
import MuiTypography from '@/components/ui/MuiTypography'
import { Music } from 'lucide-react'

export default function ManagerSongs() {
    return (
        <MuiBox sx={{ p: 4, textAlign: 'center' }}>
            <Music size={64} color="var(--color-icon)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <MuiTypography variant="h5" color="var(--color-text-secondary)">
                يرجى استخدام صفحة "إدارة الأغاني" الجديدة
            </MuiTypography>
        </MuiBox>
    )
}
