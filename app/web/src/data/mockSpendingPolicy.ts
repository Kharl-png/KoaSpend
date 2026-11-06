import type { SpendingPolicyData } from '../types/policy'

export const mockSpendingPolicy: SpendingPolicyData = {
  version: 2,
  currency: 'XLM',
  automaticLimit: 40,
  requestLimit: 100,
  projectLimit: 500,
  automaticPayments: false,
  paused: false,
  requireReference: true,
  categories: [
    'Software',
    'Creative assets',
    'Research',
    'Services',
    'Equipment',
  ],
  allowedCategories: ['Software', 'Creative assets', 'Research', 'Services'],
  instructions: [
    'Buy resources only for assigned, active work and use owner-approved suppliers.',
    'Include a quote or purchase link, the total price, and how the purchase helps deliver the task.',
    'Keep purchases within member, request, and project limits. Do not split purchases to bypass a limit.',
    'Personal expenses, account sharing, and unlicensed materials are prohibited. Ask the owner about exceptions.',
  ].join('\n'),
  suppliers: [
    {
      id: 'supplier-1',
      name: 'Supplier 1',
      domain: 'supplier.example',
      category: 'Services',
      approved: true,
    },
  ],
}
