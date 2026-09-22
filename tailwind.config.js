/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F5F6F2',
        ink: {
          DEFAULT: '#15181D',
          secondary: '#4B5157',
          muted: '#7A8087',
        },
        rule: {
          DEFAULT: '#DDE0DA',
          hover: '#C3C8BF',
        },
        signal: '#2454FF',
        circuit: '#0E9384',
        slate: {
          50: '#F5F6F2',
          100: '#EFEFEA',
          200: '#DDE0DA',
          300: '#C3C8BF',
          400: '#7A8087',
          500: '#4B5157',
          600: '#353A40',
          700: '#25292E',
          800: '#1C2025',
          900: '#15181D',
          950: '#0E1013',
        },
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#3861FF',
          600: '#2454FF', // Signal Blue
          700: '#1D44D8',
          800: '#1A37B0',
          900: '#162C8A',
          950: '#0E1B59',
        },
        teal: {
          50: '#E6F7F5',
          100: '#C2EEE8',
          200: '#99E3D8',
          300: '#6FD5C6',
          400: '#3FC4B2',
          500: '#0E9384', // Circuit Teal
          600: '#0B7A6D',
          700: '#086157',
          800: '#064942',
          900: '#04322D',
        },
        emerald: {
          50: '#E8F8F2',
          100: '#D1F1E4',
          200: '#A3E3C9',
          500: '#159F6B',
          600: '#159F6B',
          700: '#118056',
        },
        amber: {
          50: '#FEF8EE',
          100: '#FDF0D6',
          200: '#FBE0AD',
          500: '#C2790A',
          600: '#C2790A',
          700: '#9E6207',
        },
        red: {
          50: '#FDF2F4',
          100: '#FBE4E8',
          200: '#F6BAC4',
          500: '#D0334C',
          600: '#D0334C',
          700: '#AA263B',
        }
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '6px',
        'xl': '6px',
        '2xl': '6px',
        '3xl': '6px',
        'full': '9999px',
      },
      boxShadow: {
        'none': 'none',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'sm': 'none',
        DEFAULT: 'none',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
        'lg': '0 10px 15px -3px rgba(21, 24, 29, 0.08), 0 4px 6px -2px rgba(21, 24, 29, 0.04)',
        'xl': '0 20px 25px -5px rgba(21, 24, 29, 0.1)',
        '2xl': '0 25px 50px -12px rgba(21, 24, 29, 0.15)',
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
