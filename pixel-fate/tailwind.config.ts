import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['system-ui', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        pixel: '0 0 0 1px rgba(15,23,42,1)',
      },
    },
  },
  plugins: [],
}

export default config

