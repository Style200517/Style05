import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        panel: "#ffffff",
        line: "#d9e2ec",
        accent: "#0f766e",
        caution: "#b45309",
        danger: "#b42318"
      }
    }
  },
  plugins: []
};

export default config;

