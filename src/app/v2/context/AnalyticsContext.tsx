'use client'

import { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from 'react'

const STORAGE_KEY = 'portfolio_analytics'

export interface PageView {
  sectionId: string
  timestamp: number
  duration: number
}

export interface SessionData {
  sessionId: string
  startTime: number
  lastActivity: number
  pageViews: PageView[]
}

export interface AnalyticsData {
  sessions: SessionData[]
  totalViews: number
  lastUpdated: number
}

interface AnalyticsContextType {
  trackPageView: (sectionId: string) => void
  getAnalytics: () => AnalyticsData
  clearAnalytics: () => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function loadAnalytics(): AnalyticsData {
  if (typeof window === 'undefined') {
    return { sessions: [], totalViews: 0, lastUpdated: Date.now() }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('failed to load analytics:', e)
  }

  return { sessions: [], totalViews: 0, lastUpdated: Date.now() }
}

function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('failed to save analytics:', e)
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const sessionRef = useRef<SessionData | null>(null)
  const currentPageRef = useRef<{ sectionId: string; startTime: number } | null>(null)
  const analyticsRef = useRef<AnalyticsData>(loadAnalytics())

  // initialize session on mount
  useEffect(() => {
    const sessionId = generateSessionId()
    const now = Date.now()

    sessionRef.current = {
      sessionId,
      startTime: now,
      lastActivity: now,
      pageViews: [],
    }

    // add session to analytics
    analyticsRef.current.sessions.push(sessionRef.current)
    saveAnalytics(analyticsRef.current)

    // cleanup on unmount - finalize current page view
    return () => {
      if (currentPageRef.current && sessionRef.current) {
        const duration = Date.now() - currentPageRef.current.startTime
        sessionRef.current.pageViews.push({
          sectionId: currentPageRef.current.sectionId,
          timestamp: currentPageRef.current.startTime,
          duration,
        })
        analyticsRef.current.totalViews++
        analyticsRef.current.lastUpdated = Date.now()
        saveAnalytics(analyticsRef.current)
      }
    }
  }, [])

  const trackPageView = useCallback((sectionId: string) => {
    const now = Date.now()

    // finalize previous page view
    if (currentPageRef.current && sessionRef.current) {
      const duration = now - currentPageRef.current.startTime
      sessionRef.current.pageViews.push({
        sectionId: currentPageRef.current.sectionId,
        timestamp: currentPageRef.current.startTime,
        duration,
      })
      analyticsRef.current.totalViews++
    }

    // start tracking new page
    currentPageRef.current = {
      sectionId,
      startTime: now,
    }

    // update session activity
    if (sessionRef.current) {
      sessionRef.current.lastActivity = now
    }

    analyticsRef.current.lastUpdated = now
    saveAnalytics(analyticsRef.current)
  }, [])

  const getAnalytics = useCallback((): AnalyticsData => {
    // reload from storage to get latest
    analyticsRef.current = loadAnalytics()
    return analyticsRef.current
  }, [])

  const clearAnalytics = useCallback(() => {
    analyticsRef.current = { sessions: [], totalViews: 0, lastUpdated: Date.now() }
    saveAnalytics(analyticsRef.current)
  }, [])

  return (
    <AnalyticsContext.Provider value={{ trackPageView, getAnalytics, clearAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}
