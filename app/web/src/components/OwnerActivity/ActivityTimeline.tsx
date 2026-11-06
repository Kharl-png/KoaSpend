import {
  Clock3,
  ClipboardList,
  FolderPlus,
  ShieldCheck,
  UserRound,
  KeyRound,
} from 'lucide-react'
import type { ActivityEvent, ActivityKind } from '../../types/activity'
import { relativeActivityTime } from './activityHelpers'

const icons = {
  policy: ShieldCheck,
  project: FolderPlus,
  task: ClipboardList,
  member: UserRound,
  access: KeyRound,
} satisfies Record<ActivityKind, typeof ShieldCheck>

interface ActivityTimelineProps {
  events: ActivityEvent[]
  now: number
}

export default function ActivityTimeline({
  events,
  now,
}: ActivityTimelineProps) {
  const sorted = [...events].sort(
    (a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt),
  )

  if (!sorted.length) {
    return (
      <div className="text-center activity-muted py-5">
        <Clock3 size={30} aria-hidden="true" className="mb-3" />
        <h2 className="h6">No activity yet</h2>
        <p className="mb-0">Workspace updates will appear here.</p>
      </div>
    )
  }

  return (
    <ol
      className="activity-timeline list-unstyled mb-0"
      aria-label="Workspace activity"
    >
      {sorted.map((event) => {
        const Icon = icons[event.kind]
        const timestamp = new Date(event.occurredAt)
        const validDate = Number.isFinite(timestamp.getTime())

        return (
          <li
            key={event.id}
            className="activity-entry d-flex align-items-start gap-3 py-4"
          >
            <span className="activity-icon rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0">
              <Icon size={19} aria-hidden="true" />
            </span>
            <div className="activity-entry-body flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <h2 className="activity-event-title mb-0">{event.title}</h2>
                <time
                  className="activity-time activity-muted text-nowrap"
                  dateTime={validDate ? event.occurredAt : undefined}
                  title={
                    validDate
                      ? timestamp.toLocaleString('en-PH', {
                          timeZone: 'Asia/Manila',
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }) + ' (Manila)'
                      : undefined
                  }
                >
                  {relativeActivityTime(event.occurredAt, now)}
                </time>
              </div>
              <p className="activity-muted mb-2">{event.description}</p>
              <small className="activity-actor activity-muted">
                {event.actorName}
              </small>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
