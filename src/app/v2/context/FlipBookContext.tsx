'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react'

// state interface
export interface FlipBookState {
  currentPageIndex: number
  isFlipping: boolean
  isRiffling: boolean
  targetPageIndex: number | null
  viewMode: 'grid' | 'carousel' // for gallery pages
  resumeOpen: boolean
  prefersReducedMotion: boolean
  debugMode: boolean
}

// action types
export type FlipBookAction =
  | { type: 'FLIP_TO_PAGE'; payload: number }
  | { type: 'START_RIFFLE'; payload: number }
  | { type: 'RIFFLE_STEP'; payload: number }
  | { type: 'FLIP_COMPLETE' }
  | { type: 'TOGGLE_VIEW_MODE' }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'carousel' }
  | { type: 'OPEN_RESUME' }
  | { type: 'CLOSE_RESUME' }
  | { type: 'TOGGLE_REDUCED_MOTION' }
  | { type: 'TOGGLE_DEBUG_MODE' }

// initial state
const initialState: FlipBookState = {
  currentPageIndex: 0,
  isFlipping: false,
  isRiffling: false,
  targetPageIndex: null,
  viewMode: 'grid',
  resumeOpen: false,
  prefersReducedMotion: false,
  debugMode: false,
}

// reducer function
function flipBookReducer(state: FlipBookState, action: FlipBookAction): FlipBookState {
  switch (action.type) {
    case 'FLIP_TO_PAGE': {
      if (state.debugMode) console.log('Reducer: FLIP_TO_PAGE', action.payload)

      // prevent concurrent flips
      if (state.isFlipping || state.isRiffling) {
        if (state.debugMode) console.log('Reducer: blocked - already flipping')
        return state
      }

      // if reduced motion is enabled, jump immediately without animation
      if (state.prefersReducedMotion) {
        return {
          ...state,
          currentPageIndex: action.payload,
        }
      }

      // otherwise, animate the flip
      const newState = {
        ...state,
        targetPageIndex: action.payload,
        isFlipping: true,
        isRiffling: true, // use riffle for all page changes
      }
      if (state.debugMode) console.log('Reducer: new state', newState)
      return newState
    }

    case 'START_RIFFLE':
      if (state.debugMode) console.log('Reducer: START_RIFFLE', action.payload)

      // prevent concurrent flips
      if (state.isFlipping || state.isRiffling) {
        return state
      }

      // if reduced motion, jump immediately
      if (state.prefersReducedMotion) {
        return {
          ...state,
          currentPageIndex: action.payload,
        }
      }

      return {
        ...state,
        targetPageIndex: action.payload,
        isRiffling: true,
        isFlipping: true,
      }

    case 'RIFFLE_STEP':
      // intermediate riffle step - update current page
      return {
        ...state,
        currentPageIndex: action.payload,
      }

    case 'FLIP_COMPLETE': {
      // complete the flip animation
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

    default:
      return state
  }
}

// context interface
interface FlipBookContextType {
  state: FlipBookState
  dispatch: Dispatch<FlipBookAction>
}

// create context
const FlipBookContext = createContext<FlipBookContextType | undefined>(undefined)

// provider component
export function FlipBookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flipBookReducer, initialState)

  // detect browser's reduced motion preference on mount
  // this runs only once on client side
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

// custom hook for using context
export function useFlipBook() {
  const context = useContext(FlipBookContext)
  if (context === undefined) {
    throw new Error('useFlipBook must be used within a FlipBookProvider')
  }
  return context
}
