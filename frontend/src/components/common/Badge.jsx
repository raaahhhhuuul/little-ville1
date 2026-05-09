const Badge = ({ children, variant = 'blue' }) => {
  const variants = {
    green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    red:    'bg-rose-50 text-rose-700 border-rose-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    blue:   'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-violet-50 text-violet-700 border-violet-200',
    gray:   'bg-gray-100 text-gray-600 border-gray-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border ${variants[variant] || variants.blue}`}>
      {children}
    </span>
  )
}

export default Badge
