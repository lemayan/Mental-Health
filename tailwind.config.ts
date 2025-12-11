import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette (Trust & Calm)
        primary: {
          50: '#F4F9FB',
          100: '#E8F3F7',
          200: '#C5DFE8',
          300: '#9BC7D6',
          400: '#6BACC0',
          500: '#4A90A4',
          600: '#2D6A8E',
          700: '#1E4D6B',
        },
        // Accent Palette (Warmth & Hope)
        accent: {
          100: '#FEF6E6',
          300: '#F8DA93',
          400: '#F5C76A',
          500: '#F2B441',
          600: '#D99A2B',
        },
        // Support Palette (Friendly Warmth)
        support: {
          100: '#FCF0EA',
          200: '#F7D4C4',
          400: '#EC9E7A',
          500: '#E67E52',
          600: '#C9653D',
        },
        // Neutral Palette
        neutral: {
          50: '#F7F9FA',
          100: '#F3F4F6',
          200: '#E0E6EA',
          300: '#D1D5DB',
          400: '#9FA9B2',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#2B2B2B',
          900: '#1A1A1A',
        },
        // Semantic Colors
        crisis: {
          100: '#FEE2E2',
          600: '#DC2626',
          700: '#B91C1C',
        },
        success: {
          100: '#DCFCE7',
          500: '#22C55E',
          600: '#15803D',
        },
        warning: {
          100: '#FEF9C3',
          500: '#EAB308',
          600: '#CA8A04',
        },
        error: {
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif',
        ],
      },
      fontSize: {
        // Custom sizes with line-height and letter-spacing
        display: ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h1: ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h2: ['1.5rem', { lineHeight: '1.33', letterSpacing: '-0.01em' }],
        h3: ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
        h4: ['1.125rem', { lineHeight: '1.44', letterSpacing: '0' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        body: ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        caption: ['0.875rem', { lineHeight: '1.4', letterSpacing: '0' }],
        overline: ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.05em' }],
      },
      spacing: {
        // Using default Tailwind spacing, extended with custom values
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      maxWidth: {
        prose: '65ch',
        '7xl': '1200px',
        '8xl': '1400px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-bottom': 'slideInBottom 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
