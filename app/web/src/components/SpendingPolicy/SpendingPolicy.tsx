import { useState } from 'react'
import { Plus, ShieldCheck } from 'lucide-react'
import type { SpendingPolicyData } from '../../types/policy'
import PolicySwitch from './PolicySwitch'
import PolicySection from './PolicySection'
import SupplierDialog from './SupplierDialog'
import { validatePolicy } from './validatePolicy'
import './SpendingPolicy.css'

interface SpendingPolicyProps {
  data: SpendingPolicyData
  onSave: (data: SpendingPolicyData) => void
}

export default function SpendingPolicy({ data, onSave }: SpendingPolicyProps) {
  const [draft, setDraft] = useState(data)
  const [showSupplier, setShowSupplier] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const dirty = JSON.stringify(draft) !== JSON.stringify(data)

  function update<K extends keyof SpendingPolicyData>(
    field: K,
    value: SpendingPolicyData[K],
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
    setNotice('')
    setError('')
  }

  function save() {
    const validationError = validatePolicy(draft)
    if (validationError) {
      setError(validationError)
      return
    }
    if (!dirty) {
      setNotice('No unsaved changes.')
      return
    }
    const saved = {
      ...draft,
      instructions: draft.instructions.trim(),
      version: data.version + 1,
    }
    onSave(saved)
    setDraft(saved)
    setNotice('Policy saved for this session.')
    setError('')
  }

  return (
    <section className="spending-policy" aria-labelledby="policy-title">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 id="policy-title" className="policy-title mb-2">
            Spending policy
          </h1>
          <p className="policy-muted mb-0">
            Set limits, review purchasing rules and approve suppliers.
          </p>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <div className="policy-panel rounded-4 p-3 p-md-4">
          <PolicySection
            id="boundaries-title"
            title="Spending boundaries"
            description="Set purchase and project limits."
          >
            <div className="row g-3 mb-3">
              {[
                {
                  field: 'automaticLimit',
                  label: 'Automatic purchase limit',
                },
                {
                  field: 'requestLimit',
                  label: 'Maximum per request',
                },
                {
                  field: 'projectLimit',
                  label: 'Maximum per project',
                },
              ].map(({ field, label }) => (
                <div key={field} className="col-12 col-md-4">
                  <label className="form-label" htmlFor={`policy-${field}`}>
                    {label}
                  </label>
                  <div className="input-group">
                    <input
                      id={`policy-${field}`}
                      className="form-control"
                      type="number"
                      min="0"
                      step="0.0000001"
                      required
                      value={
                        Number.isNaN(
                          draft[
                            field as
                              'automaticLimit' | 'requestLimit' | 'projectLimit'
                          ],
                        )
                          ? ''
                          : draft[
                              field as
                                | 'automaticLimit'
                                | 'requestLimit'
                                | 'projectLimit'
                            ]
                      }
                      onChange={(event) =>
                        update(
                          field as
                            'automaticLimit' | 'requestLimit' | 'projectLimit',
                          event.target.valueAsNumber,
                        )
                      }
                    />
                    <span className="input-group-text">{draft.currency}</span>
                  </div>
                </div>
              ))}
            </div>
            <PolicySwitch
              id="policy-automatic"
              label="Allow automatic Testnet payments"
              description="Requires wallet, escrow, and Velo setup. The automatic purchase limit applies."
              checked={draft.automaticPayments}
              onChange={(value) => update('automaticPayments', value)}
            />
            <PolicySwitch
              id="policy-paused"
              label="Pause all new spending"
              description="Pause new purchases and keep existing records."
              checked={draft.paused}
              onChange={(value) => update('paused', value)}
            />
          </PolicySection>

          <PolicySection
            id="resources-title"
            title="Permitted resources"
            description="Choose allowed expense categories."
          >
            <fieldset>
              <legend className="visually-hidden">
                Allowed expense categories
              </legend>
              <div className="d-flex flex-wrap gap-3 mb-3">
                {draft.categories.map((category, index) => (
                  <div className="form-check policy-category" key={category}>
                    <input
                      id={`policy-category-${index}`}
                      className="form-check-input"
                      type="checkbox"
                      checked={draft.allowedCategories.includes(category)}
                      onChange={(event) =>
                        update(
                          'allowedCategories',
                          event.target.checked
                            ? [...draft.allowedCategories, category]
                            : draft.allowedCategories.filter(
                                (item) => item !== category,
                              ),
                        )
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`policy-category-${index}`}
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
            <PolicySwitch
              id="policy-reference"
              label="Require a supporting reference"
              description="Require a quote or purchase link before approval."
              checked={draft.requireReference}
              onChange={(value) => update('requireReference', value)}
            />
          </PolicySection>

          <PolicySection
            id="agreement-title"
            title="Your team’s agreement"
            description="Write purchasing guidance for your team and assistant."
          >
            <label className="form-label" htmlFor="policy-instructions">
              Purchasing instructions
            </label>
            <textarea
              id="policy-instructions"
              className="form-control"
              required
              rows={6}
              maxLength={10000}
              aria-describedby="policy-instructions-help"
              value={draft.instructions}
              onChange={(event) => update('instructions', event.target.value)}
            />
            <small
              id="policy-instructions-help"
              className="policy-muted d-block mt-2"
            >
              These instructions do not override spending limits.
            </small>
          </PolicySection>

          <PolicySection
            id="suppliers-title"
            title="Supplier directory"
            description="Manage approved suppliers."
          >
            <ul className="list-unstyled mb-0">
              {draft.suppliers.map((supplier) => (
                <li
                  className="policy-supplier d-flex justify-content-between align-items-center flex-wrap gap-3 py-3"
                  key={supplier.id}
                >
                  <div>
                    <strong>{supplier.name}</strong>
                    <p className="policy-muted small mb-0">
                      {supplier.domain} · {supplier.category}
                    </p>
                  </div>
                  <span className="badge policy-version">
                    {supplier.approved ? 'Approved' : 'Not approved'}
                  </span>
                </li>
              ))}
              {!draft.suppliers.length && (
                <li className="policy-muted py-3">No suppliers yet.</li>
              )}
            </ul>
            <button
              type="button"
              className="btn policy-outline d-flex justify-content-center align-items-center gap-2 w-100 mt-3"
              onClick={() => setShowSupplier(true)}
            >
              <Plus size={17} aria-hidden="true" />
              Add supplier
            </button>
          </PolicySection>
          <div className="policy-footer d-flex justify-content-between align-items-center flex-wrap gap-3 pt-4">
            <span className="policy-muted small d-inline-flex align-items-center gap-2">
              <ShieldCheck size={16} aria-hidden="true" />
              Only the owner can change this policy.
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn policy-outline"
                disabled={!dirty}
                onClick={() => {
                  setDraft(data)
                  setError('')
                  setNotice('Unsaved changes discarded.')
                }}
              >
                Discard changes
              </button>
              <button type="submit" className="btn policy-primary">
                Save policy
              </button>
            </div>
          </div>
          {error && (
            <p className="policy-error small mt-3 mb-0" role="alert">
              {error}
            </p>
          )}
          <p className="policy-muted small mt-3 mb-0" role="status">
            {notice || (dirty ? 'Unsaved changes' : '')}
          </p>
        </div>
      </form>
      {showSupplier && (
        <SupplierDialog
          categories={draft.categories}
          suppliers={draft.suppliers}
          onClose={() => setShowSupplier(false)}
          onSave={(supplier) =>
            update('suppliers', [...draft.suppliers, supplier])
          }
        />
      )}
    </section>
  )
}
