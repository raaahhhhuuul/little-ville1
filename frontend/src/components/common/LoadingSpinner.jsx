import { IconSpinner } from './Icons'

// Inline page-level loader — shown inside page content while data fetches
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const px = { sm: 16, md: 24, lg: 36 }[size] || 24
  return (
    <div className={`flex justify-center py-16 ${className}`}>
      <IconSpinner size={px} className="text-gray-400" />
    </div>
  )
}

export default LoadingSpinner

// Startup screen pinwheel — used only in App.jsx
const blades = [
  { angle: 0,   color: '#F87171' },
  { angle: 60,  color: '#FB923C' },
  { angle: 120, color: '#FCD34D' },
  { angle: 180, color: '#4ADE80' },
  { angle: 240, color: '#60A5FA' },
  { angle: 300, color: '#C084FC' },
]

export const Pinwheel = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="-8 -8 116 116" fill="none">
    {blades.map(({ angle, color }) => (
      <ellipse
        key={angle}
        cx="50" cy="21"
        rx="11" ry="26"
        fill={color}
        opacity="0.9"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="9"   fill="#7C3AED" />
    <circle cx="50" cy="50" r="5"   fill="white" />
    <circle cx="50" cy="50" r="2.5" fill="#7C3AED" />
  </svg>
)
