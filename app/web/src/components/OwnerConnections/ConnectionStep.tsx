import type { ReactNode } from 'react'

interface ConnectionStepProps {
  number: number
  id: string
  title: string
  description: string
  children: ReactNode
}

export default function ConnectionStep({
  number,
  id,
  title,
  description,
  children,
}: ConnectionStepProps) {
  return (
    <li
      id={`connection-${id}`}
      className="connection-step d-flex align-items-start gap-3 py-4"
    >
      <span
        className="connection-step-number rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
        aria-hidden="true"
      >
        {number}
      </span>
      <section
        className="connection-step-content flex-grow-1"
        aria-labelledby={`connection-title-${id}`}
      >
        <h3 id={`connection-title-${id}`} className="h6 fw-semibold mb-2">
          {title}
        </h3>
        <p className="connections-muted mb-3">{description}</p>
        {children}
      </section>
    </li>
  )
}
