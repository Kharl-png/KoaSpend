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
import SpendingPolicy from './components/SpendingPolicy/SpendingPolicy'
import { mockSpendingPolicy } from './data/mockSpendingPolicy'
import OwnerActivity from './components/OwnerActivity/OwnerActivity'
import { mockActivity } from './data/mockActivity'
import OwnerConnections from './components/OwnerConnections/OwnerConnections'
import { mockConnections } from './data/mockConnections'
import type { ActivityKind } from './types/activity'
import type { OwnerProjectsData } from './types/projects'
import type { OwnerTeamData } from './types/team'
import './App.css'
import HowItWorks from './components/HowItWorks/HowItWorks'

function getPageFromHash() {
  return (
    navigation.find(
      (item) =>
        item.id !== 'help' &&
        item.id === window.location.hash.slice(1).split('?')[0],
    ) ?? navigation[0]
  )
}

function App() {
  const [showHelp, setShowHelp] = useState(window.location.hash === '#help')
  const [connectionsData, setConnectionsData] = useState(mockConnections)
  const [activityEvents, setActivityEvents] = useState(mockActivity)
  const [policyData, setPolicyData] = useState(mockSpendingPolicy)
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
      if (window.location.hash === '#help') {
        setShowHelp(true)
        return
      }
      setPage(getPageFromHash())
      setRouteHash(window.location.hash)
    }

    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  function navigate(id: SidebarPage) {
    if (id === 'help') {
      setShowHelp(true)
      return
    }
    window.location.hash = id
    setRouteHash(window.location.hash)
    setPage(navigation.find((item) => item.id === id) ?? navigation[0])
  }

  function recordActivity(
    kind: ActivityKind,
    title: string,
    description: string,
  ) {
    const event = {
      id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind,
      title,
      description,
      actorName: mockSession.user.name,
      occurredAt: new Date().toISOString(),
    }
    setActivityEvents((current) => [event, ...current])
  }

  function updateProjects(next: OwnerProjectsData) {
    for (const project of next.projects) {
      if (!projectsData.projects.some((item) => item.id === project.id)) {
        recordActivity(
          'project',
          'Project created',
          `${project.name} received an allowance of ${project.budget} ${next.currency}.`,
        )
      }
    }
    for (const task of next.tasks) {
      if (!projectsData.tasks.some((item) => item.id === task.id)) {
        const member = teamData.people.find(
          (person) => person.id === task.memberId,
        )
        recordActivity(
          'task',
          'Work assigned',
          `${task.title} assigned to ${member?.name ?? 'a team member'}.`,
        )
      }
    }
    setProjectsData(next)
  }

  function updateTeam(next: OwnerTeamData) {
    for (const person of next.people) {
      const previous = teamData.people.find((item) => item.id === person.id)
      if (!previous) {
        recordActivity(
          'member',
          'Team member added',
          `${person.name} joined the workspace as ${person.specialty}.`,
        )
      } else {
        const profile = (item: typeof person) => ({
          ...item,
          active: false,
          codeSet: false,
        })
        if (
          JSON.stringify(profile(previous)) !== JSON.stringify(profile(person))
        ) {
          recordActivity(
            'member',
            'Team profile updated',
            `${person.name}'s profile and spending guidance were updated.`,
          )
        }
      }
    }
    setTeamData(next)
  }

  return (
    <div className="app-layout d-flex min-vh-100">
      {showHelp && (
        <HowItWorks
          onClose={() => {
            setShowHelp(false)
            if (window.location.hash === '#help') {
              window.history.replaceState(
                null,
                '',
                `${window.location.pathname}${window.location.search}#overview`,
              )
              setRouteHash(window.location.hash)
            }
          }}
        />
      )}
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
                  policyVersion: policyData.version,
                  policyActive: !policyData.paused,
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
                onChange={updateProjects}
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
                onChange={updateTeam}
                onAccessChange={(person, action) =>
                  recordActivity(
                    'access',
                    action === 'remove'
                      ? 'Member access removed'
                      : person.codeSet
                        ? 'Member code reset'
                        : 'Member code issued',
                    action === 'remove'
                      ? `${person.name} was marked inactive in this session.`
                      : `Demo access updated for ${person.name}.`,
                  )
                }
                onDraftProfile={(person) => {
                  setAssistantDraft(
                    person
                      ? `Help improve ${person.name}'s responsibilities and purchasing guidance. Role: ${person.specialty}. Current responsibilities: ${person.responsibilities}`
                      : 'Help me draft a team member profile, responsibilities, and spending guidance.',
                  )
                  navigate('assistant')
                }}
              />
            ) : page.id === 'policy' && mockSession.user.role === 'owner' ? (
              <SpendingPolicy
                data={policyData}
                onSave={(policy) => {
                  setPolicyData(policy)
                  recordActivity(
                    'policy',
                    'Spending policy updated',
                    `Version ${policy.version} saved. Spending is ${policy.paused ? 'paused' : 'active'}.`,
                  )
                }}
              />
            ) : page.id === 'activity' && mockSession.user.role === 'owner' ? (
              <OwnerActivity
                events={activityEvents}
                requests={{
                  ...mockOwnerRequests,
                  projects: projectsData.projects,
                }}
              />
            ) : page.id === 'connections' &&
              mockSession.user.role === 'owner' ? (
              <OwnerConnections
                data={connectionsData}
                suppliers={policyData.suppliers}
                onChange={setConnectionsData}
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
}

export default App
