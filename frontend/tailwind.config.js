/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        't-sm': '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
        't-md': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        't-lg': '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        't-xl': '0 -20px 25px -5px rgba(0, 0, 0, 0.075)',
        't-2xl': '0 -25px 50px -12px rgba(0, 0, 0, 0.25)',
        't-3xl': '0 -35px 60px -15px rgba(0, 0, 0, 0.3)',
        'e-lg': '0 4px 20px -3px rgb(0 0 0 / 0.1), 0 1px 6px -4px rgb(0 0 0 / 0.1)'
      },
      fontSize: {
        'xxxs': '0.65rem',
        'xxs': '0.70rem',
        'ss': '0.75rem',
        's': '0.80rem'
      },
      colors: {
        'mobilepay': ' #5A78FF;',
        'mobilepay/15': 'rgba(90, 120, 255, 0.15);',
        'mobilepay/50': 'rgba(90, 120, 255, 0.3);',
        'mp-black': 'rgb(30, 30, 30);',
        'mp-black/50': 'rgba(30, 30, 30, 0.50);',
        'mp-grey': ' #F5F5F2',
      },
      borderRadius: {
        'smm': '0.28rem'
      }
    },
  },
  plugins: [],
}