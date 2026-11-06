import type { OwnerRequestsData } from '../../types/requests'

export function relativeActivityTime(occurredAt: string, now = Date.now()) {
  const timestamp = Date.parse(occurredAt)
  if (!Number.isFinite(timestamp)) return 'Unknown time'
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000))
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function csvCell(value: string | number) {
  const raw = String(value)
  const text = /^[\s]*[=+@-]|^[\t\r\n]/.test(raw) ? `'${raw}` : raw
  return `"${text.replaceAll('"', '""')}"`
}

export function expensesCsv(data: OwnerRequestsData) {
  const rows: (string | number)[][] = [
    [
      'Request ID',
      'Request',
      'Team member',
      'Project',
      'Amount',
      'Currency',
      'Status',
    ],
    ...data.requests
      .filter((request) => request.status === 'completed')
      .map((request) => [
        request.id,
        request.title,
        request.memberName,
        data.projects.find((project) => project.id === request.projectId)
          ?.name ?? request.projectId,
        request.amount,
        data.currency,
        'Completed',
      ]),
  ]
  return '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n')
}
