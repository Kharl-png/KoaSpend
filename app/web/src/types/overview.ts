import type { SidebarPage } from '../components/Sidebar/navigation'

export interface SetupStep {
  id: string
  title: string
  description: string
  status: 'complete' | 'next' | 'todo'
  actionLabel: string
  page: SidebarPage
}

export interface SetupGroup {
  id: string
  title: string
  steps: SetupStep[]
}

export interface OverviewProject {
  id: string
  name: string
  description: string
  budget: number
  committed: number
}

export interface OverviewRequest {
  id: string
  title: string
  memberName: string
  amount: number
  status: 'pending' | 'completed'
}

export interface OwnerOverviewData {
  currency: string
  paid: number
  escrowBalance: number | null
  agentVerified: boolean
  policyVersion: number
  policyActive: boolean
  setupGroups: SetupGroup[]
  projects: OverviewProject[]
  requests: OverviewRequest[]
}
