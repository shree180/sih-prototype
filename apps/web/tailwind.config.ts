import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0f1e",
          900: "#0f172a",
          800: "#1a2332",
          700: "#2a3a4e",
          600: "#3d5068",
          500: "#4f6580",
          400: "#7a8fa3",
          300: "#a3b3c3",
          200: "#c8d1dc",
          100: "#e8ecf1",
          50: "#f4f6f8",
        },
        amber: {
          600: "#b45309",
          500: "#d97706",
          400: "#f59e0b",
          300: "#fbbf24",
          200: "#fde68a",
          100: "#fef3c7",
          50: "#fffbeb",
        },
        severity: {
          unclear: "#64748b",
          minor: "#22c55e",
          moderate: "#eab308",
          severe: "#f97316",
          critical: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glass: "inset 0 1px 1px rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.04)",
        "glass-lg": "inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.08)",
        "glass-dark": "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.2)",
        glow: "0 0 20px rgba(217,119,6,0.15)",
        "glow-lg": "0 0 40px rgba(217,119,6,0.2)",
        elevated: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)",
        "elevated-lg": "0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-in": "fade-in 400ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
        "fade-in-scale": "fade-in-scale 300ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
        "slide-in": "slide-in-right 300ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
        shimmer: "shimmer 1.5s infinite",
        "pulse-glow": "pulse-glow 2s infinite",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.23, 1, 0.32, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
