/** Animated loading spinner */
export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status" aria-label={label}>
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-cyber-border border-t-cyber-accent`} />
      {label && <p className="text-xs text-cyber-muted animate-pulse">{label}</p>}
    </div>
  )
}

/** Full-page loading screen */
export function FullPageLoader({ label = 'Loading AI CyberShield...' }) {
  return (
    <div className="fixed inset-0 bg-cyber-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 animate-spin rounded-full border-2 border-cyber-border border-t-cyber-accent" />
        <p className="text-cyber-muted text-sm animate-pulse">{label}</p>
      </div>
    </div>
  )
}
