import { ChevronDown, CircleHelp, FileText, Layers3, LayoutDashboard, MessageSquare, ShieldCheck, X } from 'lucide-react'
import type { MemberData, Page } from './data'

const navigation = [{ name: 'Overview', Icon: LayoutDashboard }, { name: 'Requests', Icon: FileText }, { name: 'Assistant', Icon: MessageSquare }, { name: 'Projects', Icon: Layers3 }] as const
export function MemberSidebar({ data, page, open, close, navigate, showInfo }: { data: MemberData; page: Page; open: boolean; close: () => void; navigate: (page: Page) => void; showInfo: (title: string, text: string) => void }) {
  return <aside id="member-navigation" className={`sidebar ${open ? 'open' : ''}`}>
    <div className="brand"><img src={`${import.meta.env.BASE_URL}images/KoaSpend.png`} alt="KoaSpend logo" width="500" height="500" /><strong>KoaSpend</strong><button className="icon-btn mobile-menu" onClick={close} aria-label="Close navigation"><X size={20} /></button></div>
    <div className="nav-label">Workspace</div>
    <nav aria-label="Member navigation">{navigation.map(({ name, Icon }) => <button key={name} aria-current={page === name ? 'page' : undefined} className={page === name ? 'active' : ''} onClick={() => navigate(name)}><Icon size={18} /><span>{name === 'Assistant' ? 'Purchase Assistant' : name}</span>{name === 'Requests' && <span className="nav-count">{data.requests.filter(r => r.status === 'needs_review').length}</span>}</button>)}</nav>
    <div className="sidebar-bottom">
      <div className="allowance-note"><span className="small-symbol"><ShieldCheck size={17} /></span><strong>Clear rules. More freedom.</strong><p>Your team gets the resources.<br />You keep the oversight.</p></div>
      <button className="bottom-link" onClick={() => showInfo('How it works', 'Choose a project, describe a resource, and review its status. This preview uses sample data; requests and payments are not submitted.')}><CircleHelp size={18} />How it works</button>
      <button className="profile" onClick={() => showInfo(data.person.name, `${data.person.title} · Sample team member profile`)}><span className="avatar small">{data.person.initials}</span><span>{data.person.name}<small>Team member view</small></span><ChevronDown size={14} /></button>
    </div>
  </aside>
}
