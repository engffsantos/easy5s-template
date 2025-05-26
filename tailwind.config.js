/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f9',
          100: '#cce0f3',
          200: '#99c2e7',
          300: '#66a3db',
          400: '#3385cf',
          500: '#0056A4', // Primary blue
          600: '#004e94',
          700: '#003a6f',
          800: '#00274a',
          900: '#001325',
        },
        accent: {
          50: '#e6f9ef',
          100: '#ccf3df',
          200: '#99e7bf',
          300: '#66db9f',
          400: '#33cf7f',
          500: '#00A651', // Accent green
          600: '#009549',
          700: '#007037',
          800: '#004a24',
          900: '#002512',
        },
        secondary: {
          50: '#fff8e6',
          100: '#fff1cc',
          200: '#ffe299',
          300: '#ffd466',
          400: '#ffc533',
          500: '#FF8200', // Complementary orange
          600: '#e67500',
          700: '#b35c00',
          800: '#804200',
          900: '#4d2700',
        },
        success: {
          500: '#22c55e',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        card: '0 2px 10px rgba(0, 0, 0, 0.05)',
        elevated: '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};