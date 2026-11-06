import type { OverviewProject } from './overview'

export interface ProjectMember {
  id: string
  name: string
}

export interface ProjectTask {
  id: string
  title: string
  description: string
  projectId: string
  memberId: string
}

export interface OwnerProjectsData {
  currency: string
  projects: OverviewProject[]
  members: ProjectMember[]
  tasks: ProjectTask[]
}
