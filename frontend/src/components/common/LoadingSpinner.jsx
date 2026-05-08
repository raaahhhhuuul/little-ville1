/* Kindergarten pinwheel loader */

const blades = [
  { angle: 0,   color: '#F87171' },  // red
  { angle: 60,  color: '#FB923C' },  // orange
  { angle: 120, color: '#FCD34D' },  // yellow
  { angle: 180, color: '#4ADE80' },  // green
  { angle: 240, color: '#60A5FA' },  // blue
  { angle: 300, color: '#C084FC' },  // purple
]

const Pinwheel = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {blades.map(({ angle, color }) => (
      <ellipse
        key={angle}
        cx="50" cy="21"
        rx="11" ry="26"
        fill={color}
        opacity="0.92"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="10" fill="#7C3AED" />
    <circle cx="50" cy="50" r="5.5" fill="white" />
    <circle cx="50" cy="50" r="2.5" fill="#7C3AED" />
  </svg>
)

const dots = [
  { color: '#F87171', delay: '0ms' },
  { color: '#FCD34D', delay: '160ms' },
  { color: '#60A5FA', delay: '320ms' },
  { color: '#4ADE80', delay: '480ms' },
]

const floaters = [
  { emoji: '⭐', pos: 'top-10 left-12',    size: 'text-3xl', delay: '0s',    dur: '3s' },
  { emoji: '🌈', pos: 'top-16 right-16',   size: 'text-4xl', delay: '0.5s',  dur: '4s' },
  { emoji: '🎨', pos: 'bottom-20 left-20', size: 'text-3xl', delay: '1s',    dur: '3.5s' },
  { emoji: '📚', pos: 'bottom-12 right-12',size: 'text-3xl', delay: '0.3s',  dur: '4.5s' },
  { emoji: '✏️', pos: 'top-1/3 left-8',    size: 'text-2xl', delay: '0.8s',  dur: '3s' },
  { emoji: '🎒', pos: 'top-1/3 right-8',   size: 'text-2xl', delay: '1.2s',  dur: '4s' },
]

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FFF0F6 50%, #EEF2FF 100%)' }}
      >
        {/* Animated background blobs */}
        <div
          className="absolute top-0 left-0 w-80 h-80 opacity-30 animate-blob"
          style={{ background: 'radial-gradient(circle, #FCD34D, transparent 70%)', animationDelay: '0s' }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 opacity-25 animate-blob"
          style={{ background: 'radial-gradient(circle, #C084FC, transparent 70%)', animationDelay: '2.5s' }}
        />
        <div
          className="absolute top-1/2 right-0 w-64 h-64 opacity-20 animate-blob"
          style={{ background: 'radial-gradient(circle, #60A5FA, transparent 70%)', animationDelay: '1.2s' }}
        />

        {/* Floating emoji decorations */}
        {floaters.map(({ emoji, pos, size: sz, delay, dur }) => (
          <div
            key={emoji}
            className={`absolute ${pos} ${sz} select-none pointer-events-none opacity-60`}
            style={{ animation: `float ${dur} ease-in-out infinite`, animationDelay: delay }}
          >
            {emoji}
          </div>
        ))}

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Spinning pinwheel */}
          <div
            className="drop-shadow-xl"
            style={{ animation: 'spin 1.6s linear infinite' }}
          >
            <Pinwheel size={110} />
          </div>

          {/* Logo */}
          <div className="text-center -mt-1">
            <h1 className="font-display text-5xl text-violet-700 leading-none tracking-wide">
              Little Ville
            </h1>
            <p className="text-amber-600 text-sm font-bold mt-2 tracking-wide uppercase">
              Getting your classroom ready
            </p>
          </div>

          {/* Bouncing colour dots */}
          <div className="flex gap-3 mt-1">
            {dots.map(({ color, delay }) => (
              <div
                key={color}
                className="w-3.5 h-3.5 rounded-full shadow-md animate-bounce"
                style={{ background: color, animationDelay: delay, animationDuration: '0.9s' }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* Inline spinner — small pinwheel */
  const px = { sm: 20, md: 32, lg: 48 }[size]
  return (
    <span
      className="inline-block"
      style={{ animation: 'spin 1s linear infinite', width: px, height: px }}
    >
      <Pinwheel size={px} />
    </span>
  )
}

export default LoadingSpinner
