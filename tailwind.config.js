/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#17C662',
        'primary-fixed': '#0fad54',
        secondary: '#F5FF6C',
        neutral: '#F9FEF6',
        'on-surface': '#064E3B',
        'on-surface-secondary': '#64748B',
        'border-glass': 'rgba(255, 255, 255, 0.8)',
        success: '#17C662',
        error: '#F43F5E',
        warning: '#F59E0B',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        full: '9999px',
      },
      boxShadow: {
        'glass': '0 12px 40px rgba(23, 198, 98, 0.08)',
        'hero':  '0 16px 50px rgba(23, 198, 98, 0.20)',
        'btn':   '0 8px 16px rgba(23, 198, 98, 0.25)',
        'glow':  '0 0 40px rgba(23, 198, 98, 0.15)',
      },
      backdropBlur: {
        glass: '24px',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'shimmer':    'shimmer 1.5s infinite',
        'float':      'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:  { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown:{ '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:    { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
      },
    },
  },
  plugins: [],
}
