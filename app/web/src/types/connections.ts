export interface ConnectionsData {
  walletName: string | null
  accountsCreated: boolean
  registered: boolean
  agentName: string
  limitPayments: boolean
  paymentLimit: number
  limitExpiry: boolean
  permissionEnds: string
  authorized: boolean
  escrowBalance: number
  veloProject: string
  supplierId: string | null
}
