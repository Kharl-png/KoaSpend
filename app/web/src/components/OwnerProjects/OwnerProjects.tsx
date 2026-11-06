import { useState } from 'react'
import { Plus, ClipboardList } from 'lucide-react'
import type { OwnerProjectsData } from '../../types/projects'
import ProjectCard from './ProjectCard'
import ProjectDialog from './ProjectDialog'
import './OwnerProjects.css'

interface OwnerProjectsProps {
  data: OwnerProjectsData
  onChange: (data: OwnerProjectsData) => void
  onViewRequests: (projectId: string) => void
}

export default function OwnerProjects({
  data,
  onChange,
  onViewRequests,
}: OwnerProjectsProps) {
  const [dialog, setDialog] = useState<'project' | 'task' | null>(null)
  const [notice, setNotice] = useState('')
  const canAssign = data.projects.length > 0 && data.members.length > 0

  return (
    <section className="owner-projects" aria-labelledby="projects-page-title">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 mb-md-5">
        <div>
          <h1 id="projects-page-title" className="projects-title mb-2">
            Projects and allowances
          </h1>
          <p className="projects-muted mb-0">
            Manage project budgets and assigned work.
          </p>
        </div>
        <button
          type="button"
          className="btn projects-primary d-inline-flex align-items-center gap-2"
          onClick={() => setDialog('project')}
        >
          <Plus size={18} aria-hidden="true" />
          New project
        </button>
      </div>
      {notice && (
        <p className="small projects-muted" role="status">
          {notice}
        </p>
      )}
      <div className="row g-3 mb-5">
        {data.projects.map((project) => (
          <div className="col-12 col-lg-6" key={project.id}>
            <ProjectCard
              project={project}
              currency={data.currency}
              onOpen={() => onViewRequests(project.id)}
            />
          </div>
        ))}
        {data.projects.length === 0 && (
          <p className="projects-muted">
            No projects yet. Create a project to give the work an allowance.
          </p>
        )}
      </div>

      <section aria-labelledby="assigned-work-title">
        <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
          <h2 id="assigned-work-title" className="h5 mb-0">
            Assigned work
          </h2>
          <button
            type="button"
            className="btn projects-outline d-inline-flex align-items-center gap-2"
            disabled={!canAssign}
            onClick={() => setDialog('task')}
          >
            <Plus size={17} aria-hidden="true" />
            Assign task
          </button>
        </div>
        {!canAssign && (
          <p className="small projects-muted">
            Add a project and team member before assigning work.
          </p>
        )}
        <ul className="list-unstyled mb-0">
          {data.tasks.map((task) => {
            const member = data.members.find(
              (item) => item.id === task.memberId,
            )
            const project = data.projects.find(
              (item) => item.id === task.projectId,
            )
            const initials =
              member?.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0])
                .join('')
                .toUpperCase() ?? '?'

            return (
              <li
                className="project-task d-flex justify-content-between align-items-center flex-wrap gap-3 py-3"
                key={task.id}
              >
                <div>
                  <h3 className="h6 mb-1">{task.title}</h3>
                  <p className="projects-muted mb-0">{task.description}</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="projects-muted small">
                    {project?.name ?? 'Unavailable project'}
                  </span>
                  <span
                    className="project-member-avatar rounded-circle d-inline-flex align-items-center justify-content-center"
                    aria-label={`Assigned to ${member?.name ?? 'unavailable member'}`}
                    title={member?.name}
                  >
                    {initials}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
        {data.tasks.length === 0 && (
          <div className="text-center projects-muted py-5">
            <ClipboardList size={28} aria-hidden="true" className="mb-2" />
            <p className="mb-0">No assigned work yet.</p>
          </div>
        )}
      </section>

      {dialog && (
        <ProjectDialog
          mode={dialog}
          data={data}
          onClose={() => setDialog(null)}
          onSaveProject={(project) => {
            onChange({
              ...data,
              projects: [...data.projects, project],
            })
            setNotice('Project saved for this session.')
          }}
          onSaveTask={(task) => {
            onChange({
              ...data,
              tasks: [...data.tasks, task],
            })
            setNotice('Task assigned for this session.')
          }}
        />
      )}
    </section>
  )
}
