import type { ReactNode } from 'react'

interface PolicySectionProps {
  id: string
  title: string
  description: string
  children: ReactNode
}

export default function PolicySection({
  id,
  title,
  description,
  children,
}: PolicySectionProps) {
  return (
    <section className="policy-section" aria-labelledby={id}>
      <div className="row g-3 g-lg-4">
        <div className="col-12 col-lg-3">
          <h2 id={id} className="h6 fw-semibold mb-2">
            {title}
          </h2>
          <p className="policy-muted small mb-0">{description}</p>
        </div>
        <div className="col-12 col-lg-9 policy-section-controls">
          {children}
        </div>
      </div>
    </section>
  )
}
