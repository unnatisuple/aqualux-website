/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2340',
          50: '#E8EDF4',
          100: '#C5D2E3',
          200: '#9BB5CF',
          300: '#6D92B8',
          400: '#4575A7',
          500: '#0F2340',
          600: '#0C1D35',
          700: '#091629',
          800: '#060F1C',
          900: '#03080E',
        },
        aqua: {
          DEFAULT: '#4ABFBF',
          50: '#EAF8F8',
          100: '#C8EEEE',
          200: '#9FDFDF',
          300: '#76CFCF',
          400: '#5DC7C7',
          500: '#4ABFBF',
          600: '#3BA9A9',
          700: '#2C8F8F',
          800: '#1E7575',
          900: '#0F5B5B',
        },
        warm: {
          white: '#F8F6F2',
          50: '#FDFCFA',
          100: '#F8F6F2',
          200: '#EDE9E0',
          300: '#E0DBCF',
          400: '#CCC5B6',
          500: '#B5AD9C',
        },
        slate: {
          DEFAULT: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-aqua': 'pulseAqua 2s ease-in-out infinite',
        'checkmark': 'checkmark 0.6s ease-out forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseAqua: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(74, 191, 191, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(74, 191, 191, 0)' },
        },
        checkmark: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 2px 20px rgba(15, 35, 64, 0.08)',
        'card-hover': '0 8px 40px rgba(15, 35, 64, 0.16)',
        'nav': '0 4px 24px rgba(15, 35, 64, 0.12)',
        'aqua-glow': '0 0 30px rgba(74, 191, 191, 0.3)',
      },
    },
  },
  plugins: [],
}
