/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta personalizada do projeto
        'verde-escuro': '#2E7D32',
        'verde-medio': '#4CAF50',
        'azul': '#1976D2',
        'laranja': '#FF6D00',
        'laranja-hover': '#E65100',
        'cinza-escuro': '#455A64',
        'cinza-claro': '#F5F5F5',
        
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4CAF50', // verde-medio
          600: '#43a047',
          700: '#388e3c',
          800: '#2E7D32', // verde-escuro
          900: '#1b5e20',
          950: '#0d3d10',
        },
        secondary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#1976D2', // azul
          600: '#1565c0',
          700: '#0d47a1',
          800: '#0a3d8f',
          900: '#01579b',
          950: '#002f6c',
        },
        accent: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#FF6D00', // laranja
          600: '#E65100', // laranja-hover
          700: '#d84315',
          800: '#bf360c',
          900: '#a52a00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
