// src\components\dashboard\UpcomingEvents.jsx
/**
 * Upcoming Events Component - عرض الفعاليات القادمة
 */

import MuiBox from '@/components/ui/MuiBox'
import MuiPaper from '@/components/ui/MuiPaper'
import MuiTypography from '@/components/ui/MuiTypography'
import MuiChip from '@/components/ui/MuiChip'
import MuiDivider from '@/components/ui/MuiDivider'
import { Calendar, Clock, Users, MapPin } from 'lucide-react'

/**
 * Event Card - بطاقة فعالية
 */
function EventCard({ event, index }) {
  const statusColors = {
    pending: { bg: '#FFF8DA', text: '#D99B3D', label: 'قيد الانتظار' },
    confirmed: { bg: '#e0f2fe', text: '#0284c7', label: 'مؤكد' },
    in_progress: { bg: '#f3e8ff', text: '#9333ea', label: 'جاري' },
    completed: { bg: '#dcfce7', text: '#16a34a', label: 'مكتمل' },
    cancelled: { bg: '#fee2e2', text: '#dc2626', label: 'ملغي' }
  }

  const status = statusColors[event.status] || statusColors.pending

  return (
    <MuiBox
      className="group hover:bg-secondary-50 transition-all duration-300 rounded-xl"
      sx={{
        p: 3,
        borderBottom: index !== undefined ? '1px solid' : 'none',
        borderColor: 'divider',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <MuiBox className="flex items-start justify-between gap-4 mb-3">
        <MuiBox className="flex-1">
          <MuiTypography variant="h6" className="font-bold text-text-primary mb-1 group-hover:text-secondary-700 transition-colors">
            {event.eventName || event.name}
          </MuiTypography>
          <MuiTypography variant="body2" className="text-text-secondary">
            {typeof event.eventType === 'object'
              ? (event.eventType.label || event.eventType.name || String(event.eventType))
              : (event.eventType || 'فعالية')}
          </MuiTypography>
        </MuiBox>

        <MuiChip
          label={status.label}
          size="small"
          sx={{
            backgroundColor: status.bg,
            color: status.text,
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 28,
            borderRadius: '8px'
          }}
        />
      </MuiBox>

      <MuiBox className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date */}
        <MuiBox className="flex items-center gap-2">
          <Calendar size={16} className="text-secondary-500 flex-shrink-0" />
          <MuiTypography variant="body2" className="text-text-secondary">
            {event.eventDate || event.date}
          </MuiTypography>
        </MuiBox>

        {/* Time */}
        {event.startTime && (
          <MuiBox className="flex items-center gap-2">
            <Clock size={16} className="text-secondary-500 flex-shrink-0" />
            <MuiTypography variant="body2" className="text-text-secondary">
              {event.startTime} - {event.endTime}
            </MuiTypography>
          </MuiBox>
        )}

        {/* Guests */}
        {event.guestCount && (
          <MuiBox className="flex items-center gap-2">
            <Users size={16} className="text-secondary-500 flex-shrink-0" />
            <MuiTypography variant="body2" className="text-text-secondary">
              {event.guestCount} ضيف
            </MuiTypography>
          </MuiBox>
        )}

        {/* Client */}
        {event.client && (
          <MuiBox className="flex items-center gap-2">
            <MapPin size={16} className="text-secondary-500 flex-shrink-0" />
            <MuiTypography variant="body2" className="text-text-secondary">
              {event.client.name || event.clientName}
            </MuiTypography>
          </MuiBox>
        )}
      </MuiBox>
    </MuiBox>
  )
}

/**
 * Upcoming Events List
 */
export default function UpcomingEvents({ events = [], title = "الفعاليات القادمة" }) {
  if (!events || events.length === 0) {
    return (
      <MuiPaper elevation={0} className="p-8 rounded-2xl border-2 border-border bg-white text-center">
        <Calendar size={48} className="mx-auto mb-4 text-text-disabled" />
        <MuiTypography variant="h6" className="text-text-secondary mb-2">
          لا توجد فعاليات قادمة
        </MuiTypography>
        <MuiTypography variant="body2" className="text-text-disabled">
          سيتم عرض الفعاليات المجدولة هنا
        </MuiTypography>
      </MuiPaper>
    )
  }

  return (
    <MuiPaper elevation={0} className="rounded-2xl border-2 border-border bg-white overflow-hidden">
      {/* Header */}
      <MuiBox className="p-6 bg-gradient-to-r from-secondary-50 to-yellow-pale border-b-2 border-border">
        <MuiBox className="flex items-center gap-3">
          <MuiBox className="w-12 h-12 rounded-xl bg-secondary-500 flex items-center justify-center">
            <Calendar size={24} className="text-white" strokeWidth={2.5} />
          </MuiBox>
          <MuiBox>
            <MuiTypography variant="h5" className="font-bold text-text-primary">
              {title}
            </MuiTypography>
            <MuiTypography variant="body2" className="text-text-secondary">
              {events.length} فعالية مجدولة
            </MuiTypography>
          </MuiBox>
        </MuiBox>
      </MuiBox>

      {/* Events List */}
      <MuiBox>
        {events.map((event, index) => (
          <EventCard key={event._id || event.id || index} event={event} index={index} />
        ))}
      </MuiBox>
    </MuiPaper>
  )
}

