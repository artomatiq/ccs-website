import { useScreenTransition } from "../../contexts/TransitionContext"
import "./transitionOverlay.css"

export default function TransitionOverlay() {
  const { isTransitioning, transitionText, durationConfig } = useScreenTransition()

  if (!isTransitioning) return null

  const fadeInDuration = durationConfig.fadeInDuration
  const holdDuration = durationConfig.holdDuration
  const fadeOutDuration = durationConfig.fadeOutDuration
  const blurFadeOutDuration = durationConfig.blurFadeOutDuration
  const blurFadeOutStart = fadeInDuration + holdDuration

  const style = {
    "--fade-in-duration": `${fadeInDuration}ms`,
    "--hold-duration": `${holdDuration}ms`,
    "--fade-out-duration": `${fadeOutDuration}ms`,
    "--fade-out-start": `${fadeInDuration + holdDuration}ms`,
    "--text-fade-out-start": `${fadeInDuration + holdDuration + 500}ms`,
    "--blur-fade-out-start": `${blurFadeOutStart}ms`,
    "--blur-fade-out-duration": `${blurFadeOutDuration}ms`,
  }

  return (
    <div className="transition-overlay-container" style={style}>
      <div className="transition-overlay-black">
        <div className="transition-overlay-star" aria-hidden="true">
          <svg viewBox="-100 -100 200 200">
            <rect x="-60" y="-60" width="120" height="120" />
            <rect className="b" x="-60" y="-60" width="120" height="120" transform="rotate(45)" />
          </svg>
        </div>
        <div className="transition-overlay-star transition-overlay-star-black" aria-hidden="true">
          <svg viewBox="-100 -100 200 200">
            <rect x="-60" y="-60" width="120" height="120" />
            <rect className="b" x="-60" y="-60" width="120" height="120" transform="rotate(45)" />
          </svg>
        </div>
      </div>
      {/* <div className="transition-overlay-blur" /> */}
      {transitionText && (
        <div className="transition-overlay-text">{transitionText}</div>
      )}
    </div>
  )
}
