// src/providers/ClientProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const ClientContext = createContext(null)

export function ClientProvider({ children }) {
    const [selectedEventId, setSelectedEventId] = useState(() => {
        return localStorage.getItem('selectedEventId') || null
    })

    const [selectedEvent, setSelectedEvent] = useState(null)

    useEffect(() => {
        if (selectedEventId) {
            localStorage.setItem('selectedEventId', selectedEventId)
        } else {
            localStorage.removeItem('selectedEventId')
        }
    }, [selectedEventId])

    const selectEvent = (event) => {
        if (event) {
            setSelectedEventId(event._id || event.id)
            setSelectedEvent(event)
        } else {
            setSelectedEventId(null)
            setSelectedEvent(null)
        }
    }

    const value = {
        selectedEventId,
        selectedEvent,
        setSelectedEvent,
        selectEvent
    }

    return (
        <ClientContext.Provider value={value}>
            {children}
        </ClientContext.Provider>
    )
}

export function useClient() {
    const context = useContext(ClientContext)
    if (!context) {
        throw new Error('useClient must be used within a ClientProvider')
    }
    return context
}
