import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { TeamPerson } from '../../types/team'

interface MemberAccessDialogProps {
  person: TeamPerson
  action: 'code' | 'remove'
  onConfirm: () => void
  onClose: () => void
}

export default function MemberAccessDialog({
  person,
  action,
  onConfirm,
  onClose,
}: MemberAccessDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [code, setCode] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialog}
      className="team-dialog team-access-dialog p-4"
      aria-labelledby="member-access-title"
      onClose={onClose}
    >
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <h2 id="member-access-title" className="h5 mb-0">
          {action === 'remove'
            ? 'Remove access'
            : person.codeSet
              ? 'Reset private code'
              : 'Issue private code'}
        </h2>
        <button
          type="button"
          className="btn team-close p-0"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <p className="mb-2">{person.name}</p>
      <p className="team-muted small">
        {action === 'remove'
          ? 'This marks the member inactive in this session. Assigned work and past requests remain.'
          : 'This generates a demo code for this session only. It cannot sign in to an actual account.'}
      </p>
      {code ? (
        <>
          <output className="team-code d-block rounded-3 p-3 mb-3">
            {code}
          </output>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn team-outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code)
                  setCopyStatus('Copied.')
                } catch {
                  setCopyStatus(
                    'Copy unavailable. Select the code and copy it manually.',
                  )
                }
              }}
            >
              Copy code
            </button>
            <button
              type="button"
              className="btn team-primary"
              onClick={onClose}
            >
              Done
            </button>
          </div>
          <p className="small team-muted mt-2 mb-0" role="status">
            {copyStatus}
          </p>
        </>
      ) : (
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn team-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn team-primary"
            onClick={() => {
              onConfirm()
              if (action === 'remove') {
                onClose()
              } else {
                setCode(
                  `DEMO-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
                )
              }
            }}
          >
            {action === 'remove' ? 'Remove access' : 'Generate demo code'}
          </button>
        </div>
      )}
    </dialog>
  )
}
