import type { OwnerRequestsData } from '../types/requests'
import { mockOwnerOverview } from './mockOwnerOverview'

export const mockOwnerRequests: OwnerRequestsData = {
  currency: mockOwnerOverview.currency,
  projects: mockOwnerOverview.projects.map((project) => ({
    id: project.id,
    name: project.name,
  })),
  requests: [
    {
      id: 'request-design-assets',
      title: 'Design assets for the website',
      memberName: 'Maya Chen',
      projectId: 'sample-project',
      amount: 35,
      status: 'needs_review',
    },
    {
      id: 'request-domain',
      title: 'Website domain registration',
      memberName: 'Alex Rivera',
      projectId: 'sample-project',
      amount: 20,
      status: 'completed',
    },
    {
      id: 'request-hosting',
      title: 'Monthly hosting plan',
      memberName: 'Maya Chen',
      projectId: 'sample-project',
      amount: 45,
      status: 'needs_review',
    },
    {
      id: 'request-plugin',
      title: 'Premium website plugin',
      memberName: 'Jordan Santos',
      projectId: 'sample-project',
      amount: 120,
      status: 'blocked',
    },
    {
      id: 'request-testing',
      title: 'Browser testing subscription',
      memberName: 'Alex Rivera',
      projectId: 'sample-project',
      amount: 30,
      status: 'completed',
    },
  ],
}
