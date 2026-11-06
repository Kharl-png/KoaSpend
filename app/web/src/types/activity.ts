export type ActivityKind = 'policy' | 'project' | 'task' | 'member' | 'access'

export interface ActivityEvent {
  id: string
  kind: ActivityKind
  title: string
  description: string
  actorName: string
  occurredAt: string
}
