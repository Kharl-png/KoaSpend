export type Page = 'Overview' | 'Requests' | 'Assistant' | 'Projects'
export type RequestStatus = 'needs_review' | 'paid' | 'authorized' | 'blocked'
export interface MemberRequest { id: string; title: string; projectId: string; category: string; amount: number; status: RequestStatus; purpose: string }
export interface Project { id: string; name: string; description: string; budget: number; committed: number }
export interface AssignedTask { id: string; title: string; description: string; projectId: string }
export interface MemberData {
  person: { name: string; initials: string; title: string; weeklyBudget: number; weeklySpent: number }
  requests: MemberRequest[]; projects: Project[]
  policy: { version: number; paused: boolean; perRequest: number; autoLimit?: number }
  tasks?: AssignedTask[]
  suppliers?: { id: string; name: string }[]
  categories?: string[]
}
// UI fixtures only: XLM values are display units, not payment instructions.
export const mockMemberData: MemberData = {
  person: { name: 'Maya Chen', initials: 'MC', title: 'Brand designer', weeklyBudget: 1, weeklySpent: 0 },
  policy: { version: 2, paused: false, perRequest: 100, autoLimit: 40 },
  suppliers: [{ id: 'supplier-1', name: 'Supplier 1' }],
  categories: ['Creative assets', 'Software', 'Equipment', 'Services'],
  projects: [
    { id: 'sample', name: 'Sample Project', description: 'Testing website', budget: 300, committed: 0 },
  ],
  requests: [],
  tasks: [{ id: 'task-1', title: 'Task 1', description: 'Tasked Maya Ched', projectId: 'sample' }],
}
export const amount = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 7 }).format(value)
export const statusLabels: Record<RequestStatus, string> = { needs_review: 'Needs review', paid: 'Completed', authorized: 'Payment pending', blocked: 'Blocked by policy' }
export function readMemberPage(): Page {
  const slug = window.location.pathname.replace(/\/$/, '').split('/')[2] || ''
  return pages.find(page => pageSlug(page) === slug) || 'Overview'
}
export const pages: Page[] = ['Overview', 'Requests', 'Assistant', 'Projects']
export const pageSlug = (page: Page) => page === 'Overview' ? '' : page.toLowerCase().replaceAll(' ', '-')
