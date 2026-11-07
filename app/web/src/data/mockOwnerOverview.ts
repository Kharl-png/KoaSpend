import type { OwnerOverviewData } from '../types/overview'

export const mockOwnerOverview: OwnerOverviewData = {
  currency: 'XLM',
  paid: 0,
  escrowBalance: null,
  agentVerified: false,
  policyVersion: 2,
  policyActive: true,
  setupGroups: [
    {
      id: 'workspace',
      title: 'Workspace',
      steps: [
        {
          id: 'rules',
          title: 'Spending rules',
          description:
            'Set purchase limits, categories, and your team agreement.',
          status: 'complete',
          actionLabel: 'Review rules',
          page: 'policy',
        },
        {
          id: 'team',
          title: 'Team and access',
          description: 'Add team members and issue their access codes.',
          status: 'complete',
          actionLabel: 'Review team',
          page: 'team',
        },
        {
          id: 'projects',
          title: 'Projects and assignments',
          description: 'Create a project budget and assign work to your team.',
          status: 'complete',
          actionLabel: 'Assign a task',
          page: 'projects',
        },
        {
          id: 'suppliers',
          title: 'Approved suppliers',
          description: 'Manage suppliers your team can purchase from.',
          status: 'complete',
          actionLabel: 'Review suppliers',
          page: 'connections',
        },
      ],
    },
    {
      id: 'testnet',
      title: 'Testnet payments',
      steps: [
        {
          id: 'wallet',
          title: 'Owner wallet',
          description: 'Connect the Stellar Testnet account you control.',
          status: 'next',
          actionLabel: 'Open wallet setup',
          page: 'connections',
        },
        {
          id: 'agent',
          title: 'Noir agent authorization',
          description:
            'Register your agent and set its spending cap and expiry.',
          status: 'todo',
          actionLabel: 'Set agent terms',
          page: 'connections',
        },
        {
          id: 'escrow',
          title: 'Escrow funding',
          description: 'Deposit test XLM into escrow to fund purchases.',
          status: 'todo',
          actionLabel: 'Open escrow',
          page: 'connections',
        },
        {
          id: 'velo',
          title: 'Velo Gas and demo merchant',
          description: 'Link your Velo project and an approved supplier.',
          status: 'todo',
          actionLabel: 'Open Velo setup',
          page: 'connections',
        },
      ],
    },
  ],
  projects: [
    {
      id: 'sample-project',
      name: 'Sample Project',
      description: 'Testing website',
      budget: 300,
      committed: 0,
    },
  ],
  requests: [],
}
