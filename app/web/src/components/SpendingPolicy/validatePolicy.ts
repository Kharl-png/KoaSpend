import type { SpendingPolicyData } from '../../types/policy'

export function validatePolicy(policy: SpendingPolicyData): string | null {
  const limits = [
    policy.automaticLimit,
    policy.requestLimit,
    policy.projectLimit,
  ]
  if (limits.some((limit) => !Number.isFinite(limit) || limit < 0)) {
    return 'Limits must be finite, nonnegative amounts.'
  }
  if (policy.automaticLimit > policy.requestLimit) {
    return 'The automatic purchase limit cannot exceed the maximum per request.'
  }
  if (policy.requestLimit > policy.projectLimit) {
    return 'The maximum per request cannot exceed the maximum per project.'
  }
  if (!policy.instructions.trim()) {
    return 'Enter purchasing instructions for your team.'
  }
  if (
    policy.allowedCategories.some(
      (category) => !policy.categories.includes(category),
    )
  ) {
    return 'Choose permitted resources from the workspace categories.'
  }
  return null
}

export function normalizeSupplierDomain(value: string): string | null {
  const domain = value.trim().toLowerCase()
  // Record a domain only; never navigate to it or fetch its contents.
  const label = '[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?'
  return domain.length <= 253 &&
    new RegExp(`^(?:${label}\\.)+[a-z]{2,63}$`).test(domain)
    ? domain
    : null
}
