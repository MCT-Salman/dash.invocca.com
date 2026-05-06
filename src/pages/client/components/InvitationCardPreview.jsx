import React from 'react'
import { QrCode } from 'lucide-react'

// ── Inline styles to avoid MUI sx limitations with ::before/::after ──────────

const GOLD = '#c8a96e'
const GOLD_LIGHT = '#d8b98a'
const GOLD_MID = '#b89050'
const CREAM = '#fdf9f3'
const DARK_TEXT = '#2a2a2a'
const SUB_TEXT = '#555555'

// SVG ornaments encoded as data URLs
const TOP_ORNAMENT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 80'%3E%3Cpath d='M0 60 Q50 20 100 50 Q150 80 200 40 Q250 0 300 50 Q350 80 400 30 L400 0 L0 0 Z' fill='%23c8a96e' fill-opacity='0.45'/%3E%3Cpath d='M0 70 Q60 30 120 60 Q180 90 240 50 Q300 10 360 55 Q390 75 400 50 L400 0 L0 0 Z' fill='%23d8b98a' fill-opacity='0.25'/%3E%3C/svg%3E")`

const BOTTOM_ORNAMENT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 80'%3E%3Cpath d='M0 20 Q50 60 100 30 Q150 0 200 40 Q250 80 300 30 Q350 0 400 50 L400 80 L0 80 Z' fill='%23c8a96e' fill-opacity='0.45'/%3E%3Cpath d='M0 10 Q60 50 120 20 Q180 -10 240 30 Q300 70 360 25 Q390 5 400 30 L400 80 L0 80 Z' fill='%23d8b98a' fill-opacity='0.25'/%3E%3C/svg%3E")`

export default function InvitationCardPreview({
    guestName,
    numOfPeople,
    eventName,
    eventDate,
    startTime,
    hallName,
    qrCodeImage,
    templateUrl,
    cardRef
}) {
    // ── Date parsing ────────────────────────────────────────────────────────
    let dayName = '', dayNum = '', monthName = '', yearStr = ''
    if (eventDate) {
        try {
            const d = new Date(eventDate)
            dayName  = new Intl.DateTimeFormat('ar-EG', { weekday: 'long'  }).format(d)
            dayNum   = new Intl.DateTimeFormat('ar-EG', { day:     'numeric'}).format(d)
            monthName= new Intl.DateTimeFormat('ar-EG', { month:   'long'  }).format(d)
            yearStr  = new Intl.DateTimeFormat('ar-EG', { year:    'numeric'}).format(d)
        } catch (e) { /* ignore */ }
    }

    // ── Background ──────────────────────────────────────────────────────────
    const isCustom = !!templateUrl
    const cardBg = isCustom
        ? { backgroundImage: `url(${templateUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {
            backgroundColor: CREAM,
            backgroundImage: `${TOP_ORNAMENT}, ${BOTTOM_ORNAMENT}`,
            backgroundPosition: 'top center, bottom center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 90px, 100% 90px',
        }

    const txt    = DARK_TEXT
    const sub    = SUB_TEXT
    const accent = isCustom ? GOLD : GOLD_MID

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div
            ref={cardRef}
            dir="rtl"
            style={{
                ...cardBg,
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '9 / 16',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                fontFamily: "'Amiri', 'Aref Ruqaa', 'Al Nile', serif",
                color: txt,
                overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
                borderRadius: '4px',
                boxSizing: 'border-box',
                padding: '0 24px 24px',
            }}
        >
            {/* ── Inner gold border frame ─────────────────────────────────── */}
            {!isCustom && (
                <div style={{
                    position: 'absolute',
                    inset: '16px',
                    border: `1px solid ${GOLD_LIGHT}`,
                    borderRadius: '2px',
                    pointerEvents: 'none',
                    zIndex: 0,
                }} />
            )}

            {/* ── Corner ornaments ────────────────────────────────────────── */}
            {!isCustom && (
                <>
                    {/* top-right */}
                    <svg style={{ position:'absolute', top:4, right:4, width:40, height:40, opacity:0.7 }}
                        viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 38 L2 2 L38 2" stroke={GOLD} strokeWidth="1.5" fill="none"/>
                        <path d="M2 20 Q10 12 20 10" stroke={GOLD} strokeWidth="0.8" fill="none"/>
                        <circle cx="2" cy="2" r="2" fill={GOLD}/>
                    </svg>
                    {/* top-left */}
                    <svg style={{ position:'absolute', top:4, left:4, width:40, height:40, opacity:0.7 }}
                        viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M38 38 L38 2 L2 2" stroke={GOLD} strokeWidth="1.5" fill="none"/>
                        <path d="M38 20 Q30 12 20 10" stroke={GOLD} strokeWidth="0.8" fill="none"/>
                        <circle cx="38" cy="2" r="2" fill={GOLD}/>
                    </svg>
                    {/* bottom-right */}
                    <svg style={{ position:'absolute', bottom:4, right:4, width:40, height:40, opacity:0.7 }}
                        viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2 L2 38 L38 38" stroke={GOLD} strokeWidth="1.5" fill="none"/>
                        <path d="M2 20 Q10 28 20 30" stroke={GOLD} strokeWidth="0.8" fill="none"/>
                        <circle cx="2" cy="38" r="2" fill={GOLD}/>
                    </svg>
                    {/* bottom-left */}
                    <svg style={{ position:'absolute', bottom:4, left:4, width:40, height:40, opacity:0.7 }}
                        viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M38 2 L38 38 L2 38" stroke={GOLD} strokeWidth="1.5" fill="none"/>
                        <path d="M38 20 Q30 28 20 30" stroke={GOLD} strokeWidth="0.8" fill="none"/>
                        <circle cx="38" cy="38" r="2" fill={GOLD}/>
                    </svg>
                </>
            )}

            {/* ── Content wrapper ─────────────────────────────────────────── */}
            <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', width:'100%', flexGrow:1 }}>

                {/* Spacer for top wave */}
                <div style={{ height: isCustom ? 16 : 70 }} />

                {/* ── Event name ──────────────────────────────────────────── */}
                <p style={{ margin:'0 0 8px', fontSize:'1.25rem', fontWeight:600, color: sub, letterSpacing:'1px' }}>
                    {eventName || 'حفل زفاف'}
                </p>

                {/* ── Decorative divider line ─────────────────────────────── */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, width:'70%' }}>
                    <div style={{ flex:1, height:'1px', background:`linear-gradient(to left, ${GOLD}, transparent)` }} />
                    <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" fill={GOLD} opacity="0.8"/></svg>
                    <div style={{ flex:1, height:'1px', background:`linear-gradient(to right, ${GOLD}, transparent)` }} />
                </div>

                {/* ── Guest name ──────────────────────────────────────────── */}
                <p style={{ margin:'0 0 4px', fontSize:'2.1rem', fontWeight:700, lineHeight:1.25, color: txt }}>
                    {guestName || 'اسم الضيف'}
                </p>
                <p style={{ margin:'0 0 16px', fontSize:'1.4rem', color: accent }}>
                    &amp; 
                </p>
                <p style={{ margin:'0 0 16px', fontSize:'1.4rem', color: accent }}>
                     كريمته
                </p>

                {/* ── Decorative divider line ─────────────────────────────── */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, width:'70%' }}>
                    <div style={{ flex:1, height:'1px', background:`linear-gradient(to left, ${GOLD}, transparent)` }} />
                    <svg width="12" height="12" viewBox="0 0 16 16"><polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" fill={GOLD} opacity="0.8"/></svg>
                    <div style={{ flex:1, height:'1px', background:`linear-gradient(to right, ${GOLD}, transparent)` }} />
                </div>

                {/* ── Date grid  (RTL: السنة | اليوم | الشهر) ─────────────── */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:16 }}>
                    {/* Year – rightmost in RTL */}
                    <div style={{ padding:'0 12px', textAlign:'center' }}>
                        <span style={{ fontSize:'1.6rem', fontWeight:600, color: txt }}>
                            {yearStr || '2025'}
                        </span>
                    </div>
                    <div style={{ width:'1px', height:44, background: accent }} />
                    {/* Day name + number – center */}
                    <div style={{ padding:'0 12px', textAlign:'center', lineHeight:1.1 }}>
                        <div style={{ fontSize:'1rem', fontWeight:600, color: txt }}>{dayName || 'السبت'}</div>
                        <div style={{ fontSize:'1.6rem', fontWeight:700, color: txt }}>{dayNum || '1'}</div>
                    </div>
                    <div style={{ width:'1px', height:44, background: accent }} />
                    {/* Month – leftmost in RTL */}
                    <div style={{ padding:'0 12px', textAlign:'center' }}>
                        <span style={{ fontSize:'1.6rem', fontWeight:600, color: txt }}>
                            {monthName || 'يناير'}
                        </span>
                    </div>
                </div>

                {/* ── Time & Hall ─────────────────────────────────────────── */}
                <p style={{ margin:'0 0 4px', fontSize:'1rem', color: sub }}>
                    نتشرف بحضوركم في تمام الساعة
                </p>
                <p style={{ margin:'0 0 4px', fontSize:'1.55rem', fontWeight:700, color: txt, direction:'ltr' }}>
                    {startTime || '7:00 pm'}
                </p>
                <p style={{ margin:'0 0 8px', fontSize:'1.15rem', fontWeight:600, color: txt }}>
                    في صالة {hallName || '...'}
                </p>
                <p style={{ margin:'0 0 0', fontSize:'1rem', color: sub }}>
                    حضوركم يسعدنا
                </p>

                {/* ── Push QR to bottom ───────────────────────────────────── */}
                <div style={{ flexGrow:1 }} />

                {/* ── Bottom row: branding + QR ───────────────────────────── */}
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', width:'100%', marginTop:12 }}>
                    {/* INVOCCA branding – bottom-right in RTL */}
                    {!isCustom && (
                        <span style={{
                            fontFamily: 'Outfit, Inter, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 300,
                            letterSpacing: '3px',
                            color: GOLD,
                            opacity: 0.7,
                            paddingBottom: 4,
                        }}>
                            INVOCCA
                        </span>
                    )}
                    {/* QR Code – bottom-left in RTL */}
                    <div style={{ background:'white', padding:4, borderRadius:6, boxShadow:'0 2px 8px rgba(0,0,0,0.1)', marginRight: isCustom ? 'auto' : 0 }}>
                        {qrCodeImage
                            ? <img src={qrCodeImage} alt="QR" style={{ width:72, height:72, display:'block' }} />
                            : <QrCode size={72} color="#1a1a1a" />
                        }
                    </div>
                </div>

                {/* Spacer for bottom wave */}
                <div style={{ height: isCustom ? 8 : 24 }} />
            </div>
        </div>
    )
}
