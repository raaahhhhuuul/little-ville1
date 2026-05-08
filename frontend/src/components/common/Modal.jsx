import { useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-4xl shadow-2xl shadow-violet-200/40 w-full ${sizes[size]} animate-pop border-2 border-orange-100`}>
        <div className="flex items-center justify-between px-7 py-5 border-b-2 border-orange-50">
          <h2 className="text-lg font-bold text-violet-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-orange-50 text-gray-400 hover:text-violet-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  )
}

export default Modal
