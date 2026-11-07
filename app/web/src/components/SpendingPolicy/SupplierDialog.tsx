import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { PolicySupplier } from '../../types/policy'
import { normalizeSupplierDomain } from './validatePolicy'

interface SupplierDialogProps {
  categories: string[]
  suppliers: PolicySupplier[]
  onSave: (supplier: PolicySupplier) => void
  onClose: () => void
}

export default function SupplierDialog({
  categories,
  suppliers,
  onSave,
  onClose,
}: SupplierDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [category, setCategory] = useState(
    categories.includes('Services') ? 'Services' : (categories[0] ?? ''),
  )
  const [approved, setApproved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal()
  }, [])

  function save() {
    const normalizedDomain = normalizeSupplierDomain(domain)
    if (!name.trim() || !normalizedDomain || !categories.includes(category)) {
      setError(
        'Enter a name, a domain such as supplier.example, and a category. Do not include https:// or a path.',
      )
      return
    }
    if (
      suppliers.some(
        (supplier) => supplier.domain.toLowerCase() === normalizedDomain,
      )
    ) {
      setError('A supplier with this domain already exists.')
      return
    }
    onSave({
      id: `supplier-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      domain: normalizedDomain,
      category,
      approved,
    })
    onClose()
  }

  return (
    <dialog
      ref={dialog}
      className="policy-dialog p-0"
      aria-labelledby="supplier-title"
      onClose={onClose}
    >
      <form
        className="p-4"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
          <h2 id="supplier-title" className="h5 mb-0">
            Add a supplier record
          </h2>
          <button
            type="button"
            className="btn policy-close p-0"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="supplier-name">
            Name
          </label>
          <input
            id="supplier-name"
            className="form-control"
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="supplier-domain">
            Website domain
          </label>
          <input
            id="supplier-domain"
            className="form-control"
            required
            maxLength={253}
            placeholder="supplier.example"
            aria-describedby="supplier-domain-help"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          />
          <small
            id="supplier-domain-help"
            className="policy-muted d-block mt-1"
          >
            Domain only. No URL is fetched and no wallet is connected.
          </small>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="supplier-category">
            Category
          </label>
          <select
            id="supplier-category"
            className="form-select"
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="form-check mb-3">
          <input
            id="supplier-approved"
            className="form-check-input"
            type="checkbox"
            checked={approved}
            onChange={(event) => setApproved(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="supplier-approved">
            Approve this demo supplier
          </label>
          <p className="small policy-muted mb-0">
            This records approval in the local policy only.
          </p>
        </div>
        {error && (
          <p className="policy-error small" role="alert">
            {error}
          </p>
        )}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn policy-outline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="btn policy-primary">
            Save record
          </button>
        </div>
      </form>
    </dialog>
  )
}
