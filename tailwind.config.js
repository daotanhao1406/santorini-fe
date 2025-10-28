import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
        montserrat: ['Montserrat', 'sans-serif'],
        coiny: ['Coiny', 'cursive'],
        playfair: ['Playfair', 'cursive'],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: '#f9f9fb',
            },
            primary: {
              DEFAULT: '#351C0E',
              50: '#F7F4F2',
              100: '#EDE4DE',
              200: '#E4C6B4',
              300: '#DAA88B',
              400: '#D4895E',
              500: '#C26E3D',
              600: '#9E572E',
              700: '#794120',
              800: '#4F2C17',
              900: '#28160B',
            },
            secondary: {
              DEFAULT: '#CF8C3F',
              50: '#F7F5F2',
              100: '#EDE6DE',
              200: '#E4CEB4',
              300: '#DCB589',
              400: '#D69D5C',
              500: '#C4843B',
              600: '#A06A2C',
              700: '#7A501F',
              800: '#503516',
              900: '#281A0B',
            },
            default: {
              DEFAULT: '#EDEDED',
              50: '#F7F7F7',
              100: '#EDEDED',
              200: '#E4E4E4',
              300: '#DCDCDC',
              400: '#D4D4D4',
              500: '#CBCBCB',
              600: '#A1A1A1',
              700: '#797979',
              800: '#4F4F4F',
              900: '#262626',
            },
          },
        },
      },
    }),
  ],
}

module.exports = config
