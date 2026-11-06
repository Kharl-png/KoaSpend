import { useState } from 'react'
import {
  Activity,
  ChevronDown,
  CircleHelp,
  FileText,
  Layers,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { User, Workspace } from '../../types/workspace'
import logo from '../../assets/logo.png'
import './Sidebar.css'

const navigation = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    id: 'requests',
    label: 'Requests',
    icon: FileText,
  },
  {
    id: 'assistant',
    label: 'Spend assistant',
    icon: MessageSquare,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Layers,
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
  },
  {
    id: 'policy',
    label: 'Spending policy',
    icon: SlidersHorizontal,
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: Activity,
  },
  {
    id: 'notes',
    label: 'Saved notes',
    icon: Sparkles,
  },
  {
    id: 'connections',
    label: 'Connections',
    icon: Settings,
  },
  {
    id: 'help',
    label: 'How it works',
    icon: CircleHelp,
  },
] as const satisfies readonly {
  id: string
  label: string
  icon: LucideIcon
}[]

export type SidebarPage = (typeof navigation)[number]['id']

interface SidebarProps {
  activePage: SidebarPage
  onNavigate: (page: SidebarPage, label: string) => void
  workspace: Workspace
  user: User
}

export default function Sidebar({
  activePage,
  onNavigate,
  workspace,
  user,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const accountInitials = user.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
  const roleLabel = user.role === 'owner' ? 'Owner view' : 'Team member view'

  return (
    <>
      <button
        className="btn sidebar-toggle d-lg-none"
        aria-label="Open navigation"
        aria-controls="workspace-sidebar"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={24} />
      </button>
      {mobileOpen && (
        <button
          className="sidebar-backdrop d-lg-none"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        id="workspace-sidebar"
        className={`workspace-sidebar d-flex flex-column ${mobileOpen ? 'is-open' : ''}`}
        aria-label="Workspace sidebar"
        onKeyDown={(event) => {
          if (event.key === 'Escape') setMobileOpen(false)
        }}
      >
        <div className="d-flex align-items-center justify-content-between sidebar-brand-row">
          <a
            href="#overview"
            className="sidebar-brand d-flex align-items-center text-decoration-none"
            aria-label="Koaspend home"
            onClick={() => {
              onNavigate('overview', 'Overview')
              setMobileOpen(false)
            }}
          >
            <img
              src={logo}
              className="sidebar-brand-logo flex-shrink-0"
              width="34"
              height="34"
              alt=""
            />
            <span>
              KoaSpend
            </span>
          </a>
          <button
            className="btn sidebar-close d-lg-none p-1"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="position-relative mb-3">
          <div className="workspace-selector d-flex align-items-center text-start w-100">
            <span className="workspace-avatar d-flex align-items-center justify-content-center flex-shrink-0">
              {workspace.avatarLabel}
            </span>
            <span className="flex-grow-1">
              <span className="d-block fw-semibold">{workspace.name}</span>
            </span>
            <ChevronDown size={17} className="flex-shrink-0" />
          </div>
        </div>

        <p className="sidebar-section-label mb-2">Workspace</p>
        <nav
          className="nav nav-pills flex-column gap-1"
          aria-label="Main navigation"
        >
          {navigation.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link d-flex align-items-center gap-3 ${activePage === id ? 'active' : ''} ${id === 'connections' ? 'sidebar-secondary-start' : ''}`}
              aria-current={activePage === id ? 'page' : undefined}
              onClick={() => {
                onNavigate(id, label)
                setMobileOpen(false)
              }}
            >
              <Icon
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
                className="flex-shrink-0"
              />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-account mt-auto pt-3">
          <div className="d-flex align-items-center gap-3 text-start w-100 account-button">
            <span className="account-avatar d-flex align-items-center justify-content-center flex-shrink-0">
              {accountInitials}
            </span>
            <span className="flex-grow-1">
              <span className="d-block account-name">{user.name}</span>
              <small className="d-block">{roleLabel}</small>
            </span>
            <ChevronDown size={17} className="flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  )
}
