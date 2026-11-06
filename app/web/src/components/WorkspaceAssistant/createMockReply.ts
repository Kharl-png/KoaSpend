import type {
  AssistantMessage,
  WorkspaceAssistantData,
} from '../../types/assistant'

export function createMockReply(
  content: string,
  data: WorkspaceAssistantData,
  id: string,
): AssistantMessage {
  const query = content.toLowerCase()

  if (/\b(cap|limit|budget)\b/.test(query)) {
    return {
      id,
      role: 'assistant',
      content:
        'Here is a sample profile suggestion. Applying it only marks this preview card; it does not change a member’s actual spending limits.',
      suggestion: {
        id: `${id}-suggestion`,
        title: 'Profile suggestion',
        memberName: 'Maya Chen',
        description: 'Set a weekly spending cap of 40 XLM for Maya Chen.',
        weeklyCap: 40,
        currency: 'XLM',
        applied: false,
      },
    }
  }

  if (/\b(request|requests|review)\b/.test(query)) {
    return {
      id,
      role: 'assistant',
      content: `There are ${data.summary.requestCount} sample requests, with ${data.summary.needsReviewCount} needing review. Open Requests to check their amounts and statuses.`,
    }
  }

  if (/\b(summary|summarize|workspace|spending)\b/.test(query)) {
    return {
      id,
      role: 'assistant',
      content: `Your mock workspace has ${data.summary.projectCount} project(s), ${data.summary.requestCount} request(s), and ${data.summary.allocated.toLocaleString()} ${data.summary.currency} in allocated project budgets. Wallet, escrow, and Velo setup are managed in Connections.`,
    }
  }

  return {
    id,
    role: 'assistant',
    content:
      'This preview supports a workspace summary, requests needing review, and a sample spending-cap suggestion. Type a question to try one. A live assistant is not connected yet.',
  }
}
