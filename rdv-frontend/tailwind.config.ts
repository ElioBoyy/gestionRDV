import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    nextui(
      {
        themes: {
          light: {
              colors: {
                primary: "#0070f3",
                secondary: "#05f",
                accent: "#609",
                background: "#fff",
                text: "#000",
                border: "#ddd",
                error: "#f00",
                success: "#0f0",
                warning: "#ff0",
                info: "#00f",
                light: "#f5f5f5",
                dark: "#333",
              },
            },
          dark: {
              colors: {
                primary: "#0070f3",
                secondary: "#05f",
                accent: "#609",
                background: "#000",
                text: "#fff",
                border: "#444",
                error: "#f00",
                success: "#0f0",
                warning: "#ff0",
                info: "#00f",
                light: "#333",
                dark: "#f5f5f5",
              },
          }
        }
      }
    )
  ],
};
export default config;
