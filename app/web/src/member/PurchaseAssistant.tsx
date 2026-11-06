import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react'

const prompts = [
  'What can I purchase for my current task?',
  'I need a commercial font license for 25 XLM from Type Foundry for my brand work.',
  'What happens if a purchase is over my allowance?',
]

export function PurchaseAssistant() {
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState(false)
  const composer = useRef<HTMLTextAreaElement>(null)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (message.trim()) setNotice(true)
  }
  return <>
    <div className="page-heading"><div><h1>Purchase Assistant</h1><p>Get help preparing a request for your assigned work.</p></div></div>
    <section className="assistant-workspace" aria-label="Purchase Assistant conversation">
      <div className="chat-messages"><div className="chat-intro">
        <span className="assistant-symbol"><Sparkles size={24} aria-hidden="true" /></span>
        <h2>Tell us what you need</h2>
        <p>Tell me what you’re working on and the resource you need. I can help prepare a purchase request for you to review.</p>
        <div className="prompt-options">{prompts.map(prompt => <button key={prompt} onClick={() => { setMessage(prompt); setNotice(false); composer.current?.focus() }}>{prompt}<ArrowUpRight size={13} aria-hidden="true" /></button>)}</div>
      </div></div>
      <form className="chat-composer" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="assistant-message">Message the purchase assistant</label>
        <textarea ref={composer} id="assistant-message" rows={2} maxLength={3000} placeholder="I’m working on… and I need…" value={message} onChange={event => { setMessage(event.target.value); setNotice(false) }} />
        <button className="primary-btn" type="submit" disabled={!message.trim()} aria-label="Send message"><ArrowRight size={18} aria-hidden="true" /></button>
      </form>
      <p className="chat-disclosure"><ShieldCheck size={11} aria-hidden="true" />Sample workspace. Assistant service is not connected.</p>
      {notice && <p className="assistant-notice" role="status">The assistant is unavailable. Your message has not been sent.</p>}
    </section>
  </>
}
