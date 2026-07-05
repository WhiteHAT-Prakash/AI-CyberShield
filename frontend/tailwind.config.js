/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AI CyberShield – Warm Professional Palette
        cyber: {
          black:    '#0e0f14',      // Deep charcoal (was pure black/cold)
          dark:     '#13151c',      // Warm dark background
          navy:     '#1a1d2e',      // Deep warm navy
          blue:     '#1e3a5f',      // Muted deep blue
          accent:   '#0ea5e9',      // Bright teal-sky (replaces cold blue)
          sky:      '#67e8f9',      // Warm cyan highlight
          purple:   '#f97316',      // Warm orange (replaces purple)
          violet:   '#fb923c',      // Amber-orange (replaces violet)
          glow:     '#38bdf8',      // Sky blue glow
          glass:    'rgba(26, 29, 46, 0.65)',   // Warm navy glass
          border:   'rgba(14, 165, 233, 0.22)', // Teal border
          success:  '#22c55e',      // Fresh green
          warning:  '#fbbf24',      // Warm amber
          danger:   '#f43f5e',      // Warm rose-red
          muted:    '#6b7280',      // Neutral grey
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient':     'linear-gradient(135deg, #0e0f14 0%, #1a1d2e 50%, #13151c 100%)',
        'accent-gradient':    'linear-gradient(135deg, #0ea5e9 0%, #f97316 100%)',
        'glass-gradient':     'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(249,115,22,0.1) 100%)',
        'card-gradient':      'linear-gradient(135deg, rgba(26,29,46,0.85) 0%, rgba(19,21,28,0.92) 100%)',
        'danger-gradient':    'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
        'success-gradient':   'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'warning-gradient':   'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      },
      boxShadow: {
        'glass':      '0 8px 32px 0 rgba(14, 165, 233, 0.15)',
        'glow-blue':  '0 0 20px rgba(14, 165, 233, 0.45)',
        'glow-purple':'0 0 20px rgba(249, 115, 22, 0.45)',
        'glow-sm':    '0 0 10px rgba(14, 165, 233, 0.25)',
        'card':       '0 4px 24px rgba(0, 0, 0, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'scan':          'scan 2s ease-in-out infinite',
        'glow-pulse':    'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(14,165,233,0.3)' },
          '50%':      { boxShadow: '0 0 25px rgba(14,165,233,0.6)' },
        },
      },
    },
  },
  plugins: [],
}
