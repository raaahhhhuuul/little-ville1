import { Inbox } from 'lucide-react'

const emojis = {
  default: '📭',
  users:   '👥',
  class:   '🏫',
  quiz:    '📝',
  notif:   '🔔',
  attend:  '📋',
  salary:  '💰',
}

const EmptyState = ({ message = 'Nothing here yet!', icon: Icon = Inbox, action, emoji }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-pop">
    <div className="relative mb-5">
      <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-orange-100 rounded-3xl flex items-center justify-center shadow-inner border-2 border-orange-100">
        {emoji
          ? <span className="text-4xl">{emoji}</span>
          : <Icon size={30} className="text-violet-400" />
        }
      </div>
      {/* Small decorative stars */}
      <span className="absolute -top-2 -right-2 text-xl animate-wiggle">⭐</span>
    </div>
    <p className="text-gray-500 font-bold text-sm">{message}</p>
    <p className="text-gray-400 text-xs mt-1">This space is waiting to be filled!</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export default EmptyState
