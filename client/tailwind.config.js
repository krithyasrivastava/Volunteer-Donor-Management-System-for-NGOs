/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f1f8f4',
          100: '#dcefe3',
          200: '#b9dfc8',
          300: '#8cc9a5',
          400: '#5cab7f',
          500: '#3a8f61',
          600: '#28734c',
          700: '#215c3f',
          800: '#1c4a34',
          900: '#173d2c'
        },
        teal: {
          50: '#eefbfa',
          100: '#d4f4f1',
          500: '#159a8f',
          600: '#0f7d74',
          700: '#0d655e'
        },
        sand: {
          50: '#fafaf8',
          100: '#f4f4f0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Sora"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(23,61,44,0.06), 0 4px 14px rgba(23,61,44,0.06)'
      }
    }
  },
  plugins: []
};
