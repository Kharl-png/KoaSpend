import type { OwnerTeamData } from '../types/team'
import { mockSession } from './mockSession'

export const mockOwnerTeam: OwnerTeamData = {
  currency: 'XLM',
  categories: [
    'Software',
    'Creative assets',
    'Research',
    'Services',
    'Equipment',
  ],
  people: [
    {
      id: mockSession.user.id,
      name: mockSession.user.name,
      email: 'group-demo-owner@allowance.example',
      role: 'owner',
      specialty: 'Workspace owner',
      responsibilities:
        'Sets team responsibilities, purchasing rules and budgets; reviews exceptions.',
      goal: '',
      spendingGuidance: '',
      allowance: null,
      weeklyCap: null,
      spent: 0,
      weeklySpent: 0,
      categories: [],
      active: true,
      codeSet: true,
    },
    {
      id: 'member-maya',
      name: 'Maya Chen',
      email: 'group-demo-member@allowance.example',
      role: 'member',
      specialty: 'Brand designer',
      responsibilities: 'Create visual identity and campaign assets.',
      goal: 'Deliver consistent, accessible campaign assets on time.',
      spendingGuidance:
        'Request design software, fonts or imagery for assigned work. Include a quote and the business purpose.',
      allowance: 100,
      weeklyCap: 1,
      spent: 0,
      weeklySpent: 0,
      categories: ['Software', 'Creative assets'],
      active: true,
      codeSet: true,
    },
  ],
}
