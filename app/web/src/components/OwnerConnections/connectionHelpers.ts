export function positiveAmount(value: string): number | null {
  if (!/^\d+(?:\.\d{1,7})?$/.test(value.trim())) return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

export function validVeloProject(value: string): boolean {
  const text = value.trim()
  if (/^[a-zA-Z0-9_-]{3,128}$/.test(text)) return true
  try {
    const url = new URL(text)
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      (url.hostname === 'velo-build.dev' ||
        url.hostname.endsWith('.velo-build.dev')) &&
      url.pathname !== '/'
    )
  } catch {
    return false
  }
}

export function permissionError(
  agentName: string,
  limitPayments: boolean,
  paymentLimit: string,
  limitExpiry: boolean,
  permissionEnds: string,
  now = Date.now(),
): string | null {
  if (!agentName.trim()) return 'Enter a payment agent name.'
  if (limitPayments && positiveAmount(paymentLimit) === null) {
    return 'Enter a positive payment limit with up to seven decimal places.'
  }
  if (
    limitExpiry &&
    (!permissionEnds ||
      !Number.isFinite(Date.parse(permissionEnds)) ||
      Date.parse(permissionEnds) <= now)
  ) {
    return 'Choose a future end date for spending permission.'
  }
  return null
}
export function defaultPermissionEnd(now = new Date()): string {
  const end = new Date(now)
  end.setDate(end.getDate() + 2)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`
}

