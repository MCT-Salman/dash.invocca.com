// src/pages/client/components/ClientEventSelector.jsx
import React from 'react'
import MuiBox from '@/components/ui/MuiBox'
import MuiGrid from '@/components/ui/MuiGrid'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiButton from '@/components/ui/MuiButton'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import { useClient } from '@/providers/ClientProvider'

export default function ClientEventSelector({ events = [] }) {
    const { selectEvent } = useClient()

    return (
        <MuiBox sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 } }}>
            <MuiBox sx={{ mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <MuiTypography variant="h2" sx={{ 
                    fontWeight: 900, 
                    color: 'var(--color-icon)', 
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.75rem' },
                    letterSpacing: '-0.02em'
                }}>
                    مرحباً بك في INVOCCA
                </MuiTypography>
                <MuiTypography variant="h5" sx={{ 
                    color: 'var(--color-text-secondary)', 
                    maxWidth: 700, 
                    mx: 'auto',
                    lineHeight: 1.6,
                    fontWeight: 500
                }}>
                    يرجى اختيار المناسبة التي ترغب في إدارتها اليوم للبدء في تنظيم تفاصيلها
                </MuiTypography>
            </MuiBox>

            <MuiGrid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
                {events.map((event, index) => (
                    <MuiGrid item xs={12} sm={6} md={4} key={event._id || event.id || index}>
                        <MuiPaper
                            elevation={0}
                            sx={{
                                p: 0,
                                borderRadius: '40px',
                                overflow: 'hidden',
                                background: 'var(--color-paper)',
                                border: '1px solid var(--color-border)',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    transform: 'translateY(-16px)',
                                    borderColor: 'var(--color-icon)',
                                    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                                    '& .event-icon-bg': {
                                        transform: 'scale(1.1)',
                                    }
                                }
                            }}
                            onClick={() => selectEvent(event)}
                        >
                            <MuiBox sx={{ 
                                height: 180, 
                                background: 'linear-gradient(135deg, var(--color-icon) 0%, var(--color-gold) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <MuiBox className="event-icon-bg" sx={{ transition: 'transform 0.5s ease' }}>
                                    <Calendar size={64} color="rgba(255,255,255,0.2)" />
                                </MuiBox>
                            </MuiBox>

                            <MuiBox sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <MuiTypography variant="h4" sx={{ fontWeight: 800, mb: 3, textAlign: 'right' }}>
                                    {event.name || event.eventName}
                                </MuiTypography>

                                <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--color-text-secondary)', justifyContent: 'flex-start', direction: 'rtl' }}>
                                        <Calendar size={20} />
                                        <MuiTypography variant="body1" sx={{ fontWeight: 500 }}>{formatDate(event.date || event.eventDate)}</MuiTypography>
                                    </MuiBox>
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--color-text-secondary)', justifyContent: 'flex-start', direction: 'rtl' }}>
                                        <MapPin size={20} />
                                        <MuiTypography variant="body1" sx={{ fontWeight: 500 }}>{event.hallId?.name || event.hallName || 'صالة مخصصة'}</MuiTypography>
                                    </MuiBox>
                                    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--color-text-secondary)', justifyContent: 'flex-start', direction: 'rtl' }}>
                                        <Users size={20} />
                                        <MuiTypography variant="body1" sx={{ fontWeight: 500 }}>{event.capacity || event.guestCount || 0} ضيف</MuiTypography>
                                    </MuiBox>
                                </MuiBox>

                                <MuiButton
                                    fullWidth
                                    variant="contained"
                                    endIcon={<ArrowRight size={20} />}
                                    sx={{
                                        mt: 'auto',
                                        borderRadius: '20px',
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        background: 'var(--color-icon)',
                                        color: 'var(--color-dark)',
                                        '&:hover': {
                                            background: 'var(--color-gold)',
                                        }
                                    }}
                                >
                                    دخول لوحة التحكم
                                </MuiButton>
                            </MuiBox>
                        </MuiPaper>
                    </MuiGrid>
                ))}
            </MuiGrid>
        </MuiBox>
    )
}
