export interface PolicySupplier {
  id: string
  name: string
  domain: string
  category: string
  approved: boolean
}

export interface SpendingPolicyData {
  version: number
  currency: string
  automaticLimit: number
  requestLimit: number
  projectLimit: number
  automaticPayments: boolean
  paused: boolean
  requireReference: boolean
  categories: string[]
  allowedCategories: string[]
  instructions: string
  suppliers: PolicySupplier[]
}
