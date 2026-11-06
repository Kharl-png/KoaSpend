import type { OwnerProjectsData } from '../types/projects'
import { mockOwnerOverview } from './mockOwnerOverview'

export const mockOwnerProjects: OwnerProjectsData = {
  currency: mockOwnerOverview.currency,
  projects: mockOwnerOverview.projects.map((project) => ({
    ...project,
  })),
  members: [
    {
      id: 'member-maya',
      name: 'Maya Chen',
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Task 1',
      description: 'Test the website and report any issues.',
      projectId: 'sample-project',
      memberId: 'member-maya',
    },
  ],
}
