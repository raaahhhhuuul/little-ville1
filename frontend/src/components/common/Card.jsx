const kinderPalette = {
  primary: { bg: 'bg-orange-400',  icon: 'bg-white/25' },
  green:   { bg: 'bg-emerald-400', icon: 'bg-white/25' },
  yellow:  { bg: 'bg-amber-400',   icon: 'bg-white/25' },
  blue:    { bg: 'bg-sky-400',     icon: 'bg-white/25' },
  purple:  { bg: 'bg-violet-500',  icon: 'bg-white/25' },
  red:     { bg: 'bg-rose-400',    icon: 'bg-white/25' },
}

export const KinderStatCard = ({ label, value, icon: Icon, color = 'primary' }) => {
  const c = kinderPalette[color] || kinderPalette.primary
  return (
    <div className={`${c.bg} rounded-2xl p-5 text-white`}>
      <div className={`${c.icon} w-11 h-11 rounded-full flex items-center justify-center mb-3`}>
        <Icon size={22} strokeWidth={2} className="text-white" />
      </div>
      <p className="text-3xl font-medium leading-none">{value}</p>
      <p className="text-sm text-white/80 mt-1.5">{label}</p>
    </div>
  )
}

const Card = ({ children, className = '', title, action }) => (
  <div className={`card ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-sm font-medium text-gray-900">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
)

const statColors = {
  primary: { bg: 'bg-orange-500', light: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-100' },
  green:   { bg: 'bg-emerald-500',light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  yellow:  { bg: 'bg-amber-500',  light: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100' },
  red:     { bg: 'bg-rose-500',   light: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100' },
  blue:    { bg: 'bg-sky-500',    light: 'bg-sky-50',     text: 'text-sky-600',     border: 'border-sky-100' },
  purple:  { bg: 'bg-violet-600', light: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-100' }
}

export const StatCard = ({ label, value, icon: Icon, color = 'primary', trend }) => {
  const c = statColors[color] || statColors.primary

  return (
    <div className={`bg-white border ${c.border} p-5 hover:border-gray-300 transition-colors duration-200`}>
      <div className="flex items-start gap-4">
        <div className={`${c.light} ${c.text} p-2.5 shrink-0`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 truncate uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-medium text-gray-900 mt-1 leading-none">{value}</p>
          {trend && <p className="text-xs text-gray-400 mt-1.5">{trend}</p>}
        </div>
      </div>
    </div>
  )
}

export default Card
