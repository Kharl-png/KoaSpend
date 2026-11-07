export interface Workspace {
  id: string
  name: string
  avatarLabel: string
  environmentLabel: string
}

export interface User {
  id: string
  name: string
  role: 'owner' | 'member'
}

export interface WorkspaceSession {
  workspace: Workspace
  user: User
}
