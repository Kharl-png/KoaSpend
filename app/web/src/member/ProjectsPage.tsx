import { FolderOpen } from 'lucide-react'
import { ProjectCard } from './DashboardCards'
import type { MemberData } from './data'

export function ProjectsPage({ data, onProject }: { data: MemberData; onProject: (id: string) => void }) {
  return <>
    <div className="page-heading"><div><h1>Projects and allowances</h1><p>Keep resources connected to the work.</p></div></div>
    <div className="project-grid large">{data.projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onSelect={onProject} />)}</div>
    <div className="section-head assigned-heading"><h2>Assigned work</h2></div>
    <div className="surface-list">{data.tasks?.length ? data.tasks.map(task => <div className="task-row" key={task.id}>
      <span className="task-mark"><FolderOpen size={18} aria-hidden="true" /></span>
      <div className="task-copy"><strong>{task.title}</strong><p>{task.description}</p><small>{data.projects.find(project => project.id === task.projectId)?.name}</small></div>
      <span className="avatar" aria-label={data.person.name}>{data.person.initials}</span>
    </div>) : <p className="task-empty">No assigned work yet.</p>}</div>
  </>
}
