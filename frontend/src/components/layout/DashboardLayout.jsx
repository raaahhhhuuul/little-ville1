import { SidebarProvider, useSidebar } from '../../context/SidebarContext'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children, title }) => {
  const { setMobileOpen } = useSidebar()
  const { user } = useAuth()
  const isStudent = user?.role === 'STUDENT'
  const bg = isStudent ? 'bg-[#FFF7EE]' : 'bg-[#F4F5F7]'

  return (
    <div className={`h-screen flex overflow-hidden ${bg}`}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
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
