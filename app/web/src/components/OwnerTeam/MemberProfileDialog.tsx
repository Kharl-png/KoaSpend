import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { OwnerTeamData, TeamPerson } from '../../types/team'

interface MemberProfileDialogProps {
  person: TeamPerson | null
  data: OwnerTeamData
  onSave: (person: TeamPerson) => void
  onClose: () => void
}

export default function MemberProfileDialog({
  person,
  data,
  onSave,
  onClose,
}: MemberProfileDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState(person?.name ?? '')
  const [email, setEmail] = useState(person?.email ?? '')
  const [specialty, setSpecialty] = useState(person?.specialty ?? '')
  const [responsibilities, setResponsibilities] = useState(
    person?.responsibilities ?? '',
  )
  const [goal, setGoal] = useState(person?.goal ?? '')
  const [guidance, setGuidance] = useState(person?.spendingGuidance ?? '')
  const [allowance, setAllowance] = useState(
    person?.allowance?.toString() ?? '',
  )
  const [weeklyCap, setWeeklyCap] = useState(
    person?.weeklyCap?.toString() ?? '',
  )
  const [categories, setCategories] = useState(person?.categories ?? [])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  function save() {
    const normalizedEmail = email.trim().toLowerCase()
    if (!name.trim() || !normalizedEmail || !specialty.trim()) {
      setError('Enter a full name, email, and role or specialty.')
      return
    }
    if (
      data.people.some(
        (item) =>
          item.id !== person?.id &&
          item.email.toLowerCase() === normalizedEmail,
      )
    ) {
      setError('A person with this email already exists.')
      return
    }
    const limit = allowance.trim() ? Number(allowance) : null
    const weekly = weeklyCap.trim() ? Number(weeklyCap) : null
    if (
      [limit, weekly].some(
        (value) => value !== null && (!Number.isFinite(value) || value < 0),
      )
    ) {
      setError('Limits must be zero or a positive number, or left blank.')
      return
    }
    onSave({
      id:
        person?.id ??
        `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      email: normalizedEmail,
      role: 'member',
      specialty: specialty.trim(),
      responsibilities: responsibilities.trim(),
      goal: goal.trim(),
      spendingGuidance: guidance.trim(),
      allowance: limit,
      weeklyCap: weekly,
      spent: person?.spent ?? 0,
      weeklySpent: person?.weeklySpent ?? 0,
      categories,
      active: person?.active ?? true,
      codeSet: person?.codeSet ?? false,
    })
    onClose()
  }

  return (
    <dialog
      ref={dialog}
      className="team-dialog p-0"
      aria-labelledby="member-profile-title"
      onClose={onClose}
    >
      <form
        className="p-4"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
          <h2 id="member-profile-title" className="h5 mb-0">
            {person ? 'Edit team profile' : 'Add a team member'}
          </h2>
          <button
            type="button"
            className="btn team-close p-0"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <p className="team-muted small mb-4">
          Issue a private code from Team when you’re ready.
        </p>
        <div className="mb-3">
          <label className="form-label" htmlFor="member-name">
            Full name
          </label>
          <input
            id="member-name"
            className="form-control"
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="member-email">
            Sign-in email
          </label>
          <input
            id="member-email"
            className="form-control"
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="member-specialty">
            Role or specialty
          </label>
          <input
            id="member-specialty"
            className="form-control"
            required
            maxLength={120}
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
          />
        </div>
        {[
          {
            id: 'member-responsibilities',
            label: 'Responsibilities',
            value: responsibilities,
            update: setResponsibilities,
          },
          {
            id: 'member-goal',
            label: 'Goal',
            value: goal,
            update: setGoal,
          },
          {
            id: 'member-guidance',
            label: 'Spending guidance',
            value: guidance,
            update: setGuidance,
          },
        ].map((field) => (
          <div className="mb-3" key={field.id}>
            <label className="form-label" htmlFor={field.id}>
              {field.label}
            </label>
            <textarea
              id={field.id}
              className="form-control"
              rows={2}
              maxLength={2000}
              value={field.value}
              onChange={(event) => field.update(event.target.value)}
            />
          </div>
        ))}
        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6">
            <label className="form-label" htmlFor="member-allowance">
              Member allowance ({data.currency})
            </label>
            <input
              id="member-allowance"
              className="form-control"
              type="number"
              min="0"
              step="0.0000001"
              value={allowance}
              onChange={(event) => setAllowance(event.target.value)}
              aria-describedby="member-allowance-help"
            />
            <small
              id="member-allowance-help"
              className="team-muted d-block mt-1"
            >
              All-time limit across projects. Blank uses other limits.
            </small>
          </div>
          <div className="col-12 col-sm-6">
            <label className="form-label" htmlFor="member-weekly-cap">
              Weekly cap ({data.currency})
            </label>
            <input
              id="member-weekly-cap"
              className="form-control"
              type="number"
              min="0"
              step="0.0000001"
              value={weeklyCap}
              onChange={(event) => setWeeklyCap(event.target.value)}
              aria-describedby="member-weekly-help"
            />
            <small id="member-weekly-help" className="team-muted d-block mt-1">
              Optional. Resets Mondays in Manila.
            </small>
          </div>
        </div>
        <fieldset className="mb-3">
          <legend className="fs-6">Allowed expense categories</legend>
          <div className="d-flex flex-wrap gap-3">
            {data.categories.map((category, index) => (
              <div className="form-check" key={category}>
                <input
                  className="form-check-input"
                  id={`member-category-${index}`}
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={(event) =>
                    setCategories((current) =>
                      event.target.checked
                        ? [...current, category]
                        : current.filter((item) => item !== category),
                    )
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor={`member-category-${index}`}
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
          <small className="team-muted d-block mt-2">
            Leave all unchecked to use workspace categories.
          </small>
        </fieldset>
        {error && (
          <p className="team-form-error small" role="alert">
            {error}
          </p>
        )}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn team-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn team-primary">
            Save record
          </button>
        </div>
      </form>
    </dialog>
  )
}
