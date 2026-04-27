import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D4AA',
        accent: '#FFD700',
        dark: '#0F172A',
        surface: '#1E293B',
      },
    },
  },
  plugins: [],
};
export default config;