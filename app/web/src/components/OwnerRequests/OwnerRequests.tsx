import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import type { OwnerRequestsData, RequestStatus } from '../../types/requests'
import type { User } from '../../types/workspace'
import OwnerAccessDialog from './OwnerAccessDialog'
import { filterRequests } from './filterRequests'
import './OwnerRequests.css'

const filters = [
  {
    id: 'all',
    label: 'All requests',
  },
  {
    id: 'needs_review',
    label: 'Needs review',
  },
  {
    id: 'completed',
    label: 'Completed',
  },
  {
    id: 'blocked',
    label: 'Blocked',
  },
] as const

const statusLabels: Record<RequestStatus, string> = {
  needs_review: 'Needs review',
  completed: 'Completed',
  blocked: 'Blocked',
}

interface OwnerRequestsProps {
  data: OwnerRequestsData
  user: User
  searchQuery: string
  initialProjectId?: string
}

export default function OwnerRequests({
  data,
  user,
  searchQuery,
  initialProjectId = 'all',
}: OwnerRequestsProps) {
  const [status, setStatus] = useState<'all' | RequestStatus>('all')
  const [projectId, setProjectId] = useState(
    data.projects.some((project) => project.id === initialProjectId)
      ? initialProjectId
      : 'all',
  )
  const [showAccess, setShowAccess] = useState(false)
  const needsReview = data.requests.filter(
    (request) => request.status === 'needs_review',
  ).length
  const visibleRequests = filterRequests(data, status, projectId, searchQuery)

  return (
    <div className="owner-requests">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 mb-md-5">
        <div>
          <h1 className="requests-title mb-2">
            {projectId === 'all'
              ? 'Requests'
              : `${data.projects.find((project) => project.id === projectId)?.name} requests`}
          </h1>
          <p className="requests-muted mb-0">
            Review your team’s purchase requests.
          </p>
        </div>
        <button
          type="button"
          className="btn requests-primary d-inline-flex align-items-center gap-2"
          onClick={() => setShowAccess(true)}
        >
          <Plus size={18} aria-hidden="true" />
          New request
        </button>
      </div>

      <div className="requests-toolbar d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div
          className="nav nav-pills gap-1"
          role="group"
          aria-label="Request status"
        >
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.id}
              className={`nav-link ${status === filter.id ? 'active' : ''}`}
              aria-pressed={status === filter.id}
              onClick={() => setStatus(filter.id)}
            >
              {filter.label}
              {filter.id === 'needs_review' && (
                <span className="badge ms-2 requests-count">{needsReview}</span>
              )}
            </button>
          ))}
        </div>
        <select
          className="form-select requests-project-filter"
          aria-label="Filter by project"
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
        >
          <option value="all">All projects</option>
          {data.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table requests-table align-middle mb-0">
          <caption className="visually-hidden">Team purchase requests</caption>
          <thead>
            <tr>
              <th scope="col">Request / team member</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <span className="fw-medium">{request.title}</span>
                  <small className="d-block requests-muted mt-1">
                    {request.memberName}
                  </small>
                </td>
                <td className="text-nowrap">
                  {request.amount.toLocaleString()} {data.currency}
                </td>
                <td>
                  <span className="badge requests-status">
                    {statusLabels[request.status]}
                  </span>
                </td>
              </tr>
            ))}
            {visibleRequests.length === 0 && (
              <tr>
                <td colSpan={3} className="requests-empty text-center">
                  <FileText
                    size={30}
                    strokeWidth={1.6}
                    aria-hidden="true"
                    className="mb-3"
                  />
                  <h2 className="h6">No matching requests</h2>
                  <p className="small mb-0">
                    Change the filters or submit a request from a team identity.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="visually-hidden" role="status">
        {visibleRequests.length} matching requests
      </p>
      {showAccess && (
        <OwnerAccessDialog user={user} onClose={() => setShowAccess(false)} />
      )}
    </div>
  )
}
