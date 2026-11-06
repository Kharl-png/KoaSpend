import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { OverviewProject } from '../../types/overview'
import type { OwnerProjectsData, ProjectTask } from '../../types/projects'

interface ProjectDialogProps {
  mode: 'project' | 'task'
  data: OwnerProjectsData
  onClose: () => void
  onSaveProject: (project: OverviewProject) => void
  onSaveTask: (task: ProjectTask) => void
}

export default function ProjectDialog({
  mode,
  data,
  onClose,
  onSaveProject,
  onSaveTask,
}: ProjectDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [allowance, setAllowance] = useState('')
  const [projectId, setProjectId] = useState(data.projects[0]?.id ?? '')
  const [memberId, setMemberId] = useState(data.members[0]?.id ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  function save() {
    if (!title.trim() || !description.trim()) {
      setError('Enter a name or title and a work description.')
      return
    }

    const id = `${mode}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    if (mode === 'project') {
      const budget = Number(allowance)
      if (!allowance.trim() || !Number.isFinite(budget) || budget <= 0) {
        setError('Enter a project allowance greater than zero.')
        return
      }
      onSaveProject({
        id,
        name: title.trim(),
        description: description.trim(),
        budget,
        committed: 0,
      })
    } else {
      if (
        !data.projects.some((project) => project.id === projectId) ||
        !data.members.some((member) => member.id === memberId)
      ) {
        setError('Choose an available project and team member.')
        return
      }
      onSaveTask({
        id,
        title: title.trim(),
        description: description.trim(),
        projectId,
        memberId,
      })
    }
    onClose()
  }

  return (
    <dialog
      ref={dialog}
      className="projects-dialog p-0"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
    >
      <form
        className="p-4"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
          <h2 id="project-dialog-title" className="h5 mb-0">
            {mode === 'project'
              ? 'Give the work an allowance'
              : 'Assign a piece of work'}
          </h2>
          <button
            type="button"
            className="btn projects-close p-0"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="project-record-title">
            {mode === 'project' ? 'Name' : 'Task title'}
          </label>
          <input
            id="project-record-title"
            className="form-control"
            required
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        {mode === 'task' && (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor="task-project">
                Project
              </label>
              <select
                id="task-project"
                className="form-select"
                required
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
              >
                {data.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="task-member">
                Assigned team member
              </label>
              <select
                id="task-member"
                className="form-select"
                required
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
              >
                {data.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="mb-3">
          <label className="form-label" htmlFor="project-work-description">
            Work description
          </label>
          <textarea
            id="project-work-description"
            className="form-control"
            required
            rows={3}
            maxLength={2000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        {mode === 'project' && (
          <div className="mb-3">
            <label className="form-label" htmlFor="project-allowance">
              Project allowance
            </label>
            <div className="input-group">
              <input
                id="project-allowance"
                className="form-control"
                type="number"
                min="0.0000001"
                step="0.0000001"
                required
                value={allowance}
                onChange={(event) => setAllowance(event.target.value)}
              />
              <span className="input-group-text">{data.currency}</span>
            </div>
          </div>
        )}
        {error && (
          <p className="projects-form-error small" role="alert">
            {error}
          </p>
        )}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn projects-outline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="btn projects-primary">
            Save record
          </button>
        </div>
      </form>
    </dialog>
  )
}
