import {
  Bot,
  Briefcase,
  FileText,
  GraduationCap,
  Home,
  User,
  Wrench,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'Education', path: '/education', icon: GraduationCap },
  { name: 'Experience', path: '/experience', icon: Briefcase },
  { name: 'Skills', path: '/skills', icon: Wrench },
  { name: 'Resume', path: '/resume', icon: FileText },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
  { name: 'AI Assistant', path: '/ai', icon: Bot },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="min-h-screen w-64 shrink-0 border-r border-slate-700 bg-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">ReferAI</h1>
      </div>

      <nav className="px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
