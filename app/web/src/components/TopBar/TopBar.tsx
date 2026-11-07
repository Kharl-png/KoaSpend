import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Search, X } from 'lucide-react'
import './TopBar.css'

interface TopBarProps {
  pageTitle: string
  onSearch: (query: string) => void
}

export default function TopBar({
  pageTitle,
  onSearch,
}: TopBarProps) {
  const [query, setQuery] = useState('')
  const searchInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  return (
    <header className="workspace-header">
      <div className="topbar d-flex align-items-center justify-content-between flex-wrap gap-3">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb d-flex align-items-center gap-3 mb-0">
            <li className="topbar-muted">Workspace</li>
            <li aria-hidden="true">
              <ChevronRight size={15} />
            </li>
            <li aria-current="page" className="fw-medium">
              {pageTitle}
            </li>
          </ol>
        </nav>

        <div className="topbar-tools d-flex align-items-center flex-wrap gap-4">
          <form
            className="topbar-search d-flex align-items-center gap-2"
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              onSearch(query.trim())
            }}
          >
            <div className="topbar-search-field d-flex align-items-center gap-2">
              <Search size={18} aria-hidden="true" className="flex-shrink-0" />
              <input
                ref={searchInput}
                type="search"
                className="form-control border-0 shadow-none"
                aria-label="Search"
                placeholder="Search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setQuery('')
                    searchInput.current?.blur()
                  }
                }}
              />
              {query && (
                <button
                  type="button"
                  className="btn p-0 topbar-muted"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery('')
                    searchInput.current?.focus()
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <kbd className="topbar-shortcut text-nowrap">Ctrl K</kbd>
          </form>
        </div>
      </div>

    </header>
  )
}
