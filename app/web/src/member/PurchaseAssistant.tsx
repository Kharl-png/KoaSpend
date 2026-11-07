import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import AssistantConversation from '../components/WorkspaceAssistant/AssistantConversation'
import type { AssistantMessage } from '../types/assistant'
import '../components/WorkspaceAssistant/WorkspaceAssistant.css'
import './PurchaseAssistant.css'

const prompts = [
  'What can I purchase for my current task?',
  'I need a commercial font license for 25 XLM from Type Foundry for my brand work.',
  'What happens if a purchase is over my allowance?',
]
const welcome: AssistantMessage[] = [{
  id: 'purchase-welcome',
  role: 'assistant',
  content: 'Tell us what you need.\nTell me what you’re working on and the resource you need. I can help prepare a purchase request for you to review.',
}]

export function PurchaseAssistant({ userName = 'You' }: { userName?: string }) {
  const [message, setMessage] = useState('')
  const [notice, setNotice] = useState(false)
  const composer = useRef<HTMLTextAreaElement>(null)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (message.trim()) setNotice(true)
  }
  return <section className="purchase-assistant" aria-labelledby="purchase-assistant-title">
    <div className="page-heading"><div><h1 id="purchase-assistant-title">Purchase Assistant</h1><p>Get help preparing a request for your assigned work.</p></div></div>
    <div className="assistant-panel rounded-4 overflow-hidden">
      <AssistantConversation messages={welcome} user={{ id: 'member-preview', name: userName, role: 'member' }} onApplySuggestion={() => { /* The welcome message has no suggestions. */ }} />
      <div className="prompt-options" role="group" aria-label="Suggested purchase questions">{prompts.map(prompt => <button key={prompt} type="button" onClick={() => { setMessage(prompt); setNotice(false); composer.current?.focus() }}>{prompt}<ArrowUpRight size={14} aria-hidden="true" /></button>)}</div>
      <div className="purchase-composer-container">
        <form className="assistant-composer d-flex align-items-end gap-2 rounded-3 p-2" onSubmit={submit}>
          <label className="visually-hidden" htmlFor="assistant-message">Message the purchase assistant</label>
          <textarea ref={composer} className="form-control border-0 shadow-none" id="assistant-message" rows={2} maxLength={3000} placeholder="I’m working on… and I need…" value={message} onChange={event => { setMessage(event.target.value); setNotice(false) }} onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }} />
          <button className="btn assistant-send rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0" type="submit" disabled={!message.trim()} aria-label="Send message"><ArrowUp size={20} aria-hidden="true" /></button>
        </form>
        {notice && <p className="assistant-notice" role="status">The assistant is unavailable. Your message has not been sent.</p>}
      </div>
    </div>
  </section>
}
