import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Users, BookOpen, FileText, LogOut } from 'lucide-react'
import LogoutButton from './LogoutButton'

function AdminSidebar() {
  const links = [
    { href: '/admin/applicants', icon: Users, label: 'Applicants' },
    { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { href: '/admin/fees', icon: FileText, label: 'Fee Documents' },
  ]

  return (
    <aside className="w-64 min-h-screen bg-gray-900 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold">
            Lumira<span className="text-blue-400">Admin</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
        >
          Back to Site
        </Link>
        <LogoutButton />
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const session = cookieStore.get('admin_session')

  if (!session || session.value !== 'authenticated') {
    redirect('/admin-login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
