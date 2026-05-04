import { createContext, useContext, useState, useEffect, useRef } from "react"

const TransitionContext = createContext()

const DEFAULT_DURATION_CONFIG = {
  fadeInDuration: 500,
  holdDuration: 200,
  fadeOutDuration: 500,
  blurFadeOutDuration: 500,
}

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionText, setTransitionText] = useState("")
  const [isReady, setIsReady] = useState(true)
  const [durationConfig, setDurationConfig] = useState(DEFAULT_DURATION_CONFIG)
  const startTimeRef = useRef(null)
  const minDurationRef = useRef(0)

  useEffect(() => {
    if (!isTransitioning) return
    if (!isReady) return

    setIsTransitioning(false)
    setTransitionText("")
  }, [isTransitioning, isReady])

  function startTransition(text = "", config = {}) {
    const merged = { ...DEFAULT_DURATION_CONFIG, ...config }
    setDurationConfig(merged)
    startTimeRef.current = Date.now()
    minDurationRef.current =
      merged.fadeInDuration +
      merged.holdDuration +
      merged.fadeOutDuration +
      merged.blurFadeOutDuration
    setTransitionText(text)
    setIsReady(false)
    setIsTransitioning(true)
  }

  function finishTransition() {
    const elapsed = Date.now() - startTimeRef.current
    const remaining = Math.max(0, minDurationRef.current - elapsed)

    if (remaining > 0) {
      setTimeout(() => {
        setIsReady(true)
      }, remaining)
    } else {
      setIsReady(true)
    }
  }

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        transitionText,
        durationConfig,
        startTransition,
        finishTransition,
      }}
    >
      {children}
    </TransitionContext.Provider>
  )
}

export function useScreenTransition() {
  return useContext(TransitionContext)
}
