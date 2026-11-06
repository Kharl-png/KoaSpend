import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Clock3,
  CircleCheck,
  ShieldCheck,
  Plus,
  Sparkles,
} from 'lucide-react'
import type { OwnerOverviewData } from '../../types/overview'
import type { SidebarPage } from '../Sidebar/navigation'
import SetupChecklist from './SetupChecklist'
import './OwnerOverview.css'

interface OwnerOverviewProps {
  data: OwnerOverviewData
  onNavigate: (page: SidebarPage) => void
}

export default function OwnerOverview({
  data,
  onNavigate,
}: OwnerOverviewProps) {
  const formatAmount = (amount: number) =>
    `${amount.toLocaleString()} ${data.currency}`
  const pending = data.requests.filter(
    (request) => request.status === 'pending',
  )
  const completed = data.requests.filter(
    (request) => request.status === 'completed',
  )
  const pendingAmount = pending.reduce(
    (total, request) => total + request.amount,
    0,
  )
  const allocated = data.projects.reduce(
    (total, project) => total + project.budget,
    0,
  )
  const committed = data.projects.reduce(
    (total, project) => total + project.committed,
    0,
  )

  const allocationPercent =
    allocated > 0
      ? Math.max(0, Math.min((committed / allocated) * 100, 100))
      : 0

  return (
    <div className="owner-overview">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="overview-title mb-2">Spending overview</h1>
          <p className="overview-muted mb-0">
            Track requests, project budgets and payments.
          </p>
        </div>
        <button
          className="btn overview-button d-inline-flex align-items-center gap-2"
          onClick={() => onNavigate('assistant')}
        >
          <Plus size={19} aria-hidden="true" />
          Ask your assistant
        </button>
      </div>

      <SetupChecklist groups={data.setupGroups} onNavigate={onNavigate} />

      <section
        className="overview-panel allocation-panel d-flex flex-column flex-md-row gap-4 p-4 my-4"
        aria-labelledby="allocation-title"
      >
        <div className="allocation-summary flex-shrink-0">
          <h2 id="allocation-title" className="overview-muted small mb-2">
            Allocated to purchases
          </h2>
          <p className="allocation-amount mb-2">
            {committed.toLocaleString()}
            <span className="overview-muted ms-2">{data.currency}</span>
          </p>
          <p className="overview-muted allocation-caption mb-0 d-flex align-items-center gap-1">
            <span className="allocation-workspace-dot" aria-hidden="true" />
            Stellar Testnet workspace
          </p>
        </div>
        <div className="allocation-budget flex-grow-1 align-self-md-center">
          <div className="d-flex justify-content-between flex-wrap gap-2 allocation-caption mb-2">
            <strong>{formatAmount(allocated - committed)} available</strong>
            <span className="overview-muted">
              {formatAmount(allocated)} allocated
            </span>
          </div>
          <div
            className="progress allocation-progress"
            role="progressbar"
            aria-label="Project allowance committed"
            aria-valuenow={allocationPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${formatAmount(committed)} committed out of ${formatAmount(allocated)} allocated`}
          >
            <div
              className={`progress-bar ${allocated > 0 ? 'has-budget' : ''}`}
              style={{
                width: `${allocationPercent}%`,
              }}
            />
          </div>
        </div>
      </section>

      <section className="mb-4" aria-labelledby="escrow-title">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h2 id="escrow-title" className="h5 mb-1">
              Spending and escrow
            </h2>
            <p className="overview-muted small mb-0">
              Confirmed payments, pending requests, and escrow balance.
            </p>
          </div>
          <button
            className="btn overview-link d-inline-flex align-items-center gap-2"
            onClick={() => onNavigate('connections')}
          >
            Manage escrow
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <dl className="row g-3 mb-0">
          <div className="col-12 col-md-4">
            <div className="escrow-card h-100 p-3">
              <dt className="overview-muted fw-normal mb-1">Paid on Testnet</dt>
              <dd className="fw-semibold mb-2">{formatAmount(data.paid)}</dd>
              <dd className="overview-muted mb-0">
                {formatAmount(pendingAmount)} pending
              </dd>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="escrow-card h-100 p-3">
              <dt className="overview-muted fw-normal mb-1">Noir escrow</dt>
              <dd className="fw-semibold mb-0">
                {data.escrowBalance === null
                  ? 'No active wallet'
                  : formatAmount(data.escrowBalance)}
              </dd>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="escrow-card h-100 p-3">
              <dt className="overview-muted fw-normal mb-1">
                Agent authorization
              </dt>
              <dd className="fw-semibold mb-0">
                {data.agentVerified ? 'Verified' : 'Not verified'}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <div className="row g-0 overview-stats my-4 mb-5">
        {[
          {
            label: 'Awaiting review',
            value: pending.length,
            icon: Clock3,
          },
          {
            label: 'Completed requests',
            value: completed.length,
            icon: CircleCheck,
          },
          {
            label: `Spending policy · v${data.policyVersion}`,
            value: data.policyActive ? 'Active' : 'Inactive',
            icon: ShieldCheck,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            className="col-12 col-md-4 overview-stat d-flex align-items-center gap-3"
            key={label}
          >
            <span className="overview-stat-icon rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="h5 mb-1">{value}</p>
              <small className="overview-muted">{label}</small>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-5" aria-labelledby="requests-title">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 id="requests-title" className="h5 mb-0">
            On your desk
          </h2>
          <button
            className="btn overview-link d-flex align-items-center gap-2"
            onClick={() => onNavigate('requests')}
          >
            All requests <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="overview-panel overflow-hidden">
          <div className="table-responsive">
            <table className="table overview-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Request / team member</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      {request.title}
                      <small className="d-block overview-muted">
                        {request.memberName}
                      </small>
                    </td>
                    <td>{formatAmount(request.amount)}</td>
                    <td>
                      {request.status === 'pending'
                        ? 'Awaiting review'
                        : 'Completed'}
                    </td>
                  </tr>
                ))}
                {data.requests.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-5">
                      <FileText
                        size={26}
                        aria-hidden="true"
                        className="overview-muted mb-3"
                      />
                      <h3 className="h6">No requests yet</h3>
                      <p className="overview-muted mb-0">
                        Team purchase requests will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="projects-title">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 id="projects-title" className="h5 mb-0">
            Projects
          </h2>
          <button
            className="btn overview-link d-flex align-items-center gap-2"
            onClick={() => onNavigate('projects')}
          >
            All projects <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="row g-3">
          {data.projects.map((project) => (
            <div className="col-12 col-lg-6" key={project.id}>
              <button
                className="overview-project btn text-start w-100 h-100 p-4"
                onClick={() => onNavigate('projects')}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="project-icon d-inline-flex p-2 rounded-3">
                    <Sparkles size={23} aria-hidden="true" />
                  </span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </div>
                <h3 className="h5">{project.name}</h3>
                <p className="overview-muted mb-4">{project.description}</p>
                <div className="d-flex justify-content-between align-items-end gap-2 mb-2">
                  <span>
                    <strong className="fs-5">
                      {formatAmount(project.budget - project.committed)}
                    </strong>{' '}
                    left
                  </span>
                  <small className="overview-muted">
                    {formatAmount(project.committed)} committed
                  </small>
                </div>
                <div
                  className="progress setup-progress"
                  role="progressbar"
                  aria-label={`${project.name} budget committed`}
                  aria-valuenow={project.committed}
                  aria-valuemin={0}
                  aria-valuemax={project.budget}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${project.budget > 0 ? Math.min((project.committed / project.budget) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </button>
            </div>
          ))}
          {data.projects.length === 0 && (
            <p className="overview-muted">No projects yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
