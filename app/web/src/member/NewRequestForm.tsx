import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Send, ShieldCheck } from 'lucide-react'
import { DashboardDialog } from './DashboardDialog'
import { amount } from './data'
import type { MemberData } from './data'

export function NewRequestForm({ data, close }: { data: MemberData; close: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState(false)
  const [attachment, setAttachment] = useState<File | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const suppliers = data.suppliers ?? []
  const categories = data.categories ?? ['Creative assets', 'Software', 'Equipment', 'Services']
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const text = (name: string) => String(values.get(name) ?? '').trim()
    const next: Record<string, string> = {}
    if (text('title').length < 5) next.title = 'Enter a request title of at least 5 characters.'
    if (!data.tasks?.some(task => task.id === text('task'))) next.task = 'Choose an assigned task.'
    if (!suppliers.some(supplier => supplier.id === text('supplier'))) next.supplier = 'Choose a supplier.'
    if (!categories.includes(text('category'))) next.category = 'Choose a category.'
    if (!/^\d+(\.\d{1,7})?$/.test(text('amount')) || !Number.isFinite(Number(text('amount'))) || Number(text('amount')) <= 0) next.amount = 'Enter an amount greater than zero, with up to 7 decimal places.'
    if (text('purpose').length < 15) next.purpose = 'Explain how this supports your task in at least 15 characters.'
    if (text('quote')) {
      try { if (!['http:', 'https:'].includes(new URL(text('quote')).protocol)) next.quote = 'Enter an HTTP or HTTPS quote URL.' } catch { next.quote = 'Enter a valid quote URL.' }
    } else if (!attachment) next.quote = 'Add a quote link or attach a quote or screenshot.'
    if (errors.attachment) next.attachment = errors.attachment
    setErrors(next)
    setNotice(Object.keys(next).length === 0)
    const first = Object.keys(next)[0]
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus()
  }
  const errorProps = (name: string) => ({
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': [(['amount', 'quote', 'attachment'].includes(name) ? `${name}-help` : ''), errors[name] ? `${name}-error` : ''].filter(Boolean).join(' ') || undefined,
  })
  const error = (name: string) => errors[name] ? <p className="request-field-error" id={`${name}-error`} role="alert">{errors[name]}</p> : null
  return <DashboardDialog title="What do you need for the work?" subtitle="A little context helps the right purchase move forward." close={close} className="new-request-dialog">
    <form className="new-request-form" onSubmit={submit} noValidate onChange={() => setNotice(false)}>
      <div className="request-field"><label htmlFor="request-title">Request title</label><input id="request-title" name="title" required minLength={5} maxLength={120} placeholder="e.g. Commercial font license" {...errorProps('title')} />{error('title')}</div>
      <div className="request-field"><label htmlFor="request-task">Assigned task</label><select id="request-task" name="task" required {...errorProps('task')}>{!data.tasks?.length && <option value="">No assigned tasks</option>}{data.tasks?.map(task => <option key={task.id} value={task.id}>{task.title}</option>)}</select>{error('task')}</div>
      <div className="request-form-pair">
        <div className="request-field"><label htmlFor="request-supplier">Supplier</label><select id="request-supplier" name="supplier" required {...errorProps('supplier')}>{!suppliers.length && <option value="">No suppliers available</option>}{suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}</select>{error('supplier')}</div>
        <div className="request-field"><label htmlFor="request-category">Category</label><select id="request-category" name="category" required {...errorProps('category')}>{categories.map(category => <option key={category}>{category}</option>)}</select>{error('category')}</div>
      </div>
      <div className="request-field"><label htmlFor="request-amount">Purchase amount</label><div className="request-amount-input"><input id="request-amount" name="amount" required inputMode="decimal" placeholder="0.00" {...errorProps('amount')} /><span>XLM</span></div><small id="amount-help">Automatic review limit: {amount(data.policy.autoLimit ?? 40)} XLM. Per request: {amount(data.policy.perRequest)} XLM.</small>{error('amount')}</div>
      <div className="request-field"><label htmlFor="request-purpose">How does it support your task?</label><textarea id="request-purpose" name="purpose" required minLength={15} maxLength={3000} rows={3} placeholder="Describe the resource, why you need it, and what it helps deliver." {...errorProps('purpose')} />{error('purpose')}</div>
      <p className="request-network"><strong>Payment network</strong> · Stellar Testnet</p>
      <div className="request-field"><label htmlFor="request-quote">Quote or purchase link</label><input id="request-quote" name="quote" type="url" placeholder="https://supplier.example/quote" {...errorProps('quote')} /><small id="quote-help">The prototype records the link without fetching external pages. A link alone is not verified evidence.</small>{error('quote')}</div>
      <div className="request-field"><label htmlFor="request-attachment">Or attach a quote or screenshot</label><input ref={fileInput} id="request-attachment" name="attachment" type="file" accept="image/png,image/jpeg,application/pdf" {...errorProps('attachment')} onChange={event => {
        const file = event.target.files?.[0] ?? null
        const message = file && file.size > 1000000 ? 'Use a file under 1 MB.' : file && !['image/png', 'image/jpeg', 'application/pdf'].includes(file.type) ? 'Use a PNG, JPEG, or PDF file.' : ''
        setAttachment(message ? null : file)
        setErrors(previous => { const next = { ...previous }; delete next.attachment; if (message) next.attachment = message; return next })
        if (message && fileInput.current) fileInput.current.value = ''
      }} /><small id="attachment-help">PNG, JPEG, or PDF under 1 MB. The owner can open the attachment when reviewing your request.</small>{error('attachment')}</div>
      <div className="request-notice"><ShieldCheck size={15} aria-hidden="true" /><p>This request uses your member identity and assigned task. Payments use test XLM.</p></div>
      {notice && <p className="request-submit-notice" role="status">Request submission is not connected yet. Your request has not been sent.</p>}
      <div className="request-form-footer"><button className="request-cancel" type="button" onClick={close}>Cancel</button><button className="primary-btn" type="submit"><Send size={14} aria-hidden="true" />Send request</button></div>
    </form>
  </DashboardDialog>
}
