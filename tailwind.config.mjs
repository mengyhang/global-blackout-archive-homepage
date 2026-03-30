/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        deep: {
          black: "#000000",
          navy: "#0a0a0f",
          surface: "#0f0f14",
        },
        amber: {
          glow: "rgba(245,158,11,0.1)",
          DEFAULT: "#D97706",
          warm: "#F59E0B",
        },
        electric: {
          blue: "#2563EB",
          cyan: "#0891B2",
        },
        sjtu: {
          red: "#8B1538",
        },
        text: {
          primary: "#E2E8F0",
          secondary: "#94A3B8",
          tertiary: "#475569",
        },
        alert: {
          red: "#DC2626",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "serif"],
        sans: ["Inter", '"Noto Sans SC"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        display: ['"Space Grotesk"', "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        flicker: "flicker 0.15s infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(245,158,11,0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(245,158,11,0.6)" },
        },
      },
    },
  },
  plugins: [],
};
