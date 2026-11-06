import type { ActivityEvent } from '../types/activity'
import { mockSession } from './mockSession'

const now = Date.now()

export const mockActivity: ActivityEvent[] = [
  {
    id: 'activity-policy',
    kind: 'policy',
    title: 'Spending policy updated',
    description: 'Version 2 is active.',
    actorName: mockSession.user.name,
    occurredAt: new Date(now - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-task',
    kind: 'task',
    title: 'Work assigned',
    description: 'Task 1 assigned to Maya Chen for Sample Project.',
    actorName: mockSession.user.name,
    occurredAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-project',
    kind: 'project',
    title: 'Project created',
    description: 'Sample Project received an allowance of 300 XLM.',
    actorName: mockSession.user.name,
    occurredAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-access',
    kind: 'access',
    title: 'Member code issued',
    description: 'Demo access marked as issued for Maya Chen.',
    actorName: mockSession.user.name,
    occurredAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-member',
    kind: 'member',
    title: 'Team member added',
    description: 'Maya Chen joined the workspace as a Brand designer.',
    actorName: mockSession.user.name,
    occurredAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
  },
]
