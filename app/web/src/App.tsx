import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import { navigation } from './components/Sidebar/navigation'
import type { SidebarPage } from './components/Sidebar/navigation'
import { mockSession } from './data/mockSession'
import TopBar from './components/TopBar/TopBar'
import OwnerOverview from './components/OwnerOverview/OwnerOverview'
import { mockOwnerOverview } from './data/mockOwnerOverview'
import OwnerRequests from './components/OwnerRequests/OwnerRequests'
import { mockOwnerRequests } from './data/mockOwnerRequests'
import WorkspaceAssistant from './components/WorkspaceAssistant/WorkspaceAssistant'
import { mockWorkspaceAssistant } from './data/mockWorkspaceAssistant'
import OwnerProjects from './components/OwnerProjects/OwnerProjects'
import { mockOwnerProjects } from './data/mockOwnerProjects'
import OwnerTeam from './components/OwnerTeam/OwnerTeam'
import { mockOwnerTeam } from './data/mockOwnerTeam'
import './App.css'

function getPageFromHash() {
  return (
    navigation.find(
      (item) => item.id === window.location.hash.slice(1).split('?')[0],
    ) ?? navigation[0]
  )
}

function App() {
  const [teamData, setTeamData] = useState(mockOwnerTeam)
  const [assistantDraft, setAssistantDraft] = useState('')
  const [projectsData, setProjectsData] = useState(mockOwnerProjects)
  const [routeHash, setRouteHash] = useState(window.location.hash)
  const requestProjectId =
    new URLSearchParams(routeHash.split('?')[1]).get('project') ?? 'all'
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [page, setPage] = useState<{
    id: SidebarPage
    label: string
  }>(getPageFromHash)

  useEffect(() => {
    function syncPage() {
      setPage(getPageFromHash())
      setRouteHash(window.location.hash)
    }

    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  function navigate(id: SidebarPage) {
    window.location.hash = id
    setRouteHash(window.location.hash)
    setPage(navigation.find((item) => item.id === id) ?? navigation[0])
  }

  return (
    <div className="app-layout d-flex min-vh-100">
      <Sidebar
        workspace={mockSession.workspace}
        user={mockSession.user}
        activePage={page.id}
        onNavigate={navigate}
      />
      <div className="workspace-content flex-grow-1">
        <TopBar
          pageTitle={page.label}
          workspace={mockSession.workspace}
          onSearch={(query) => {
            setSearchQuery(query)
            navigate('requests')
          }}
          onConnectionStatus={() => {
            navigate('connections')
          }}
        />
        <main id="main" className="p-4 p-md-5">
          <div className="container-fluid p-0">
            {page.id === 'overview' && mockSession.user.role === 'owner' ? (
              <OwnerOverview
                data={{
                  ...mockOwnerOverview,
                  projects: projectsData.projects,
                }}
                onNavigate={navigate}
              />
            ) : page.id === 'requests' && mockSession.user.role === 'owner' ? (
              <OwnerRequests
                key={requestProjectId}
                initialProjectId={requestProjectId}
                data={{
                  ...mockOwnerRequests,
                  projects: projectsData.projects,
                }}
                user={mockSession.user}
                searchQuery={searchQuery ?? ''}
              />
            ) : page.id === 'projects' && mockSession.user.role === 'owner' ? (
              <OwnerProjects
                data={{
                  ...projectsData,
                  members: teamData.people
                    .filter(
                      (person) => person.role === 'member' && person.active,
                    )
                    .map((person) => ({
                      id: person.id,
                      name: person.name,
                    })),
                }}
                onChange={setProjectsData}
                onViewRequests={(projectId) => {
                  setSearchQuery(null)
                  window.location.hash = `requests?project=${encodeURIComponent(projectId)}`
                  setRouteHash(window.location.hash)
                  setPage(getPageFromHash())
                }}
              />
            ) : page.id === 'team' && mockSession.user.role === 'owner' ? (
              <OwnerTeam
                data={teamData}
                tasks={projectsData.tasks}
                onChange={setTeamData}
                onDraftProfile={(person) => {
                  setAssistantDraft(
                    person
                      ? `Help improve ${person.name}'s responsibilities and purchasing guidance. Role: ${person.specialty}. Current responsibilities: ${person.responsibilities}`
                      : 'Help me draft a team member profile, responsibilities, and spending guidance.',
                  )
                  navigate('assistant')
                }}
              />
            ) : page.id === 'assistant' ? (
              <WorkspaceAssistant
                data={mockWorkspaceAssistant}
                user={mockSession.user}
                initialDraft={assistantDraft}
                onNavigate={navigate}
              />
            ) : (
              <>
                <h1 className="h3 fw-semibold">{page.label}</h1>
                <p className="text-secondary">Your team workspace.</p>
                {page.id === 'requests' && searchQuery !== null && (
                  <p className="text-secondary" role="status">
                    {searchQuery
                      ? `No requests found for “${searchQuery}”.`
                      : 'No requests yet.'}
                  </p>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
import { MemberDashboard } from './member/MemberDashboard'

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  useEffect(() => {
    const restore = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])
  if (/^\/member(?:\/|$)/.test(pathname)) return <MemberDashboard />
  return <h1>KoaSpend</h1>
}

export default App
