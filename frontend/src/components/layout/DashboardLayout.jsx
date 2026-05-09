import { SidebarProvider, useSidebar } from '../../context/SidebarContext'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children, title }) => {
  const { collapsed, setMobileOpen } = useSidebar()
  const { user } = useAuth()
  const bg = user?.role === 'STUDENT' ? 'bg-[#FFF7EE]' : 'bg-[#F5F4F0]'

  return (
    <div className={`min-h-screen ${bg}`}>
      <Sidebar />
      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-14' : 'lg:pl-[220px]'}`}>
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

const DashboardLayout = ({ children, title }) => (
  <SidebarProvider>
    <Layout title={title}>{children}</Layout>
  </SidebarProvider>
)

export default DashboardLayout
