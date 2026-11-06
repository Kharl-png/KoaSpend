import { useState } from 'react'
import { ArrowUpRight, Bot, RefreshCw, Wallet, Workflow } from 'lucide-react'
import type { ConnectionsData } from '../../types/connections'
import type { PolicySupplier } from '../../types/policy'
import ConnectionStep from './ConnectionStep'
import WalletDemoDialog from './WalletDemoDialog'
import {
  defaultPermissionEnd,
  permissionError,
  positiveAmount,
  validVeloProject,
} from './connectionHelpers'
import './OwnerConnections.css'

interface OwnerConnectionsProps {
  data: ConnectionsData
  suppliers: PolicySupplier[]
  onChange: (data: ConnectionsData) => void
}

export default function OwnerConnections({
  data,
  suppliers,
  onChange,
}: OwnerConnectionsProps) {
  const [showWallet, setShowWallet] = useState(false)
  const [serviceNotice, setServiceNotice] = useState(
    'Connection has not been tested yet.',
  )
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [agentName, setAgentName] = useState(data.agentName)
  const [limitPayments, setLimitPayments] = useState(data.limitPayments)
  const [paymentLimit, setPaymentLimit] = useState(String(data.paymentLimit))
  const [limitExpiry, setLimitExpiry] = useState(data.limitExpiry)
  const [permissionEnds, setPermissionEnds] = useState(
    () => data.permissionEnds || defaultPermissionEnd(),
  )
  const [deposit, setDeposit] = useState('')
  const [withdrawal, setWithdrawal] = useState('')
  const [project, setProject] = useState(data.veloProject)
  const approvedSuppliers = suppliers.filter((supplier) => supplier.approved)
  const [supplierId, setSupplierId] = useState(
    data.supplierId ?? approvedSuppliers[0]?.id ?? '',
  )
  const ready = Boolean(
    data.walletName && data.accountsCreated && data.registered,
  )
  const permissionChanged =
    agentName.trim() !== data.agentName ||
    limitPayments !== data.limitPayments ||
    (limitPayments && Number(paymentLimit) !== data.paymentLimit) ||
    limitExpiry !== data.limitExpiry ||
    (limitExpiry && permissionEnds !== data.permissionEnds)

  function update(changes: Partial<ConnectionsData>, message: string) {
    onChange({
      ...data,
      ...changes,
    })
    setNotice(message)
    setError('')
  }

  function savePermission() {
    if (!ready) return
    const validation = permissionError(
      agentName,
      limitPayments,
      paymentLimit,
      limitExpiry,
      permissionEnds,
    )
    if (validation) {
      setError(validation)
      return
    }
    update(
      {
        agentName: agentName.trim(),
        limitPayments,
        paymentLimit: limitPayments ? Number(paymentLimit) : data.paymentLimit,
        limitExpiry,
        permissionEnds: limitExpiry ? permissionEnds : '',
        authorized: true,
      },
      'Spending permission saved in the demo. No wallet signature was requested.',
    )
  }

  function moveFunds(direction: 'add' | 'return') {
    if (!ready) return
    const amount = positiveAmount(direction === 'add' ? deposit : withdrawal)
    if (amount === null) {
      setError('Enter a positive amount with up to seven decimal places.')
      return
    }
    if (direction === 'return' && amount > data.escrowBalance) {
      setError('The return amount exceeds the demo escrow balance.')
      return
    }
    const escrowBalance =
      Math.round(
        (data.escrowBalance + (direction === 'add' ? amount : -amount)) * 1e7,
      ) / 1e7
    if (!Number.isFinite(escrowBalance)) {
      setError('Enter a smaller amount.')
      return
    }
    update(
      {
        escrowBalance,
      },
      direction === 'add'
        ? 'Demo balance increased. No funds were transferred.'
        : 'Demo balance reduced. No funds were transferred.',
    )
    if (direction === 'add') setDeposit('')
    else setWithdrawal('')
  }

  return (
    <section className="owner-connections" aria-labelledby="connections-title">
      <h1 id="connections-title" className="connections-title mb-2">
        Connections
      </h1>
      <p className="connections-muted mb-4">
        Check workspace services and set up Testnet payments.
      </p>

      <section aria-labelledby="services-title" className="mb-4">
        <h2 id="services-title" className="h5 mb-2">
          Workspace services
        </h2>
        <p className="connections-muted mb-3">
          Assistant and payment integrations.
        </p>
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <div className="connection-service h-100 p-4 rounded-4 d-flex flex-column align-items-start">
              <Bot size={24} aria-hidden="true" className="mb-3" />
              <h3 className="h6">Google Gemini</h3>
              <p className="connections-muted small">
                Use Gemini or a Relmio-backed n8n workflow for request reviews
                and conversations.
              </p>
              <span className="badge connection-badge mb-2">Not connected</span>
              <p className="small connections-muted" role="status">
                {serviceNotice}
              </p>
              <button
                type="button"
                className="btn connections-outline mt-auto"
                onClick={() =>
                  setServiceNotice(
                    'No assistant provider is configured. A backend connection is required to run a live test.',
                  )
                }
              >
                Test connection
              </button>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="connection-service h-100 p-4 rounded-4 d-flex flex-column align-items-start">
              <Wallet size={24} aria-hidden="true" className="mb-3" />
              <h3 className="h6">Stellar wallet</h3>
              <p className="connections-muted small">
                Choose an owner wallet for Stellar Testnet. Your wallet handles
                owner signatures.
              </p>
              <span className="badge connection-badge">
                {data.walletName
                  ? 'Demo wallet selected'
                  : 'Testnet setup needed'}
              </span>
              <button
                type="button"
                className="btn connections-outline mt-3"
                onClick={() =>
                  document.getElementById('connection-wallet')?.scrollIntoView({
                    block: 'start',
                  })
                }
              >
                Wallet setup
              </button>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="connection-service h-100 p-4 rounded-4 d-flex flex-column align-items-start">
              <Workflow size={24} aria-hidden="true" className="mb-3" />
              <h3 className="h6">Velo + Noir</h3>
              <p className="connections-muted small">
                Test payments require wallet registration, agent permission,
                escrow funding, and Velo setup.
              </p>
              <a
                className="btn connections-outline d-inline-flex align-items-center gap-2 mt-auto"
                href="https://velo-build.dev/"
                target="_blank"
                rel="noreferrer"
              >
                Open Velo
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        className="connection-setup rounded-4 p-3 p-md-4"
        aria-labelledby="test-payments-title"
      >
        <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
          <h2 id="test-payments-title" className="h5 mb-0">
            Set up test payments
          </h2>
          <span className="badge connection-badge">Testnet</span>
        </div>
        <p className="connections-muted mb-0">
          Preview setup with a demo wallet. No live connections or transactions
          are made.
        </p>
        <ol className="list-unstyled mb-0">
          <ConnectionStep
            number={1}
            id="wallet"
            title="Choose your owner wallet"
            description="Select an owner wallet before setting up payment permissions."
          >
            {data.walletName && (
              <p className="small connections-muted">{data.walletName}</p>
            )}
            <button
              type="button"
              className="btn connections-primary"
              onClick={() => setShowWallet(true)}
            >
              {data.walletName ? 'Manage demo wallet' : 'Connect owner wallet'}
            </button>
          </ConnectionStep>

          <ConnectionStep
            number={2}
            id="agent"
            title="Set spending permission"
            description="Set the maximum per payment and when the agent’s permission ends."
          >
            <p className="connection-state rounded-3 p-3 small">
              {!data.walletName
                ? 'Connect your owner wallet in step 1 to get started.'
                : !data.accountsCreated
                  ? 'Create the demo payment accounts to continue.'
                  : !data.registered
                    ? 'Demo accounts created. Register the wallet next.'
                    : 'Demo wallet registered.'}
            </p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <button
                type="button"
                className="btn connections-outline"
                disabled={!data.walletName || data.accountsCreated}
                onClick={() =>
                  update(
                    {
                      accountsCreated: true,
                    },
                    'Demo payment accounts marked as created.',
                  )
                }
              >
                {data.accountsCreated
                  ? 'Accounts created'
                  : 'Create test payment accounts'}
              </button>
              <button
                type="button"
                className="btn connections-outline d-inline-flex align-items-center gap-2"
                onClick={() => {
                  setError('')
                  setNotice(
                    'Demo setup status refreshed. No network request was made.',
                  )
                }}
              >
                <RefreshCw size={14} aria-hidden="true" />
                Refresh setup status
              </button>
              <button
                type="button"
                className="btn connections-outline"
                disabled={!data.accountsCreated || data.registered}
                onClick={() =>
                  update(
                    {
                      registered: true,
                    },
                    'Wallet registration saved in the demo.',
                  )
                }
              >
                {data.registered
                  ? 'Wallet registered'
                  : 'Register wallet with Noir'}
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                savePermission()
              }}
            >
              <div className="mb-3">
                <label className="form-label" htmlFor="agent-name">
                  Payment agent name
                </label>
                <input
                  id="agent-name"
                  className="form-control"
                  maxLength={120}
                  required
                  value={agentName}
                  onChange={(event) => setAgentName(event.target.value)}
                />
              </div>
              <div className="form-check mb-2">
                <input
                  id="agent-limit-toggle"
                  type="checkbox"
                  className="form-check-input"
                  checked={limitPayments}
                  onChange={(event) => setLimitPayments(event.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="agent-limit-toggle"
                >
                  Limit each payment
                </label>
              </div>
              {limitPayments && (
                <div className="mb-3">
                  <label className="form-label" htmlFor="agent-limit">
                    Maximum per payment (test XLM)
                  </label>
                  <input
                    id="agent-limit"
                    className="form-control"
                    type="number"
                    min="0.0000001"
                    step="0.0000001"
                    required
                    value={paymentLimit}
                    onChange={(event) => setPaymentLimit(event.target.value)}
                  />
                  <small className="connections-muted d-block mt-1">
                    Team and project spending limits also apply.
                  </small>
                </div>
              )}
              <div className="form-check mb-2">
                <input
                  id="agent-expiry-toggle"
                  type="checkbox"
                  className="form-check-input"
                  checked={limitExpiry}
                  onChange={(event) => setLimitExpiry(event.target.checked)}
                />
                <label
                  className="form-check-label"
                  htmlFor="agent-expiry-toggle"
                >
                  Set an end date for spending permission
                </label>
              </div>
              {limitExpiry && (
                <div className="mb-3">
                  <label className="form-label" htmlFor="agent-expiry">
                    Permission ends (your local time)
                  </label>
                  <input
                    id="agent-expiry"
                    className="form-control"
                    type="datetime-local"
                    required
                    value={permissionEnds}
                    onChange={(event) => setPermissionEnds(event.target.value)}
                  />
                </div>
              )}
              <button
                type="submit"
                className="btn connections-primary"
                disabled={!ready || (data.authorized && !permissionChanged)}
              >
                {data.authorized && !permissionChanged
                  ? 'Demo permission saved'
                  : 'Review and approve spending'}
              </button>
            </form>
          </ConnectionStep>

          <ConnectionStep
            number={3}
            id="escrow"
            title="Manage funds for team purchases"
            description="Preview adding and returning test XLM held for eligible purchases."
          >
            <div className="connection-state rounded-3 p-3 d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <span>
                {ready
                  ? `Demo escrow balance: ${data.escrowBalance.toLocaleString()} XLM`
                  : 'Balance unavailable · Complete wallet registration in step 2.'}
              </span>
              <button
                type="button"
                className="btn connections-link"
                disabled={!ready}
                onClick={() => {
                  setError('')
                  setNotice(
                    'Demo balance refreshed. No network request was made.',
                  )
                }}
              >
                Refresh balance
              </button>
            </div>
            <div className="row g-3">
              <form
                className="col-12 col-md-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  moveFunds('add')
                }}
              >
                <label className="form-label" htmlFor="escrow-deposit">
                  Amount to add (test XLM)
                </label>
                <input
                  id="escrow-deposit"
                  className="form-control mb-2"
                  type="number"
                  min="0.0000001"
                  step="0.0000001"
                  required
                  value={deposit}
                  onChange={(event) => setDeposit(event.target.value)}
                />
                <button
                  type="submit"
                  className="btn connections-outline"
                  disabled={!ready}
                >
                  Review and add funds
                </button>
              </form>
              <form
                className="col-12 col-md-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  moveFunds('return')
                }}
              >
                <label className="form-label" htmlFor="escrow-return">
                  Amount to return (test XLM)
                </label>
                <input
                  id="escrow-return"
                  className="form-control mb-2"
                  type="number"
                  min="0.0000001"
                  step="0.0000001"
                  required
                  value={withdrawal}
                  onChange={(event) => setWithdrawal(event.target.value)}
                />
                <button
                  type="submit"
                  className="btn connections-outline"
                  disabled={!ready}
                >
                  Review and return funds
                </button>
              </form>
            </div>
          </ConnectionStep>

          <ConnectionStep
            number={4}
            id="velo"
            title="Set up payment fees with Velo"
            description="Link a Velo Testnet project and choose an approved demo supplier."
          >
            <details className="mb-3">
              <summary className="small">Gas Station requirements</summary>
              <p className="small connections-muted mt-2 mb-0">
                A live integration needs a registered Testnet project and scoped
                Gas Station key stored on the server. This preview does not
                collect API keys.
              </p>
            </details>
            <form
              className="mb-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (!data.walletName) return
                if (!validVeloProject(project)) {
                  setError(
                    'Enter a project ID or an HTTPS project URL on velo-build.dev.',
                  )
                  return
                }
                update(
                  {
                    veloProject: project.trim(),
                    supplierId: null,
                  },
                  'Velo project saved in the demo. Gas readiness has not been verified.',
                )
              }}
            >
              <label className="form-label" htmlFor="velo-project">
                Velo project URL or ID
              </label>
              <input
                id="velo-project"
                className="form-control mb-2"
                required
                maxLength={500}
                value={project}
                onChange={(event) => setProject(event.target.value)}
              />
              <div className="d-flex align-items-center flex-wrap gap-3">
                <button
                  type="submit"
                  className="btn connections-outline"
                  disabled={!data.walletName}
                >
                  Save project
                </button>
                <a
                  className="connections-link d-inline-flex align-items-center gap-1"
                  href="https://velo-build.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Velo
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </form>
            <h4 className="h6">Choose a supplier for test purchases</h4>
            <p className="connections-muted small">
              Link an approved shop or service to the demo recipient. No
              business receives payment.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                if (!ready || !data.veloProject) return
                if (
                  !approvedSuppliers.some(
                    (supplier) => supplier.id === supplierId,
                  )
                ) {
                  setError('Choose an approved supplier from Spending policy.')
                  return
                }
                update(
                  {
                    supplierId,
                  },
                  'Demo recipient linked for this session.',
                )
              }}
            >
              <label className="form-label" htmlFor="demo-supplier">
                Approved shop or service
              </label>
              <select
                id="demo-supplier"
                className="form-select mb-2"
                value={supplierId}
                required
                onChange={(event) => setSupplierId(event.target.value)}
              >
                {!approvedSuppliers.length && (
                  <option value="">No approved suppliers</option>
                )}
                {approvedSuppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="btn connections-outline"
                disabled={
                  !ready || !data.veloProject || !approvedSuppliers.length
                }
              >
                Link demo recipient
              </button>
              {data.supplierId && (
                <p className="connections-muted small mt-2 mb-0">
                  Linked:{' '}
                  {suppliers.find((supplier) => supplier.id === data.supplierId)
                    ?.name ?? 'Supplier unavailable'}
                </p>
              )}
            </form>
          </ConnectionStep>
        </ol>
        {error && (
          <p className="connections-error small" role="alert">
            {error}
          </p>
        )}
        <p className="connections-muted small mb-0" role="status">
          {notice}
        </p>
      </section>
      {showWallet && (
        <WalletDemoDialog
          onClose={() => setShowWallet(false)}
          onConnect={() =>
            update(
              {
                walletName: 'KoaSpend demo wallet · Stellar Testnet',
              },
              'Demo wallet selected. No wallet provider was connected.',
            )
          }
        />
      )}
    </section>
  )
}
