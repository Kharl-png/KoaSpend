import type { WorkspaceSession } from '../types/workspace'

// Display data only; replace with the authenticated session when the API is ready.
export const mockSession: WorkspaceSession = {
  workspace: {
    id: 'demo-workspace',
    name: 'Team workspace',
    avatarLabel: 'N',
    environmentLabel: 'Local prototype',
  },
  user: {
    id: 'demo-owner',
    name: 'Allowance Group Demo',
    role: 'owner',
  },
}
