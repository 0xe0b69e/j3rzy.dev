import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const config: Config = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        screens: {
          "sm": "690px",
        },
        keyframes: {
          randomMove: {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '25%': { transform: 'translate(-2px, 2px)' },
            '50%': { transform: 'translate(2px, -2px)' },
            '75%': { transform: 'translate(-2px, -2px)' },
          },
        },
        animation: {
          randomMove: 'randomMove 1s infinite',
        },
      },
      screens: {
        "xxs": "380px",
        "xs": "490px",
        ...defaultTheme.screens
      }
    },
  }
;
export default config;
