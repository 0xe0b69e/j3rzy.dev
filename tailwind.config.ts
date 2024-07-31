import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

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
