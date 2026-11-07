export interface AssistantSuggestion {
  id: string
  title: string
  memberName: string
  description: string
  weeklyCap: number
  currency: string
  applied: boolean
}

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  suggestion?: AssistantSuggestion
}

export interface WorkspaceAssistantData {
  messages: AssistantMessage[]
  summary: {
    projectCount: number
    requestCount: number
    needsReviewCount: number
    currency: string
    allocated: number
  }
}
