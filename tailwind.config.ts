import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
      colors: {
        'bp-primary': '#FCFF4B',
        'secondary-dark': '#12171D',
      },
    },
  },
  plugins: [],
} satisfies Config;
