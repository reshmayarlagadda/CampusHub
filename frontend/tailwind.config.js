/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040812',
          900: '#060d1f',
          800: '#0a1628',
          700: '#0f1f3d',
          600: '#162847',
        },
        royal: {
          500: '#2563eb',
          600: '#1d4ed8',
          400: '#3b82f6',
          300: '#60a5fa',
        },
        accent: {
          cyan: '#22d3ee',
          purple: '#a78bfa',
          indigo: '#818cf8',
        }
      },
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
        body: ['system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #040812 0%, #0a1628 50%, #0f1f3d 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(10,22,40,0.9), rgba(15,31,61,0.8))',
        'blue-gradient': 'linear-gradient(135deg, #2563eb, #7c3aed)',
        'cyan-gradient': 'linear-gradient(135deg, #22d3ee, #2563eb)',
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(37, 99, 235, 0.3)',
        'glow-cyan': '0 0 30px rgba(34, 211, 238, 0.3)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(37,99,235,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(37,99,235,0.6)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
