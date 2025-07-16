
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'rgb(var(--border))',
				input: 'rgb(var(--input))',
				ring: 'rgb(var(--ring))',
				background: 'rgb(var(--background))',
				foreground: 'rgb(var(--foreground))',
				primary: {
					DEFAULT: 'rgb(var(--primary))',
					foreground: 'rgb(var(--foreground))'
				},
				secondary: {
					DEFAULT: 'rgb(var(--secondary))',
					foreground: 'rgb(var(--foreground))'
				},
				accent: {
					DEFAULT: 'rgb(var(--accent))',
					foreground: 'rgb(var(--foreground))'
				},
				// Sistema de cinzas com alto contraste
				gray: {
					50: 'rgb(var(--gray-50))',
					100: 'rgb(var(--gray-100))',
					200: 'rgb(var(--gray-200))',
					300: 'rgb(var(--gray-300))',
					400: 'rgb(var(--gray-400))',
					500: 'rgb(var(--gray-500))',
					600: 'rgb(var(--gray-600))',
					700: 'rgb(var(--gray-700))',
					800: 'rgb(var(--gray-800))',
					900: 'rgb(var(--gray-900))',
				},
				// Cores de saúde com contraste aprimorado
				health: {
					primary: 'rgb(var(--health-primary))',
					secondary: 'rgb(var(--health-secondary))',
					success: 'rgb(var(--health-success))',
					info: 'rgb(var(--health-info))',
					warning: 'rgb(var(--health-warning))',
					error: 'rgb(var(--health-error))',
				},
				// Tons de métricas com melhor distinção
				metric: {
					excellent: 'rgb(var(--metric-excellent))',
					good: 'rgb(var(--metric-good))',
					average: 'rgb(var(--metric-average))',
					poor: 'rgb(var(--metric-poor))',
					critical: 'rgb(var(--metric-critical))',
				},
				// Badges e gamificação com cores distinguíveis
				badge: {
					bronze: 'rgb(var(--badge-bronze))',
					silver: 'rgb(var(--badge-silver))',
					gold: 'rgb(var(--badge-gold))',
					diamond: 'rgb(var(--badge-diamond))',
					legendary: 'rgb(var(--badge-legendary))',
				},
				// Componentes de UI
				card: {
					DEFAULT: 'rgb(var(--card))',
					foreground: 'rgb(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'rgb(var(--popover))',
					foreground: 'rgb(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'rgb(var(--muted))',
					foreground: 'rgb(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'rgb(var(--health-error))',
					foreground: 'rgb(var(--foreground))'
				},
				surface: 'rgb(var(--surface))',
				sidebar: {
					DEFAULT: 'rgb(var(--surface))',
					foreground: 'rgb(var(--foreground))',
					primary: 'rgb(var(--primary))',
					'primary-foreground': 'rgb(var(--foreground))',
					accent: 'rgb(var(--accent))',
					'accent-foreground': 'rgb(var(--foreground))',
					border: 'rgb(var(--border))',
					ring: 'rgb(var(--ring))'
				},
				// Cores específicas para pessoas mais velhas
				senior: {
					primary: 'rgb(var(--primary))',
					secondary: 'rgb(var(--secondary))',
					accent: 'rgb(var(--accent))',
					text: 'rgb(var(--foreground))',
					background: 'rgb(var(--background))',
					surface: 'rgb(var(--surface))',
					border: 'rgb(var(--border))',
					success: 'rgb(var(--health-success))',
					warning: 'rgb(var(--health-warning))',
					error: 'rgb(var(--health-error))',
					info: 'rgb(var(--health-info))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
				// Bordas específicas para acessibilidade
				'senior': '12px',
				'senior-lg': '16px',
				'senior-xl': '20px',
			},
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)',
				'glow': 'var(--shadow-glow)',
				// Sombras específicas para pessoas mais velhas
				'senior': 'var(--shadow-lg)',
				'senior-xl': 'var(--shadow-xl)',
				'senior-glow': 'var(--shadow-glow)',
			},
			backdropFilter: {
				'glass': 'blur(10px)',
				'glass-strong': 'blur(20px)',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-surface': 'var(--gradient-surface)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-health': 'var(--gradient-health)',
				'gradient-wellness': 'var(--gradient-wellness)',
			},
			transitionDuration: {
				'fast': 'var(--duration-fast)',
				'normal': 'var(--duration-normal)',
				'slow': 'var(--duration-slow)',
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
			fontSize: {
				'2xs': '0.625rem',
				'xs': '0.75rem',
				'sm': '0.875rem',
				'base': '1rem',
				'lg': '1.125rem',
				'xl': '1.25rem',
				'2xl': '1.5rem',
				'3xl': '1.875rem',
				'4xl': '2.25rem',
				'5xl': '3rem',
				'6xl': '3.75rem',
				'7xl': '4.5rem',
				'8xl': '6rem',
				'9xl': '8rem',
				// Tamanhos específicos para pessoas mais velhas
				'senior-sm': '1rem',
				'senior-base': '1.125rem',
				'senior-lg': '1.25rem',
				'senior-xl': '1.5rem',
				'senior-2xl': '1.875rem',
				'senior-3xl': '2.25rem',
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'112': '28rem',
				'128': '32rem',
				// Espaçamentos específicos para acessibilidade
				'senior-xs': '8px',
				'senior-sm': '12px',
				'senior-md': '16px',
				'senior-lg': '24px',
				'senior-xl': '32px',
				'senior-2xl': '48px',
				'senior-3xl': '64px',
			},
			minHeight: {
				'touch-target': '48px',
				'senior-button': '56px',
				'senior-input': '48px',
				'senior-card': '120px',
			},
			minWidth: {
				'touch-target': '48px',
				'senior-button': '120px',
			},
			animation: {
				'gentle-float': 'gentle-float 4s ease-in-out infinite',
				'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
				'gentle-slide-up': 'gentle-slide-up 0.6s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
				'slide-up': 'slide-up 0.5s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'bounce-in': 'bounce-in 0.5s ease-out',
				'shimmer': 'shimmer 1.5s infinite',
			},
			keyframes: {
				'gentle-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-4px)' },
				},
				'gentle-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgb(var(--primary) / 0.15)'
					},
					'50%': { 
						boxShadow: '0 0 30px rgb(var(--primary) / 0.25)'
					},
				},
				'gentle-slide-up': {
					'from': { transform: 'translateY(16px)', opacity: '0' },
					'to': { transform: 'translateY(0)', opacity: '1' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgb(var(--primary) / 0.2)'
					},
					'50%': { 
						boxShadow: '0 0 30px rgb(var(--primary) / 0.4)'
					},
				},
				'slide-up': {
					'from': { transform: 'translateY(20px)', opacity: '0' },
					'to': { transform: 'translateY(0)', opacity: '1' },
				},
				'fade-in': {
					'from': { opacity: '0' },
					'to': { opacity: '1' },
				},
				'scale-in': {
					'from': { opacity: '0', transform: 'scale(0.9)' },
					'to': { opacity: '1', transform: 'scale(1)' },
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)', opacity: '0.8' },
					'70%': { transform: 'scale(0.9)', opacity: '0.9' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
			},
			screens: {
				'xs': '475px',
				'3xl': '1600px',
				'4xl': '1920px',
				// Breakpoints específicos para acessibilidade
				'senior-sm': '640px',
				'senior-md': '768px',
				'senior-lg': '1024px',
				'senior-xl': '1280px',
			},
			// Configurações específicas para botões acessíveis
			buttonSizing: {
				'senior-sm': {
					minHeight: '48px',
					minWidth: '48px',
					padding: '12px 16px',
					fontSize: '1rem',
				},
				'senior-md': {
					minHeight: '56px',
					minWidth: '120px',
					padding: '16px 24px',
					fontSize: '1.125rem',
				},
				'senior-lg': {
					minHeight: '64px',
					minWidth: '140px',
					padding: '20px 32px',
					fontSize: '1.25rem',
				},
			},
			// Configurações específicas para inputs acessíveis
			inputSizing: {
				'senior': {
					minHeight: '48px',
					padding: '12px 16px',
					fontSize: '1rem',
					borderWidth: '2px',
				},
			},
			// Configurações específicas para cards acessíveis
			cardSizing: {
				'senior': {
					minHeight: '120px',
					padding: '24px',
					borderRadius: '16px',
					borderWidth: '2px',
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
	// Configurações específicas para acessibilidade
	safelist: [
		// Classes que devem sempre estar disponíveis
		'text-senior-primary',
		'text-senior-secondary',
		'text-senior-large',
		'text-senior-xlarge',
		'bg-senior-primary',
		'bg-senior-secondary',
		'border-senior-primary',
		'border-senior-secondary',
		'shadow-senior',
		'shadow-senior-xl',
		'rounded-senior',
		'rounded-senior-lg',
		'spacing-senior',
		'spacing-senior-sm',
		'spacing-senior-lg',
		'gap-senior',
		'gap-senior-sm',
		'gap-senior-lg',
		'min-touch-target',
		'animation-gentle-float',
		'animation-gentle-pulse',
		'animation-gentle-slide-up',
		// Classes para componentes específicos
		'btn-primary-senior',
		'btn-secondary-senior',
		'senior-card',
		'senior-badge',
		'senior-progress',
		'senior-progress-fill',
		'senior-tooltip',
		'senior-form-group',
		'senior-form-label',
		'senior-form-input',
		'senior-alert-success',
		'senior-alert-warning',
		'senior-alert-error',
		'senior-nav-item',
		'senior-table',
		'text-high-contrast',
		'text-medium-contrast',
		// Classes para estados
		'hover:bg-senior-primary',
		'hover:bg-senior-secondary',
		'hover:text-senior-primary',
		'hover:text-senior-secondary',
		'focus:border-senior-primary',
		'focus:ring-senior-primary',
		'active:bg-senior-primary',
		'active:bg-senior-secondary',
	],
} satisfies Config;
