import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react'

type AuthMode = 'owner-signin' | 'owner-signup' | 'member-signin'

function FormField({ id, label, secret = false, error, autoComplete, type = 'text' }: {
  id: string; label: string; secret?: boolean; error?: string; autoComplete: string; type?: string
}) {
  const [visible, setVisible] = useState(false)
  return <div className="field-group">
    <label htmlFor={id}>{label}</label>
    <div className={secret ? 'password-field' : undefined}>
      <input className="form-control" id={id} name={id} type={secret ? (visible ? 'text' : 'password') : type} autoComplete={autoComplete} required aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {secret && <button className="password-toggle" type="button" onClick={() => setVisible(value => !value)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible}>{visible ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}</button>}
    </div>
    {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
  </div>
}

export function AuthPage({ mode, onModeChange, onBack }: {
  mode: AuthMode; onModeChange: (mode: AuthMode) => void; onBack: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState(false)
  const signup = mode === 'owner-signup'
  const member = mode === 'member-signin'
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const next: Record<string, string> = {}
    if (signup && !String(data.get('name') ?? '').trim()) next.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email') ?? '').trim())) next.email = 'Enter a valid email address.'
    const credential = member ? 'access-code' : 'password'
    const value = String(data.get(credential) ?? '')
    if (!value.trim()) next[credential] = member ? 'Enter your access code.' : 'Enter your password.'
    else if (signup && value.length < 8) next.password = 'Use at least 8 characters.'
    setErrors(next)
    setNotice(Object.keys(next).length === 0)
    const firstError = Object.keys(next)[0]
    if (firstError) (form.elements.namedItem(firstError) as HTMLInputElement)?.focus()
  }
  return <div className={`entry-content auth-content ${member ? 'member-content' : ''}`}>
    <button className="back-button" type="button" onClick={onBack}><ArrowLeft size={14} aria-hidden="true" /> Choose a role</button>
    <h2>{signup ? 'Create your owner account' : member ? 'Sign in as team member' : 'Sign in as business Owner'}</h2>
    <div className="auth-form-card">
      {!member && <nav className="auth-switch" aria-label="Owner account">
        <button type="button" aria-current={!signup ? 'page' : undefined} onClick={() => onModeChange('owner-signin')}>Sign in</button>
        <button type="button" aria-current={signup ? 'page' : undefined} onClick={() => onModeChange('owner-signup')}>Sign up</button>
      </nav>}
      <p className="auth-description">{signup ? 'Enter your name and email, then choose a password' : member ? 'Use the email and Access code your owner gave you' : 'Enter your email and password'}</p>
      <form className="login-form" onSubmit={submit} noValidate>
        {signup && <FormField id="name" label="Your name" autoComplete="name" error={errors.name} />}
        <FormField id="email" label="Email" type="email" autoComplete={signup ? 'email' : 'username'} error={errors.email} />
        <FormField id={member ? 'access-code' : 'password'} label={member ? 'Access code' : 'Password'} secret autoComplete={member ? 'off' : signup ? 'new-password' : 'current-password'} error={errors[member ? 'access-code' : 'password']} />
        <button className="sign-in-button" type="submit"><LogIn size={13} aria-hidden="true" />{signup ? 'Create account' : 'Sign in'}</button>
        {notice && <p className="form-notice" role="status">{signup ? 'Account registration' : 'Authentication'} is not available yet.</p>}
      </form>
    </div>
  </div>
}
