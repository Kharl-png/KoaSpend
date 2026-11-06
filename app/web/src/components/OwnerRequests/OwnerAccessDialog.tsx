import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { User } from '../../types/workspace'

interface OwnerAccessDialogProps {
  user: User
  onClose: () => void
}

export default function OwnerAccessDialog({
  user,
  onClose,
}: OwnerAccessDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialog.current?.open) {
      dialog.current?.showModal()
    }
  }, [])

  return (
    <dialog
      ref={dialog}
      className="requests-access-dialog p-0"
      aria-labelledby="request-access-title"
      aria-describedby="request-access-description"
      onClose={onClose}
    >
      <div className="modal-content border-0 p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <h2 id="request-access-title" className="h5 mb-0">
            Your verified session
          </h2>
          <button
            type="button"
            className="btn requests-icon-button p-0"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <p id="request-access-description" className="requests-muted">
          Each person uses their own email and private code.
        </p>
        <p className="mb-2">
          Signed in as <strong>{user.name}</strong> · Workspace owner
        </p>
        <p className="requests-muted mb-4">
          Purchase requests are submitted from a team member account.
        </p>
        <button
          type="button"
          className="btn requests-primary align-self-end"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </dialog>
  )
}
