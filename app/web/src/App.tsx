import { useState } from 'react'
import { ChevronRight, UserRound, UsersRound } from 'lucide-react'
import './App.css'
import { AuthPage } from './AuthPage'
import { AuthBrandingPanel } from './AuthBrandingPanel'

type Role = 'Business Owner' | 'Team Member'
const roles = [
  { title: 'Business Owner', description: 'Create a workspace and manage your team', icon: UsersRound },
  { title: 'Team Member', description: 'Sign in with your registered credentials', icon: UserRound },
] as const

function RoleSelection({ onSelect }: { onSelect: (role: Role) => void }) {
  return <div className="entry-content account-selection">
    <h2>Select account</h2>
    <p className="entry-description">Select a profile to continue</p>
    <div className="role-list">{roles.map(({ title, description, icon: Icon }) => <button className="role-card" type="button" key={title} onClick={() => onSelect(title)}>
      <span className="role-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span>
      <span className="role-copy"><span className="role-title">{title}</span><span className="role-description">{description}</span></span>
      <ChevronRight className="role-chevron" size={20} aria-hidden="true" />
    </button>)}</div>
  </div>
}

function App() {
  const [page, setPage] = useState<'roles' | 'owner-signin' | 'owner-signup' | 'member-signin'>('roles')
  return <main className="container-fluid p-0"><div className="row g-0 app-layout"><AuthBrandingPanel /><section className="entry-panel col-12 col-lg-6" aria-label={page === 'roles' ? 'Choose your role' : page === 'owner-signup' ? 'Create account' : 'Sign in'}>{page === 'roles' ? <RoleSelection onSelect={role => setPage(role === 'Business Owner' ? 'owner-signin' : 'member-signin')} /> : <AuthPage key={page} mode={page} onModeChange={setPage} onBack={() => setPage('roles')} />}</section></div></main>
}
export default App


