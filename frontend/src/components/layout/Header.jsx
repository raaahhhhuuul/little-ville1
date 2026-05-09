import { IconMenu } from '../common/Icons'
import { useAuth } from '../../context/AuthContext'

const Header = ({ onMenuClick, title }) => {
  const { user } = useAuth()
  const isStudent = user?.role === 'STUDENT'

  const profile   = user?.studentProfile || user?.staffProfile
  const firstName = profile?.firstName || user?.email?.split('@')[0] || ''

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })

  return (
    <header className={`h-14 border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 ${
      isStudent
        ? 'bg-[#FFF7EE] border-orange-100'
        : 'bg-[#0E0B26] border-white/10'
    }`}>
      {/* Left — menu + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-1.5 transition-colors rounded-lg ${
            isStudent
              ? 'text-orange-400 hover:text-orange-600 hover:bg-orange-100'
              : 'text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          <IconMenu size={20} />
        </button>

        {isStudent ? (
          <h1 className="font-display text-base text-gray-800">{title}</h1>
        ) : (
          <h1 className="text-sm font-medium text-white/70">{title}</h1>
        )}
      </div>

      {/* Right */}
      {isStudent ? (
        <p className="hidden sm:block text-sm text-gray-400">
          Keep it up,{' '}
          <span className="text-orange-500 font-medium">{firstName}</span>!
        </p>
      ) : (
        <p className="hidden sm:block text-xs text-white/25 font-medium tracking-wide">{today}</p>
      )}
    </header>
  )
}

export default Header
