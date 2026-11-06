export type RequestStatus = 'needs_review' | 'completed' | 'blocked'

export interface PurchaseRequest {
  id: string
  title: string
  memberName: string
  projectId: string
  amount: number
  status: RequestStatus
}

export interface OwnerRequestsData {
  currency: string
  projects: {
    id: string
    name: string
  }[]
  requests: PurchaseRequest[]
}
