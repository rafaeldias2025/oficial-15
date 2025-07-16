
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
				// Sistema de cinzas moderno
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
				// Cores de saúde modernas
				health: {
					primary: 'rgb(var(--health-primary))',
					secondary: 'rgb(var(--health-secondary))',
					success: 'rgb(var(--health-success))',
					info: 'rgb(var(--health-info))',
					warning: 'rgb(var(--health-warning))',
					error: 'rgb(var(--health-error))',
				},
				// Tons de métricas
				metric: {
					excellent: 'rgb(var(--metric-excellent))',
					good: 'rgb(var(--metric-good))',
					average: 'rgb(var(--metric-average))',
					poor: 'rgb(var(--metric-poor))',
					critical: 'rgb(var(--metric-critical))',
				},
				// Badges e gamificação
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
			},
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)',
				'glow': 'var(--shadow-glow)',
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
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'112': '28rem',
				'128': '32rem',
			},
			animation: {
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
				'slide-up': 'slide-up 0.5s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'bounce-in': 'bounce-in 0.5s ease-out',
				'shimmer': 'shimmer 1.5s infinite',
			},
			keyframes: {
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
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
