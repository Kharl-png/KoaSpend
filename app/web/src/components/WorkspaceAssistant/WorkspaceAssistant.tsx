import { useRef, useState } from 'react'
import { ArrowUp, Wallet, Landmark, Link2 } from 'lucide-react'
import type { WorkspaceAssistantData } from '../../types/assistant'
import type { User } from '../../types/workspace'
import type { SidebarPage } from '../Sidebar/navigation'
import AssistantConversation from './AssistantConversation'
import { createMockReply } from './createMockReply'
import './WorkspaceAssistant.css'

interface WorkspaceAssistantProps {
  initialDraft?: string
  data: WorkspaceAssistantData
  user: User
  onNavigate: (page: SidebarPage) => void
}

const quickActions = [
  {
    label: 'Connect wallet',
    icon: Wallet,
  },
  {
    label: 'Fund escrow',
    icon: Landmark,
  },
  {
    label: 'Link Velo',
    icon: Link2,
  },
]

export default function WorkspaceAssistant({
  initialDraft = '',
  data,
  user,
  onNavigate,
}: WorkspaceAssistantProps) {
  const [messages, setMessages] = useState(data.messages)
  const [draft, setDraft] = useState(initialDraft)
  const messageSequence = useRef(0)

  function sendMessage(value: string) {
    const content = value.trim()
    if (!content) return
    messageSequence.current += 1
    const id = `message-${Date.now()}-${messageSequence.current}`

    setMessages((current) => [
      ...current,
      {
        id,
        role: 'user',
        content,
      },
      createMockReply(content, data, `${id}-reply`),
    ])
    setDraft('')
  }

  function applySuggestion(messageId: string) {
    setMessages((current) =>
      current.map((message) => {
        if (message.id !== messageId || !message.suggestion) return message

        return {
          ...message,
          suggestion: {
            ...message.suggestion,
            applied: true,
          },
        }
      }),
    )
  }

  return (
    <section className="workspace-assistant" aria-labelledby="assistant-title">
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-4">
        <div>
          <h1 id="assistant-title" className="assistant-title mb-2">
            Workspace Assistant
          </h1>
          <p className="assistant-muted mb-0">
            Review workspace activity, spending rules, and team profiles.
          </p>
        </div>
      </div>

      <div className="assistant-panel rounded-4 overflow-hidden">
        <div className="assistant-actions d-flex flex-wrap gap-2 px-3 py-2">
          {quickActions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className="btn assistant-action d-inline-flex align-items-center gap-2"
              onClick={() => onNavigate('connections')}
            >
              <Icon size={14} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <AssistantConversation
          messages={messages}
          user={user}
          onApplySuggestion={applySuggestion}
        />

        <div className="px-3 px-md-4 pb-3">
          <form
            className="assistant-composer d-flex align-items-end gap-2 rounded-3 p-2"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage(draft)
            }}
          >
            <label
              htmlFor="workspace-assistant-message"
              className="visually-hidden"
            >
              Message the workspace assistant
            </label>
            <textarea
              id="workspace-assistant-message"
              className="form-control border-0 shadow-none"
              placeholder="I’m working on… and I need…"
              rows={2}
              maxLength={4000}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  sendMessage(draft)
                }
              }}
            />
            <button
              type="submit"
              className="btn assistant-send rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
              aria-label="Send message"
              disabled={!draft.trim()}
            >
              <ArrowUp size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
