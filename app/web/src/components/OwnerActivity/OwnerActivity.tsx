import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import type { ActivityEvent } from '../../types/activity'
import type { OwnerRequestsData } from '../../types/requests'
import ActivityTimeline from './ActivityTimeline'
import { expensesCsv } from './activityHelpers'
import './OwnerActivity.css'

interface OwnerActivityProps {
  events: ActivityEvent[]
  requests: OwnerRequestsData
}

export default function OwnerActivity({
  events,
  requests,
}: OwnerActivityProps) {
  const [now, setNow] = useState(Date.now)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  function exportExpenses() {
    const url = URL.createObjectURL(
      new Blob([expensesCsv(requests)], {
        type: 'text/csv;charset=utf-8;',
      }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'koaspend-expenses.csv'
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('Export prepared from completed requests.')
  }

  return (
    <section className="owner-activity" aria-labelledby="activity-title">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 id="activity-title" className="activity-title mb-2">
            Activity
          </h1>
          <p className="activity-muted mb-0">
            Requests, decisions, and payments in one timeline.
          </p>
        </div>
        <button
          type="button"
          className="btn activity-export d-inline-flex align-items-center gap-2"
          onClick={exportExpenses}
        >
          <Download size={17} aria-hidden="true" />
          Export expenses
        </button>
      </div>
      <p className="activity-muted small" role="status">
        {notice}
      </p>
      <ActivityTimeline events={events} now={now} />
    </section>
  )
}
