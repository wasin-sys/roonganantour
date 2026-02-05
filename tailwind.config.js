/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'rt-blue': '#03b8fa',
                'rt-sky': '#6bc8e9',
                'rt-light': '#d9edf4',
                'rt-mint': '#37c3a5',
                'rt-yellow': '#fdcf1a',
                'rt-dark': '#0279a9',
                // Modern additions
                'surface': {
                    50: '#fafbfc',
                    100: '#f4f6f8',
                    200: '#e9ecef',
                },
                'accent': {
                    light: '#e0f4ff',
                    DEFAULT: '#03b8fa',
                    dark: '#0279a9',
                },
            },
            backgroundImage: {
                'rt-gradient': 'linear-gradient(135deg, #03b8fa 0%, #37c3a5 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                'subtle-gradient': 'linear-gradient(180deg, #fafbfc 0%, #f4f6f8 100%)',
                'card-shine': 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 70%)',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
                'soft-md': '0 4px 12px rgba(0, 0, 0, 0.06)',
                'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
                'soft-xl': '0 12px 32px rgba(0, 0, 0, 0.10)',
                'glow': '0 0 20px rgba(3, 184, 250, 0.15)',
                'glow-mint': '0 0 20px rgba(55, 195, 165, 0.15)',
                'inner-soft': 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)',
                'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)',
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
        },
    },
    plugins: [],
}
