import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#282522',
        paper: '#f6f2ec',
        blush: '#d7a99c',
        sage: '#8c9c8a',
        cream: '#fffdf9',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 60px rgba(40, 37, 34, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
