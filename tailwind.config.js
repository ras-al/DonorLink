/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fff1f2',  // Lightest Pink (Backgrounds)
                    100: '#ffe4e6',
                    500: '#f43f5e', // Primary Action Red
                    600: '#e11d48', // Brand Red (Logo/Buttons)
                    700: '#be123c', // Dark Red (Hover states)
                    900: '#881337', // Deepest Red (Text)
                },
                slate: {
                    850: '#1e293b', // Dark sidebar background
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Clean, modern font
            },
            animation: {
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            }
        },
    },
    plugins: [
        require('tailwindcss-animate')
    ],
}