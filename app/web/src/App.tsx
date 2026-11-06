import { useEffect, useState } from 'react'
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
