interface PolicySwitchProps {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function PolicySwitch({
  id,
  label,
  description,
  checked,
  onChange,
}: PolicySwitchProps) {
  return (
    <div className="policy-switch d-flex justify-content-between align-items-start gap-3 py-3">
      <div>
        <label className="fw-medium mb-1" htmlFor={id}>
          {label}
        </label>
        <p id={`${id}-help`} className="policy-muted small mb-0">
          {description}
        </p>
      </div>
      <div className="form-check form-switch flex-shrink-0 mb-0">
        <input
          id={id}
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={checked}
          aria-describedby={`${id}-help`}
          onChange={(event) => onChange(event.target.checked)}
        />
      </div>
    </div>
  )
}
