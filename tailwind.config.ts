
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				instituto: {
					orange: 'hsl(var(--instituto-orange))',
					'orange-hover': 'hsl(var(--instituto-orange-hover))',
					'orange-light': 'hsl(var(--instituto-orange-light))',
					purple: 'hsl(var(--instituto-purple))',
					'purple-light': 'hsl(var(--instituto-purple-light))',
					lilac: 'hsl(var(--instituto-lilac))',
					'lilac-light': 'hsl(var(--instituto-lilac-light))',
					green: 'hsl(var(--instituto-green))',
					'green-light': 'hsl(var(--instituto-green-light))',
					light: 'hsl(var(--instituto-light))',
					dark: 'hsl(var(--instituto-dark))',
					gold: 'hsl(var(--instituto-gold))',
					warm: 'hsl(var(--instituto-warm))',
					cream: 'hsl(var(--instituto-cream))'
				},
				diary: {
					warm: 'hsl(var(--diary-warm))',
					lilac: 'hsl(var(--diary-lilac))',
					glow: 'hsl(var(--diary-glow))'
				},
				netflix: {
					dark: 'hsl(var(--netflix-dark))',
					background: 'hsl(var(--netflix-background))',
					card: 'hsl(var(--netflix-card))',
					text: 'hsl(var(--netflix-text))',
					'text-muted': 'hsl(var(--netflix-text-muted))',
					hover: 'hsl(var(--netflix-hover))',
					border: 'hsl(var(--netflix-border))'
				},
				category: {
					nutrition: 'hsl(var(--category-nutrition))',
					psychology: 'hsl(var(--category-psychology))',
					wellness: 'hsl(var(--category-wellness))',
					fitness: 'hsl(var(--category-fitness))',
					mindfulness: 'hsl(var(--category-mindfulness))'
				},
				xp: {
					gold: 'hsl(var(--xp-gold))',
					silver: 'hsl(var(--xp-silver))',
					bronze: 'hsl(var(--xp-bronze))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'fade-in-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)', opacity: '1' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px hsl(var(--primary))' },
					'50%': { boxShadow: '0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'fade-in-up': 'fade-in-up 0.4s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
