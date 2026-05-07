import { Inbox } from 'lucide-react'

const EmptyState = ({ message = 'No data found', icon: Icon = Inbox, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-4 bg-gray-100 rounded-full mb-4">
      <Icon size={28} className="text-gray-400" />
    </div>
    <p className="text-gray-500 text-sm">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
)

export default EmptyState
