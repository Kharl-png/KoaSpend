import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'
import type { AssistantMessage } from '../../types/assistant'
import type { User } from '../../types/workspace'

interface AssistantConversationProps {
  messages: AssistantMessage[]
  user: User
  onApplySuggestion: (messageId: string) => void
}

export default function AssistantConversation({
  messages,
  user,
  onApplySuggestion,
}: AssistantConversationProps) {
  const conversation = useRef<HTMLDivElement>(null)
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()

  useEffect(() => {
    const element = conversation.current
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={conversation}
      className="assistant-conversation p-3 p-md-4"
      role="log"
      aria-label="Workspace assistant conversation"
      aria-live="polite"
      aria-relevant="additions text"
      tabIndex={0}
    >
      {messages.map((message) => (
        <article
          key={message.id}
          className="assistant-message d-flex align-items-start gap-3"
        >
          <span
            className="assistant-avatar rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
            aria-hidden="true"
          >
            {message.role === 'assistant' ? <Sparkles size={18} /> : initials}
          </span>
          <div className="assistant-message-content flex-grow-1">
            <h2 className="assistant-message-author mb-2">
              {message.role === 'assistant' ? 'KoaSpend' : user.name}
            </h2>
            <p className="assistant-message-text mb-0">{message.content}</p>
            {message.suggestion && (
              <section
                className="assistant-suggestion rounded-4 p-3 p-md-4 mt-3"
                aria-label={message.suggestion.title}
              >
                <h3 className="h6 mb-3">{message.suggestion.title}</h3>
                <p className="small assistant-muted">
                  Member: {message.suggestion.memberName}
                </p>
                <p>{message.suggestion.description}</p>
                <dl className="mb-3">
                  <dt className="assistant-muted fw-normal small">
                    Weekly cap ({message.suggestion.currency})
                  </dt>
                  <dd className="mt-1">
                    {message.suggestion.weeklyCap.toLocaleString()}
                  </dd>
                </dl>
                <p className="small assistant-muted">
                  Preview only. No account settings will change.
                </p>
                <button
                  type="button"
                  className="btn assistant-primary"
                  disabled={message.suggestion.applied}
                  onClick={() => onApplySuggestion(message.id)}
                >
                  {message.suggestion.applied
                    ? 'Applied to preview'
                    : 'Apply to preview'}
                </button>
              </section>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
