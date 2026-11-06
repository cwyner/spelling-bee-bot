export function BeeMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <polygon points="16,1 29,8.5 29,23.5 16,31 3,23.5 3,8.5" fill="var(--bee-yellow)" />
      <rect x="9" y="12" width="14" height="3" rx="1.5" fill="var(--ink)" />
      <rect x="9" y="18" width="14" height="3" rx="1.5" fill="var(--ink)" />
    </svg>
  )
}

export function Header() {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <BeeMark />
          <h1 className="wordmark">
            Spelling Bee <span className="wordmark-bot">Bot</span>
          </h1>
        </div>
        <p className="topbar-date">{today}</p>
      </div>
    </header>
  )
}
