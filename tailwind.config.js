module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores Primárias
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
          DEFAULT: '#1890ff',
        },
        
        // Cores Secundárias
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#22c55e',
        },
        
        // Cores de Destaque
        accent: {
          50: '#fff5f5',
          100: '#fed7d7',
          200: '#feb2b2',
          300: '#fc8181',
          400: '#f56565',
          500: '#ff6b6b',
          600: '#e53e3e',
          700: '#c53030',
          800: '#9b2c2c',
          900: '#742a2a',
          DEFAULT: '#ff6b6b',
        },
        
        // Cores de Saúde
        health: {
          heart: '#ef4444',
          steps: '#3b82f6',
          sleep: '#8b5cf6',
          water: '#06b6d4',
          calories: '#f59e0b',
          weight: '#10b981',
          pressure: '#dc2626',
          temperature: '#f97316'
        }
      },
      
      // Gradientes personalizados
      backgroundImage: {
        'health-gradient': 'linear-gradient(135deg, #1890ff 0%, #22c55e 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0050b3 0%, #15803d 100%)',
        'accent-gradient': 'linear-gradient(135deg, #ff6b6b 0%, #f59e0b 100%)',
      },
      
      // Sombras customizadas
      boxShadow: {
        'health': '0 4px 14px 0 rgba(24, 144, 255, 0.15)',
        'health-lg': '0 10px 40px -10px rgba(24, 144, 255, 0.25)',
        'success': '0 4px 14px 0 rgba(34, 197, 94, 0.15)',
        'accent': '0 4px 14px 0 rgba(255, 107, 107, 0.15)',
      },
    },
  },
  plugins: [],
}
