import { Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const roleColors = {
  ADMIN:   'from-violet-500 to-purple-600',
  STAFF:   'from-orange-400 to-rose-500',
  STUDENT: 'from-sky-400 to-blue-500'
}

const roleEmoji = { ADMIN: '👑', STAFF: '🍎', STUDENT: '🎒' }

const Header = ({ onMenuClick, title }) => {
  const { user } = useAuth()
  const profile     = user?.studentProfile || user?.staffProfile
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : user?.email?.split('@')[0]

  const gradient = roleColors[user?.role] || 'from-orange-400 to-rose-500'
  const emoji    = roleEmoji[user?.role] || '🌟'

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b-2 border-orange-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-orange-50 text-violet-600 transition-colors"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl hidden sm:block">{emoji}</span>
          <h1 className="text-base font-bold text-violet-800">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-bold text-gray-800 leading-none">{displayName}</p>
          <p className="text-xs text-orange-500 font-semibold mt-0.5">{user?.role}</p>
        </div>
        <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-md`}>
          <span className="text-white text-sm font-bold">
            {displayName?.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
