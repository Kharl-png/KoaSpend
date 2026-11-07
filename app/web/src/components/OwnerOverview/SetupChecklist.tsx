import { ArrowRight, Check, Circle, Plus, Sparkles } from 'lucide-react'
import type { SetupGroup } from '../../types/overview'
import type { SidebarPage } from '../Sidebar/navigation'

interface SetupChecklistProps {
  groups: SetupGroup[]
  onNavigate: (page: SidebarPage) => void
}

const statusLabels = {
  complete: 'Complete',
  next: 'Next',
  todo: 'To do',
}

export default function SetupChecklist({
  groups,
  onNavigate,
}: SetupChecklistProps) {
  const nextStep = groups
    .flatMap((group) => group.steps)
    .find((step) => step.status !== 'complete')

  return (
    <section
      className="overview-panel p-3 p-md-4"
      aria-labelledby="setup-title"
    >
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 id="setup-title" className="h5 fw-semibold">
            Set up your workspace
          </h2>
          <p className="overview-muted mb-0">
            Complete workspace setup before inviting your team. Test payments
            require a separate Testnet setup.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn overview-button"
            onClick={() => onNavigate(nextStep?.page ?? 'policy')}
          >
            Continue setup manually
          </button>
          <button
            className="btn overview-button-outline d-inline-flex align-items-center gap-2"
            onClick={() => onNavigate('assistant')}
          >
            <Sparkles size={17} aria-hidden="true" />
            Set up with assistant
          </button>
        </div>
      </div>
      {groups.map((group) => {
        const completed = group.steps.filter(
          (step) => step.status === 'complete',
        ).length
        const progress = group.steps.length
          ? (completed / group.steps.length) * 100
          : 0

        return (
          <div key={group.id} className="setup-group">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
              <h3 className="h6 fw-semibold mb-0">{group.title}</h3>
              <span className="overview-muted">
                {completed} of {group.steps.length} complete
              </span>
            </div>
            <div
              className="progress setup-progress mb-2"
              role="progressbar"
              aria-label={`${group.title} setup`}
              aria-valuenow={completed}
              aria-valuemin={0}
              aria-valuemax={group.steps.length}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
            <ul className="list-unstyled mb-0">
              {group.steps.map((step) => (
                <li
                  key={step.id}
                  className="setup-step d-flex align-items-center gap-3 py-3"
                >
                  <span
                    className={`setup-icon flex-shrink-0 ${step.status === 'complete' ? 'is-complete' : ''}`}
                    aria-hidden="true"
                  >
                    {step.status === 'complete' ? (
                      <Check size={18} />
                    ) : step.status === 'next' ? (
                      <Plus size={18} />
                    ) : (
                      <Circle size={16} />
                    )}
                  </span>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                      <h4 className="h6 mb-0">{step.title}</h4>
                      <span
                        className={`setup-status ${step.status === 'next' ? 'badge rounded-pill' : 'overview-muted'}`}
                      >
                        {statusLabels[step.status]}
                      </span>
                    </div>
                    <p className="overview-muted mb-0">{step.description}</p>
                  </div>
                  <button
                    className="btn overview-link d-flex align-items-center gap-2 flex-shrink-0"
                    onClick={() => onNavigate(step.page)}
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
