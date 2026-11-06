import { ArrowUpRight, Sparkles } from 'lucide-react'
import type { OverviewProject } from '../../types/overview'

interface ProjectCardProps {
  project: OverviewProject
  currency: string
  onOpen: () => void
}

export default function ProjectCard({
  project,
  currency,
  onOpen,
}: ProjectCardProps) {
  const progress =
    project.budget > 0
      ? Math.max(0, Math.min((project.committed / project.budget) * 100, 100))
      : 0

  return (
    <button
      type="button"
      className="btn project-card text-start w-100 h-100 p-4"
      aria-label={`View ${project.name} requests`}
      onClick={onOpen}
    >
      <span className="d-flex justify-content-between align-items-center mb-3">
        <span className="project-card-icon d-inline-flex rounded-3 p-2">
          <Sparkles size={24} aria-hidden="true" />
        </span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </span>
      <span className="d-block h5 fw-semibold mb-2">{project.name}</span>
      <span className="d-block projects-muted project-description mb-4">
        {project.description}
      </span>
      <span className="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-2">
        <span>
          <strong className="fs-5">
            {(project.budget - project.committed).toLocaleString()}
          </strong>
          <small className="ms-1">{currency} left</small>
        </span>
        <small className="projects-muted">
          {project.committed.toLocaleString()} committed
        </small>
      </span>
      <span
        className="progress projects-progress"
        role="progressbar"
        aria-label={`${project.name} allowance committed`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`${project.committed} ${currency} committed of ${project.budget} ${currency}`}
      >
        <span
          className={`progress-bar ${project.budget > 0 ? 'has-budget' : ''}`}
          style={{
            width: `${progress}%`,
          }}
        />
      </span>
    </button>
  )
}
