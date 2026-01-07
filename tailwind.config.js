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
            },
            backgroundImage: {
                'rt-gradient': 'linear-gradient(135deg, #03b8fa 0%, #37c3a5 100%)',
            }
        },
    },
    plugins: [],
}
