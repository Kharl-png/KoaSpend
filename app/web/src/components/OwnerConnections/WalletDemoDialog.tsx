import { useEffect, useRef } from 'react'
import { Wallet, X } from 'lucide-react'

interface WalletDemoDialogProps {
  onConnect: () => void
  onClose: () => void
}

export default function WalletDemoDialog({
  onConnect,
  onClose,
}: WalletDemoDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialog}
      className="connections-dialog p-4"
      aria-labelledby="wallet-demo-title"
      onClose={onClose}
    >
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <h2 id="wallet-demo-title" className="h5 mb-0">
          Connect owner wallet
        </h2>
        <button
          type="button"
          className="btn connections-close p-0"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <p className="connections-muted">
        Wallet providers aren’t connected yet. Use a demo wallet to preview the
        setup steps.
      </p>
      <p className="small connections-muted">
        No signatures, wallet access, keys, or transfers are requested.
      </p>
      <button
        type="button"
        className="btn connections-primary d-inline-flex align-items-center gap-2"
        onClick={() => {
          onConnect()
          onClose()
        }}
      >
        <Wallet size={17} aria-hidden="true" />
        Use demo wallet
      </button>
    </dialog>
  )
}
