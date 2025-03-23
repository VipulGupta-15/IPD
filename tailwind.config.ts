
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
				},
				// Custom colors
				"deep-blue": "#1E3A8A",
				"light-teal": "#2DD4BF",
				"neon-pink": "#FF00FF",
				"neon-orange": "#FF7700",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				},
				"fade-out": {
					"0%": { opacity: "1", transform: "translateY(0)" },
					"100%": { opacity: "0", transform: "translateY(10px)" }
				},
				"slide-in": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" }
				},
				"slide-out": {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-100%)" }
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-20px)" }
				},
				"pulse-glow": {
					"0%, 100%": { 
						opacity: "1",
						boxShadow: "0 0 5px rgba(45, 212, 191, 0.5), 0 0 10px rgba(45, 212, 191, 0.3)"
					},
					"50%": { 
						opacity: "0.8",
						boxShadow: "0 0 20px rgba(45, 212, 191, 0.8), 0 0 30px rgba(45, 212, 191, 0.5)"
					}
				},
				"particle-float": {
					"0%": { transform: "translate(0, 0) rotate(0deg)" },
					"25%": { transform: "translate(10px, -10px) rotate(1deg)" },
					"50%": { transform: "translate(0, -20px) rotate(0deg)" },
					"75%": { transform: "translate(-10px, -10px) rotate(-1deg)" },
					"100%": { transform: "translate(0, 0) rotate(0deg)" }
				},
				"scale-up": {
					"0%": { transform: "scale(1)" },
					"100%": { transform: "scale(1.05)" }
				},
				"ripple": {
					"0%": { transform: "scale(0.8)", opacity: "1" },
					"100%": { transform: "scale(2)", opacity: "0" }
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.6s ease-out forwards",
				"fade-out": "fade-out 0.6s ease-out forwards",
				"slide-in": "slide-in 0.3s ease-out forwards",
				"slide-out": "slide-out 0.3s ease-out forwards",
				"float": "float 6s ease-in-out infinite",
				"pulse-glow": "pulse-glow 2s ease-in-out infinite",
				"particle-float": "particle-float 10s ease-in-out infinite",
				"scale-up": "scale-up 0.2s ease-out forwards",
				"ripple": "ripple 0.6s ease-out forwards",
			},
			backgroundImage: {
				"gradient-primary": "linear-gradient(135deg, #1E3A8A 0%, #2DD4BF 100%)",
				"gradient-secondary": "linear-gradient(135deg, #2DD4BF 0%, #1E3A8A 100%)",
				"gradient-accent": "linear-gradient(135deg, #FF00FF 0%, #2DD4BF 100%)",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
