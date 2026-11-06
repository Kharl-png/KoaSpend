import type { WorkspaceAssistantData } from '../types/assistant'
import { mockOwnerOverview } from './mockOwnerOverview'
import { mockOwnerRequests } from './mockOwnerRequests'

export const mockWorkspaceAssistant: WorkspaceAssistantData = {
  messages: [
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content:
        'What would you like to review? I can show a workspace summary or a sample spending-cap suggestion.',
    },
  ],
  summary: {
    projectCount: mockOwnerOverview.projects.length,
    requestCount: mockOwnerRequests.requests.length,
    needsReviewCount: mockOwnerRequests.requests.filter(
      (request) => request.status === 'needs_review',
    ).length,
    currency: mockOwnerOverview.currency,
    allocated: mockOwnerOverview.projects.reduce(
      (total, project) => total + project.budget,
      0,
    ),
  },
}
