import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import type { SidebarPage } from './components/Sidebar/Sidebar'
import { mockSession } from './data/mockSession'
import './App.css'

function App() {
  const [page, setPage] = useState<{
    id: SidebarPage
    label: string
  }>({
    id: 'overview',
    label: 'Overview',
  })

  return (
    <div className="app-layout d-flex min-vh-100">
      <Sidebar
        workspace={mockSession.workspace}
        user={mockSession.user}
        activePage={page.id}
        onNavigate={(id, label) =>
          setPage({
            id,
            label,
          })
        }
      />
      <main id="main" className="workspace-content flex-grow-1 p-4 p-md-5">
        <div className="container-fluid p-0">
          <p className="text-secondary small mb-2">KoaSpend / Workspace</p>
          <h1 className="h3 fw-semibold">{page.label}</h1>
          <p className="text-secondary">Your team workspace.</p>
        </div>
      </main>
    </div>
  )
}

export default App
