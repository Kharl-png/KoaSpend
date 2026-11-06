import {
  Activity,
  CircleHelp,
  FileText,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Settings,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const navigation = [
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
    label: 'Workspace assistant',
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

