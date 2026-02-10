/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'rt-blue': '#008ac5',     // Primary
                'rt-sky': '#61cbe5',      // Light/Cyan
                'rt-mid': '#3896d3',      // Mid Blue
                'rt-dark': '#0174aa',     // Dark Blue
                'rt-teal': '#16809a',     // Teal
                'rt-light': '#e6f7fc',    // Very light derived from sky
                'rt-mint': '#16809a',     // Mapping old mint to new teal for compatibility
                'rt-yellow': '#fdcf1a',
                // Modern additions
                'surface': {
                    50: '#fafbfc',
                    100: '#f4f6f8',
                    200: '#e9ecef',
                },
                'accent': {
                    light: '#e6f7fc',
                    DEFAULT: '#008ac5',
                    dark: '#0174aa',
                },
            },
            backgroundImage: {
                'rt-gradient-primary': 'var(--rt-gradient-primary)',
                'rt-gradient-premium': 'var(--rt-gradient-premium)',
                'rt-gradient-glass': 'var(--rt-gradient-glass)',
                'rt-gradient-glow': 'var(--rt-gradient-glow)',
                'rt-gradient': 'linear-gradient(135deg, #008ac5 0%, #0174aa 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
                'subtle-gradient': 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                'card-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'soft-md': '0 4px 12px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
                'soft-xl': '0 12px 32px rgba(0, 0, 0, 0.10)',
                'glow': '0 0 20px rgba(3, 184, 250, 0.15)',
                'glow-mint': '0 0 20px rgba(55, 195, 165, 0.15)',
                'inner-soft': 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
                'card': '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'fade-in-up': 'fadeInUp 0.4s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'bounce-soft': 'bounceSoft 0.5s ease-out',
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
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                bounceSoft: {
                    '0%': { transform: 'scale(0.95)' },
                    '50%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            backdropBlur: {
                'xs': '2px',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            fontFamily: {
                sans: ['Outfit', 'Sarabun', 'sans-serif'],
                thai: ['Sarabun', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
