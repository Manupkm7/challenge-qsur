/** @type {import('tailwindcss').Config} */
import { fontFamily, fontSize } from 'tailwindcss/defaultTheme';

module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: {
      ...fontSize,
      xss: ['0.5rem', { lineHeight: '0.75rem' }],
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1.16' }],
      '6xl': ['3.25rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    screens: {
      xs: '320px',
      sm: '428px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1752px',
    },
    extend: {
      keyframes: {
        fade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        fade: 'fade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionProperty: {
        width: 'width',
        height: 'height',
      },
      fontWeight: {
        subSemibold: '500',
      },
      fontFamily: {
        sans: ['inter', ...fontFamily.sans],
        lexend: 'lexend',
        inter: 'inter',
        roboto: 'roboto',
      },
      colors: {
        primary: {
          100: '#EEF6FD',
          200: '#C5E4FB',
          300: '#79C0F6',
          400: '#52AEF4',
          500: '#279AF1',
        },
        secondary: {
          100: '#F3F3F3',
          200: '#DCDCDD',
          300: '#A1A1A3',
          400: '#424346',
          500: '#111317',
        },
        red: {
          100: '#FBF0EE',
          200: '#F4D1CD',
          300: '#E9A49B',
          400: '#DE7668',
          500: '#D65745',
        },
        orange: {
          100: '#FDF2EC',
          200: '#F9CBB4',
          300: '#F4A37B',
          400: '#F18955',
          500: '#EE7032',
        },
        yellow: {
          100: '#FFF9EB',
          200: '#FFECC2',
          300: '#FFDF99',
          400: '#FFCB5C',
          500: '#FFB20F',
        },
        green: {
          100: '#EEFCFA',
          200: '#CBF6F1',
          300: '#97EDE3',
          400: '#22BFAC',
          500: '#1B998B',
        },
        blue: {
          100: '#EDF0FD',
          200: '#C9D3F8',
          300: '#93A7F0',
          400: '#5D7CE9',
          500: '#3B60E4',
          600: '#3B92F7',
          700: '#05283A',
          800: '#F0F7FB',
        },
        purple: {
          100: '#F1EDFD',
          200: '#D6C9F8',
          300: '#AC93F0',
          400: '#835DE9',
          500: '#673BE4',
        },
        gray: {
          border: '#BBBBBB',
          muted: '#EFEFEF',
          text: '#B4B4B4',
          scheduled: '#D9D9D9',
        },
        select: {
          'light-gray': '#8C8C8C1A', //Background color of the select item on the select component
          'dark-gray': '#1A1A1A', //Secondary color of the select component
        },
        calendar: {
          defaultEventBackgroundColor: '#DBF1FE',
          slotBackgroundColor: '#DCF2FE',
          recommendedSlotBackgroundColor: '#99FF99AF',
          defaultTimeZoneBackground: '#bbe0f5',
          whiteColor: '#fff',
          borderColor: '#CCCCCC',
        },
      },
      boxShadow: {
        popover:
          '0px 3px 14px 2px rgba(0, 0, 0, 0.12), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 5px 5px -3px rgba(0, 0, 0, 0.20);',
      },
    },
  },
  plugins: [],
};
