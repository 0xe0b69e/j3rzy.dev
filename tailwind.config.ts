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
      },
      screens: {
        "xxs": "380px",
        "xs": "490px",
        ...defaultTheme.screens
      }
    },
    plugins: [
      plugin
      (function ({ addUtilities, addComponents, e, config })
      {
        const newUtilities = {
          ".horizontal-tb": {
            writingMode: "horizontal-tb",
          },
          ".vertical-rl": {
            writingMode: "vertical-rl"
          },
          ".vertical-lr": {
            writingMode: "vertical-lr"
          }
        };
        addUtilities(newUtilities);
      })
    ],
  }
;
export default config;
