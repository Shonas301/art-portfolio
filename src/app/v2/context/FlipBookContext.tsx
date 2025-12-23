'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react'
import { TOTAL_PAGES } from '../data/portfolio-content'

export interface FlipBookState {
  currentPageIndex: number
  isFlipping: boolean
  isRiffling: boolean
  targetPageIndex: number | null
  viewMode: 'grid' | 'carousel'
  resumeOpen: boolean
  prefersReducedMotion: boolean
  debugMode: boolean
  scrollAccumulator: number
  scrollVelocity: number
  isEngaged: boolean
  bendingPages: BendingPage[]
  releasedPages: ReleasedPage[]
}

export interface BendingPage {
  pageIndex: number
  bendAmount: number
  zOffset: number
}

export interface ReleasedPage {
  pageIndex: number
  releaseTime: number
  initialVelocity: number
  direction: 'forward' | 'backward'
}

export type FlipBookAction =
  | { type: 'FLIP_TO_PAGE'; payload: number }
  | { type: 'FLIP_COMPLETE' }
  | { type: 'TOGGLE_VIEW_MODE' }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'carousel' }
  | { type: 'OPEN_RESUME' }
  | { type: 'CLOSE_RESUME' }
  | { type: 'TOGGLE_REDUCED_MOTION' }
  | { type: 'TOGGLE_DEBUG_MODE' }
  | { type: 'TOUCH_INPUT'; delta: number; velocity: number }
  | { type: 'TOUCH_END' }
  | { type: 'PAGE_LANDED'; pageIndex: number }
const initialState: FlipBookState = {
  currentPageIndex: 0,
  isFlipping: false,
  isRiffling: false,
  targetPageIndex: null,
  viewMode: 'grid',
  resumeOpen: false,
  prefersReducedMotion: false,
  debugMode: false,
  scrollAccumulator: 0,
  scrollVelocity: 0,
  isEngaged: false,
  bendingPages: [],
  releasedPages: [],
}

function flipBookReducer(state: FlipBookState, action: FlipBookAction): FlipBookState {
  switch (action.type) {
    case 'FLIP_TO_PAGE': {
      if (state.debugMode) console.log('Reducer: FLIP_TO_PAGE', action.payload)

      const targetPage = Math.max(0, Math.min(TOTAL_PAGES - 1, action.payload))

      if (state.isFlipping || state.isRiffling || targetPage === state.currentPageIndex) {
        if (state.debugMode) console.log('Reducer: blocked - already flipping or same page')
        return state
      }

      if (state.prefersReducedMotion) {
        return {
          ...state,
          currentPageIndex: targetPage,
        }
      }

      return {
        ...state,
        targetPageIndex: targetPage,
        isFlipping: true,
        isRiffling: true,
      }
    }

    case 'FLIP_COMPLETE': {
      const newPageIndex = state.targetPageIndex ?? state.currentPageIndex
      return {
        ...state,
        currentPageIndex: newPageIndex,
        isFlipping: false,
        isRiffling: false,
        targetPageIndex: null,
      }
    }

    case 'TOGGLE_VIEW_MODE':
      return {
        ...state,
        viewMode: state.viewMode === 'grid' ? 'carousel' : 'grid',
      }

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      }

    case 'OPEN_RESUME':
      return {
        ...state,
        resumeOpen: true,
      }

    case 'CLOSE_RESUME':
      return {
        ...state,
        resumeOpen: false,
      }

    case 'TOGGLE_REDUCED_MOTION':
      console.log('Toggling reduced motion:', !state.prefersReducedMotion)
      return {
        ...state,
        prefersReducedMotion: !state.prefersReducedMotion,
      }

    case 'TOGGLE_DEBUG_MODE':
      console.log('Toggling debug mode:', !state.debugMode)
      return {
        ...state,
        debugMode: !state.debugMode,
      }

    case 'TOUCH_INPUT': {
      const { delta, velocity } = action

      const normalizedDelta = delta / 100
      let newAccumulator = Math.max(-100, Math.min(100, state.scrollAccumulator + normalizedDelta))

      const direction = newAccumulator > 0 ? 'forward' : 'backward'
      const absAccumulator = Math.abs(newAccumulator)

      const bendingCount = Math.min(
        Math.floor(absAccumulator / 15) + 1,
        direction === 'forward'
          ? TOTAL_PAGES - state.currentPageIndex - 1
          : state.currentPageIndex
      )

      const bendingPages: BendingPage[] = []
      for (let i = 0; i < bendingCount; i++) {
        const pageIndex = direction === 'forward'
          ? state.currentPageIndex + 1 + i
          : state.currentPageIndex - 1 - i

        const bendFalloff = Math.pow(0.7, i)
        const bendAmount = Math.min(1, (absAccumulator / 50) * bendFalloff)

        bendingPages.push({
          pageIndex,
          bendAmount,
          zOffset: i * 2,
        })
      }

      const releaseThreshold = 60
      let releasedPages = [...state.releasedPages]
      let currentPage = state.currentPageIndex

      if (absAccumulator >= releaseThreshold && bendingPages.length > 0) {
        const releasingPage = bendingPages[0]
        releasedPages.push({
          pageIndex: releasingPage.pageIndex,
          releaseTime: performance.now(),
          initialVelocity: Math.abs(velocity),
          direction,
        })

        currentPage = direction === 'forward' ? currentPage + 1 : currentPage - 1
        newAccumulator = direction === 'forward' ? newAccumulator - 40 : newAccumulator + 40
        bendingPages.shift()
      }

      return {
        ...state,
        scrollAccumulator: newAccumulator,
        scrollVelocity: velocity,
        isEngaged: true,
        bendingPages,
        releasedPages,
        currentPageIndex: currentPage,
      }
    }

    case 'TOUCH_END': {
      const absAccumulator = Math.abs(state.scrollAccumulator)

      if (absAccumulator < 30) {
        return {
          ...state,
          scrollAccumulator: 0,
          scrollVelocity: 0,
          isEngaged: false,
          bendingPages: [],
        }
      }

      const direction: 'forward' | 'backward' = state.scrollAccumulator > 0 ? 'forward' : 'backward'
      const newReleasedPages: ReleasedPage[] = state.bendingPages.map((page, index) => ({
        pageIndex: page.pageIndex,
        releaseTime: performance.now() + index * 40,
        initialVelocity: Math.abs(state.scrollVelocity) * 0.5,
        direction,
      }))

      return {
        ...state,
        scrollAccumulator: 0,
        scrollVelocity: 0,
        isEngaged: false,
        bendingPages: [],
        releasedPages: [...state.releasedPages, ...newReleasedPages],
      }
    }

    case 'PAGE_LANDED': {
      const releasedPages = state.releasedPages.filter(
        (page) => page.pageIndex !== action.pageIndex
      )

      return {
        ...state,
        releasedPages,
      }
    }

    default:
      return state
  }
}

interface FlipBookContextType {
  state: FlipBookState
  dispatch: Dispatch<FlipBookAction>
}

const FlipBookContext = createContext<FlipBookContextType | undefined>(undefined)

export function FlipBookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flipBookReducer, initialState)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (mediaQuery.matches) {
        console.log('[CONTEXT] Browser prefers reduced motion - enabling')
        dispatch({ type: 'TOGGLE_REDUCED_MOTION' })
      }
    }
  }, [])

  return (
    <FlipBookContext.Provider value={{ state, dispatch }}>
      {children}
    </FlipBookContext.Provider>
  )
}

export function useFlipBook() {
  const context = useContext(FlipBookContext)
  if (context === undefined) {
    throw new Error('useFlipBook must be used within a FlipBookProvider')
  }
  return context
}
