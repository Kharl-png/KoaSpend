import './AuthBrandingPanel.css'

/** Shared branding stays mounted while the authentication form changes. */
export function AuthBrandingPanel() {
  return <aside className="brand-panel col-12 col-lg-6">
    <div className="brand-logo">
      <img src={`${import.meta.env.BASE_URL}images/KoaSpend.png`} alt="KoaSpend logo" width="500" height="500" />
      <span>KoaSpend</span>
    </div>
    <div className="brand-content">
      <img className="brand-mascot" src={`${import.meta.env.BASE_URL}images/Mascot2.png`} alt="KoaSpend koala mascot holding a coin" width="432" height="578" />
      <h1>Smart<br />spending,<br />zero effort.<br />Just like a<br /><span className="headline-dot">koala.</span></h1>
    </div>
  </aside>
}
