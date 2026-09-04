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
        ink: {
          50: "#F8FAFC",
          100: "#F1F3F5",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#0B1020",
        },
        // Legacy alias: existing layouts/features use navy-* utilities.
        // Maps 1:1 onto the ink scale so nothing renders unstyled.
        navy: {
          50: "#F8FAFC",
          100: "#F1F3F5",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#0B1020",
        },
        accent: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          300: "#FBBF24",
          400: "#F59E0B",
          500: "#D97706",
          600: "#B45309",
          700: "#92400E",
        },
        semantic: {
          success: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            500: "#16A34A",
            600: "#15803D",
          },
          warning: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            500: "#D97706",
            600: "#B45309",
          },
          danger: {
            50: "#FEF2F2",
            100: "#FEE2E2",
            500: "#DC2626",
            600: "#B91C1C",
          },
          info: {
            50: "#F0F9FF",
            100: "#E0F2FE",
            500: "#0284C7",
            600: "#0369A1",
          },
        },
        surface: {
          page: "#F7F8FA",
          primary: "#FFFFFF",
          secondary: "#F3F5F7",
          inverse: "#0B1020",
        },
      },
      fontFamily: {
        sans: ["Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
        pill: "999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15, 23, 42, 0.04)",
        sm: "0 2px 8px rgba(15, 23, 42, 0.06)",
        md: "0 8px 24px rgba(15, 23, 42, 0.08)",
        lg: "0 20px 50px rgba(15, 23, 42, 0.12)",
        // Legacy aliases used across features/layouts.
        elevated: "0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)",
        "elevated-lg": "0 4px 12px rgba(15, 23, 42, 0.06), 0 16px 40px rgba(15, 23, 42, 0.06)",
        glass: "inset 0 1px 1px rgba(255,255,255,0.5), 0 1px 3px rgba(15, 23, 42, 0.04)",
        "glass-lg": "inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 32px rgba(15, 23, 42, 0.08)",
        "glass-dark": "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(11, 16, 32, 0.35)",
        glow: "0 0 20px rgba(217,119,6,0.15)",
        "glow-lg": "0 0 40px rgba(217,119,6,0.2)",
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
