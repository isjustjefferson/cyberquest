import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#070b10',
        surface: '#0e141b',
        panel: '#131b24',
        border: '#243040',
        muted: '#8ba0b8',
        text: '#e6edf6',
        accent: '#38f2a0',
        accentDim: '#1db97a',
        cyber: '#46b5ff',
        warn: '#ffcf5c',
        danger: '#ff6b81',
        purple: '#b98cff'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        glow: '0 0 30px rgba(56, 242, 160, 0.18)',
        card: '0 18px 40px rgba(0, 0, 0, 0.35)'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        blink: 'blink 1.1s step-end infinite',
        float: 'float 4s ease-in-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
