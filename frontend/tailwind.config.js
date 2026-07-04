/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom AI CyberShield brand palette
        cyber: {
          black:    '#0a0a0f',
          dark:     '#0d1117',
          navy:     '#0f1923',
          blue:     '#1a3a5c',
          accent:   '#2563eb',
          sky:      '#38bdf8',
          purple:   '#7c3aed',
          violet:   '#a855f7',
          glow:     '#818cf8',
          glass:    'rgba(15, 25, 35, 0.6)',
          border:   'rgba(99, 102, 241, 0.25)',
          success:  '#10b981',
          warning:  '#f59e0b',
          danger:   '#ef4444',
          muted:    '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient':     'linear-gradient(135deg, #0a0a0f 0%, #0f1923 50%, #0d1117 100%)',
        'accent-gradient':    'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        'glass-gradient':     'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(124,58,237,0.1) 100%)',
        'card-gradient':      'linear-gradient(135deg, rgba(15,25,35,0.8) 0%, rgba(13,17,23,0.9) 100%)',
        'danger-gradient':    'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
        'success-gradient':   'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'warning-gradient':   'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      },
      boxShadow: {
        'glass':      '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow-blue':  '0 0 20px rgba(37, 99, 235, 0.5)',
        'glow-purple':'0 0 20px rgba(124, 58, 237, 0.5)',
        'glow-sm':    '0 0 10px rgba(99, 102, 241, 0.3)',
        'card':       '0 4px 24px rgba(0, 0, 0, 0.4)',
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
          '0%, 100%': { boxShadow: '0 0 10px rgba(99,102,241,0.3)' },
          '50%':      { boxShadow: '0 0 25px rgba(99,102,241,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
