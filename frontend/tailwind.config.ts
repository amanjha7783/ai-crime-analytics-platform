import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: "#17211f",
        surface: "var(--panel)",
        ink: "var(--foreground)",
        signal: "var(--accent)",
        warning: "#b7791f",
        danger: "#b91c1c",
        patrol: "#2f5d62"
      },
      boxShadow: {
        panel: "0 12px 32px rgba(20, 28, 26, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
