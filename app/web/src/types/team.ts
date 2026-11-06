export interface TeamPerson {
  id: string
  name: string
  email: string
  role: 'owner' | 'member'
  specialty: string
  responsibilities: string
  goal: string
  spendingGuidance: string
  allowance: number | null
  weeklyCap: number | null
  spent: number
  weeklySpent: number
  categories: string[]
  active: boolean
  codeSet: boolean
}

export interface OwnerTeamData {
  currency: string
  categories: string[]
  people: TeamPerson[]
}
