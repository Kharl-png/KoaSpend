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
import './App.css'

function getPageFromHash() {
  return (
    navigation.find((item) => item.id === window.location.hash.slice(1)) ??
    navigation[0]
  )
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [page, setPage] = useState<{
    id: SidebarPage
    label: string
  }>(getPageFromHash)

  useEffect(() => {
    function syncPage() {
      setPage(getPageFromHash())
    }

    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  function navigate(id: SidebarPage) {
    window.location.hash = id
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
              <OwnerOverview data={mockOwnerOverview} onNavigate={navigate} />
            ) : page.id === 'requests' && mockSession.user.role === 'owner' ? (
              <OwnerRequests
                data={mockOwnerRequests}
                user={mockSession.user}
                searchQuery={searchQuery ?? ''}
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
