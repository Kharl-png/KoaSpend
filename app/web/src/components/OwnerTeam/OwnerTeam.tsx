import { useState } from 'react'
import { Plus, Search, Sparkles, Users } from 'lucide-react'
import type { OwnerTeamData, TeamPerson } from '../../types/team'
import type { ProjectTask } from '../../types/projects'
import MemberProfileDialog from './MemberProfileDialog'
import MemberAccessDialog from './MemberAccessDialog'
import './OwnerTeam.css'

interface OwnerTeamProps {
  data: OwnerTeamData
  tasks: ProjectTask[]
  onChange: (data: OwnerTeamData) => void
  onDraftProfile: (person?: TeamPerson) => void
}

export default function OwnerTeam({
  data,
  tasks,
  onChange,
  onDraftProfile,
}: OwnerTeamProps) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<TeamPerson | null | undefined>(
    undefined,
  )
  const [access, setAccess] = useState<{
    person: TeamPerson
    action: 'code' | 'remove'
  } | null>(null)
  const [notice, setNotice] = useState('')
  const people = data.people.filter((person) =>
    [person.name, person.email, person.specialty].some((value) =>
      value.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  )
  const amount = (value: number) => `${value.toLocaleString()} ${data.currency}`

  return (
    <section className="owner-team" aria-labelledby="team-title">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 id="team-title" className="team-title mb-2">
            People, permissions &amp; spending
          </h1>
          <p className="team-muted mb-0">
            Manage team profiles, access, and spending allowances.
          </p>
        </div>
        <button
          type="button"
          className="btn team-primary d-inline-flex align-items-center gap-2"
          onClick={() => setEditing(null)}
        >
          <Plus size={18} aria-hidden="true" />
          Add member
        </button>
      </div>
      <div className="team-profile-banner rounded-4 p-3 p-md-4 d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="h5 mb-2">Team profiles</h2>
          <p className="team-muted mb-0">
            Draft responsibilities and spending guidance with your workspace
            assistant.
          </p>
        </div>
        <button
          type="button"
          className="btn team-outline d-inline-flex align-items-center gap-2"
          onClick={() => onDraftProfile()}
        >
          <Sparkles size={16} aria-hidden="true" />
          Draft a profile
        </button>
      </div>
      {notice && (
        <p className="small team-muted" role="status">
          {notice}
        </p>
      )}
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-3">
        <div className="team-search">
          <label htmlFor="team-search" className="form-label small">
            Find a person
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} aria-hidden="true" />
            </span>
            <input
              id="team-search"
              type="search"
              className="form-control"
              placeholder="Name, email, or role"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <span className="small team-muted" role="status">
          {people.length} people · {data.currency} allowances
        </span>
      </div>
      <div
        className="table-responsive team-directory"
        role="region"
        aria-label="Scrollable team directory"
        tabIndex={0}
      >
        <table className="table team-table align-top mb-0">
          <caption className="visually-hidden">
            Team profiles, member access and spending allowances
          </caption>
          <thead>
            <tr>
              <th scope="col">Name and email</th>
              <th scope="col">Role &amp; responsibilities</th>
              <th scope="col">Spending limits</th>
              <th scope="col">Access</th>
              <th scope="col">Manage</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td className="team-person-cell">
                  <p className="fw-semibold mb-1">{person.name}</p>
                  <p className="team-muted small mb-2 team-email">
                    {person.email}
                  </p>
                  <span className="badge team-role">
                    {person.role === 'owner' ? 'Owner' : 'Team member'}
                  </span>
                </td>
                <td className="team-responsibilities-cell">
                  <p className="fw-medium mb-1">{person.specialty}</p>
                  <p className="team-muted small mb-2">
                    {person.responsibilities}
                  </p>
                  {person.goal && (
                    <p className="team-muted small mb-2">
                      <strong>Goal · </strong>
                      {person.goal}
                    </p>
                  )}
                  {person.spendingGuidance && (
                    <p className="team-muted small mb-2">
                      <strong>Spending · </strong>
                      {person.spendingGuidance}
                    </p>
                  )}
                  <small className="team-muted">
                    {tasks.filter((task) => task.memberId === person.id).length}{' '}
                    assigned tasks
                  </small>
                </td>
                <td className="team-limits-cell">
                  {person.role === 'owner' ? (
                    <span className="team-muted">Workspace oversight</span>
                  ) : (
                    <>
                      <p className="fw-medium mb-1">
                        {person.allowance === null
                          ? 'Uses workspace limits'
                          : amount(person.allowance)}
                      </p>
                      {person.allowance !== null && (
                        <p className="team-muted small mb-1">
                          {amount(person.spent)} spent ·{' '}
                          {amount(Math.max(0, person.allowance - person.spent))}{' '}
                          left
                        </p>
                      )}
                      <p className="team-muted small mb-3">
                        All-time allowance across projects.
                      </p>
                      <p className="fw-medium mb-1">
                        {person.weeklyCap === null
                          ? 'No separate weekly cap'
                          : `${amount(person.weeklyCap)} per week`}
                      </p>
                      {person.weeklyCap !== null && (
                        <p className="team-muted small mb-0">
                          {amount(
                            Math.max(0, person.weeklyCap - person.weeklySpent),
                          )}{' '}
                          left this week
                        </p>
                      )}
                    </>
                  )}
                </td>
                <td className="team-access-cell">
                  <span className="badge team-role mb-2">
                    {person.active ? 'Active' : 'Access removed'}
                  </span>
                  <p className="small team-muted mb-0">
                    {person.codeSet ? 'Private code set' : 'No private code'}
                  </p>
                </td>
                <td className="team-manage-cell">
                  {person.role === 'member' && (
                    <div className="d-flex flex-column align-items-start gap-2">
                      <button
                        type="button"
                        className="btn team-link"
                        onClick={() => setEditing(person)}
                      >
                        Edit profile
                      </button>
                      <button
                        type="button"
                        className="btn team-link"
                        onClick={() =>
                          setAccess({
                            person,
                            action: 'code',
                          })
                        }
                      >
                        {person.codeSet ? 'Reset code' : 'Issue code'}
                      </button>
                      <button
                        type="button"
                        className="btn team-link"
                        onClick={() => onDraftProfile(person)}
                      >
                        Draft responsibilities
                      </button>
                      <button
                        type="button"
                        className="btn team-link"
                        disabled={!person.active}
                        onClick={() =>
                          setAccess({
                            person,
                            action: 'remove',
                          })
                        }
                      >
                        Remove access
                      </button>
                      <small className="team-muted">
                        Past requests and assignments stay.
                      </small>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!people.length && (
              <tr>
                <td colSpan={5} className="text-center py-5">
                  <Users
                    size={28}
                    className="team-muted mb-2"
                    aria-hidden="true"
                  />
                  <p className="mb-0">No matching people</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {editing !== undefined && (
        <MemberProfileDialog
          person={editing}
          data={data}
          onClose={() => setEditing(undefined)}
          onSave={(person) => {
            onChange({
              ...data,
              people: editing
                ? data.people.map((item) =>
                    item.id === person.id ? person : item,
                  )
                : [...data.people, person],
            })
            setNotice('Profile saved for this session.')
          }}
        />
      )}
      {access && (
        <MemberAccessDialog
          person={access.person}
          action={access.action}
          onClose={() => setAccess(null)}
          onConfirm={() => {
            onChange({
              ...data,
              people: data.people.map((person) =>
                person.id === access.person.id
                  ? {
                      ...person,
                      active: access.action === 'code',
                      codeSet: access.action === 'code',
                    }
                  : person,
              ),
            })
            setNotice(
              access.action === 'code'
                ? 'Demo code updated for this session. Real sign-in is unchanged.'
                : 'Access removed in this session. Real sign-in is unchanged.',
            )
          }}
        />
      )}
    </section>
  )
}
