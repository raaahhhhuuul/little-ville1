const Card = ({ children, className = '', title, action }) => (
  <div className={`card ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between mb-5">
        {title && (
          <h3 className="text-base font-bold text-violet-800 flex items-center gap-2">
            {title}
          </h3>
        )}
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
)

const statColors = {
  primary: {
    bg: 'bg-orange-50', icon: 'text-orange-500', border: 'border-orange-100',
    gradient: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-100'
  },
  green: {
    bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-100',
    gradient: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-100'
  },
  yellow: {
    bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100',
    gradient: 'from-amber-400 to-yellow-500', shadow: 'shadow-amber-100'
  },
  red: {
    bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-100',
    gradient: 'from-rose-400 to-pink-500', shadow: 'shadow-rose-100'
  },
  blue: {
    bg: 'bg-sky-50', icon: 'text-sky-500', border: 'border-sky-100',
    gradient: 'from-sky-400 to-blue-500', shadow: 'shadow-sky-100'
  },
  purple: {
    bg: 'bg-violet-50', icon: 'text-violet-500', border: 'border-violet-100',
    gradient: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-100'
  }
}

export const StatCard = ({ label, value, icon: Icon, color = 'primary', trend }) => {
  const c = statColors[color] || statColors.primary

  return (
    <div className={`bg-white rounded-3xl p-5 border-2 ${c.border} shadow-md ${c.shadow} hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${c.gradient} shadow-md shrink-0`}>
          <Icon size={22} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-500 truncate">{label}</p>
          <p className="text-3xl font-black text-gray-800 mt-0.5 leading-none">{value}</p>
          {trend && <p className="text-xs font-semibold text-gray-400 mt-1.5">{trend}</p>}
        </div>
      </div>
    </div>
  )
}

export default Card
