import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const DashboardLayout = ({ children, title }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
