import { IconInbox } from './Icons'

const EmptyState = ({ message = 'Nothing here yet', icon: Icon = IconInbox, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
      <Icon size={24} className="text-gray-400" strokeWidth={1.5} />
    </div>
    <p className="text-sm font-medium text-gray-600">{message}</p>
    <p className="text-xs text-gray-400 mt-1">No data to display</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
)

export default EmptyState
