import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function DashboardDialog({ title, subtitle, close, children, className = '' }: {
  title: string; subtitle?: string; close: () => void; children: ReactNode; className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const active = document.activeElement as HTMLElement
    ref.current?.showModal()
    return () => { if (active?.isConnected) active.focus() }
  }, [])
  return <dialog className={`member-dialog ${className}`} ref={ref} aria-label={title} onCancel={close} onClick={event => { if (event.target === ref.current) close() }}>
    <div className="modal-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-btn" type="button" aria-label="Close dialog" onClick={close}><X size={18} aria-hidden="true" /></button></div>
    {children}
  </dialog>
}
