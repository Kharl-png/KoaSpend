import { useEffect, useRef } from 'react'
import { Info, X } from 'lucide-react'
import { howItWorksSteps } from '../../data/howItWorks'
import './HowItWorks.css'

interface HowItWorksProps {
  onClose: () => void
}

export default function HowItWorks({ onClose }: HowItWorksProps) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialog.current?.open) {
      dialog.current?.showModal()
    }
  }, [])

  return (
    <dialog
      ref={dialog}
      className="how-it-works rounded-4 p-3 p-sm-4"
      aria-labelledby="how-it-works-title"
      onClose={onClose}
    >
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
        <h2 id="how-it-works-title" className="h5 fw-semibold mb-0">
          How spending works
        </h2>
        <button
          type="button"
          className="btn how-it-works-close p-0"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <ol className="list-unstyled mb-4">
        {howItWorksSteps.map((step, index) => (
          <li
            key={step.id}
            className="how-it-works-step d-flex align-items-start gap-3"
          >
            <span
              className="how-it-works-number rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="how-it-works-step-title mb-2">{step.title}</h3>
              <p className="how-it-works-muted mb-0">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="how-it-works-note d-flex align-items-start gap-3 rounded-3 p-3">
        <Info size={18} className="flex-shrink-0 mt-1" aria-hidden="true" />
        <div>
          <p className="mb-2">
            Payments require wallet, escrow, and Velo setup in Connections.
            Purchasing instructions are operational guidance, not a legal
            agreement.
          </p>
          <p className="mb-0">
            This frontend currently uses local demo data; live payments and
            assistant reviews aren’t connected.
          </p>
        </div>
      </div>
    </dialog>
  )
}
