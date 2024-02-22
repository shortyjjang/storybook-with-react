/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
            DEFAULT: '#7254f3',
        },
        secondary: {
            DEFAULT: '#a1c30d',
        },
        success: {
            DEFAULT: '#29c76f',
        },
        danger: {
            DEFAULT: '#d32f2f',
        },
        warning: {
            DEFAULT: '#ff9f42',
        },
        info: {
            DEFAULT: '#3ec9d6',
        },
        light: {
            DEFAULT: '#ea5455',
        },
        lightgray: {
            DEFAULT: '#e9e9ed',
        },
        bordergray: {
            DEFAULT: '#d2d2d7',
        },
        darkgray: {
            DEFAULT: '#939396',
        },
        bggray: {
            DEFAULT: '#f7f7f9',
        
        },
        deepdark: {
            DEFAULT: '#555'
        },
        a2dblue : {
            light: '#e4f0f8',
            dark: '#006dff',
        }
      }
    },
  },
  darkMode: 'media',
  plugins: [],
}