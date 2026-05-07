import { Menu, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Header = ({ onMenuClick, title }) => {
  const { user } = useAuth()
  const profile = user?.studentProfile || user?.staffProfile
  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : user?.email?.split('@')[0]

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex flex-col items-end mr-1">
          <span className="text-sm font-medium text-gray-900">{displayName}</span>
          <span className="text-xs text-gray-400">{user?.role}</span>
        </div>
        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-700 text-xs font-bold">
            {displayName?.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
