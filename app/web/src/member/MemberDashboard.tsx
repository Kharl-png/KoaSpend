import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, Plus, Search } from 'lucide-react'
import '@fontsource-variable/manrope'
import { MemberSidebar } from './MemberSidebar'
import { MemberOverview, RequestTable } from './DashboardCards'
import { amount, mockMemberData, pageSlug, readMemberPage, statusLabels } from './data'
import type { MemberData, MemberRequest, Page } from './data'
import './member-dashboard.css'
import { PurchaseAssistant } from './PurchaseAssistant'
import { ProjectsPage } from './ProjectsPage'
import { DashboardDialog } from './DashboardDialog'
import { NewRequestForm } from './NewRequestForm'

/** Presentational member workspace. Supply real authorized data at the host boundary later. */
export function MemberDashboard({ data = mockMemberData }: { data?: MemberData }) {
  const [page, setPage] = useState<Page>(readMemberPage)
  const [newRequest, setNewRequest] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [project, setProject] = useState('')
  const [request, setRequest] = useState<MemberRequest | null>(null)
  const [info, setInfo] = useState<{ title: string; text: string } | null>(null)
  const main = useRef<HTMLElement>(null)
  const menu = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const restore = () => { const restored = readMemberPage(); const slug = pageSlug(restored); const canonical = '/member' + (slug ? '/' + slug : ''); if (window.location.pathname.replace(/\/$/, '') !== canonical) window.history.replaceState(null, '', canonical); setPage(restored); setMobileNav(false); setSearch(''); setProject(''); setFilter('all'); setRequest(null); setInfo(null); setNewRequest(false) }
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') { event.preventDefault(); document.getElementById('member-search')?.focus() }
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) { setMobileNav(false); menu.current?.focus() }
    }
    restore()
    window.addEventListener('popstate', restore); window.addEventListener('keydown', keydown)
    return () => { window.removeEventListener('popstate', restore); window.removeEventListener('keydown', keydown) }
  }, [])
  function navigate(next: Page) {
    window.history.pushState(null, '', `/member${pageSlug(next) ? '/' + pageSlug(next) : ''}`)
    setPage(next); setNewRequest(false); setMobileNav(false); setSearch(''); setFilter('all'); setProject(''); main.current?.focus()
  }
  function showProject(id: string) { navigate('Requests'); setProject(id) }
  function showInfo(title: string, text: string) { setMobileNav(false); setInfo({ title, text }) }
  const onNew = () => setNewRequest(true)
  const closeNav = () => { setMobileNav(false); menu.current?.focus() }
  const filtered = data.requests.filter(r => (filter === 'all' || filter === r.status) && (!project || r.projectId === project) && `${r.title} ${r.id} ${r.purpose}`.toLowerCase().includes(search.toLowerCase()))
  return <div className={`member-dashboard page-${pageSlug(page) || 'overview'}`}><a className="skip-link" href="#member-main">Skip to main content</a><div className="shell">
    <MemberSidebar data={data} page={page} open={mobileNav} close={closeNav} navigate={navigate} showInfo={showInfo} />
    {mobileNav && <button className="nav-backdrop" aria-label="Close navigation" onClick={closeNav} />}
    <div className="app-body"><header className="topbar"><div className="breadcrumbs"><button ref={menu} className="icon-btn mobile-menu" aria-label="Toggle navigation" aria-expanded={mobileNav} aria-controls="member-navigation" onClick={() => setMobileNav(!mobileNav)}><Menu size={20} /></button><img className="header-logo" src={`${import.meta.env.BASE_URL}images/KoaSpend.png`} alt="KoaSpend" width="500" height="500" /><span>Workspace</span><ChevronRight size={13} /><strong>{page === 'Assistant' ? 'Purchase Assistant' : page}</strong></div><div className="top-actions"><div className="search-box"><Search size={15} /><input id="member-search" aria-label="Search requests" placeholder="Search requests…" value={search} onChange={event => { if (page !== 'Requests') navigate('Requests'); setSearch(event.target.value); event.target.focus() }} /><kbd>Ctrl K</kbd></div></div></header>
      <div className="prototype-strip"><span><span className="live-dot" />Sample workspace</span><p>Mock data. No authentication, requests, or payments are processed.</p></div>
      <div className="workspace-body"><main ref={main} className="main-content" id="member-main" tabIndex={-1}>
        {page === 'Overview' && <MemberOverview data={data} navigate={navigate} onRequest={setRequest} onProject={showProject} />}
        {page === 'Requests' && <><div className="page-heading"><div><h1>Requests</h1><p>From “I need this” to a clear decision.</p></div><button className="primary-btn" onClick={onNew}><Plus size={15} aria-hidden="true" />New request</button></div><div className="filter-bar"><div className="tabs" role="group" aria-label="Request status">{[['all', 'All requests'], ['needs_review', 'Needs review'], ['paid', 'Completed'], ['blocked', 'Blocked']].map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}{value === 'needs_review' && <span className="filter-count">{data.requests.filter(r => r.status === 'needs_review').length}</span>}</button>)}</div><select aria-label="Filter by project" value={project} onChange={event => setProject(event.target.value)}><option value="">All projects</option>{data.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><RequestTable data={data} requests={filtered} onSelect={setRequest} /></>}
        {page === 'Projects' && <ProjectsPage data={data} onProject={showProject} />}
        {page === 'Assistant' && <PurchaseAssistant />}
      </main></div>
    </div>
    {newRequest && <NewRequestForm data={data} close={() => setNewRequest(false)} />}
    {request && <DashboardDialog title={request.title} close={() => setRequest(null)}><span className={`badge ${request.status}`}>{statusLabels[request.status]}</span><p className="detail-amount">{amount(request.amount)} <small>XLM</small></p><p>{request.purpose}</p><p className="muted">{request.id} · Sample record</p></DashboardDialog>}
    {info && <DashboardDialog title={info.title} close={() => setInfo(null)}><p>{info.text}</p></DashboardDialog>}
  </div></div>
}
