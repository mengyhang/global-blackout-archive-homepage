/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        deep: {
          black: "#050508",
          navy: "#0a0e1a",
          surface: "#111318",
        },
        amber: {
          glow: "rgba(245,158,11,0.15)",
          DEFAULT: "#F59E0B",
          warm: "#FBBF24",
        },
        electric: {
          blue: "#3B82F6",
          cyan: "#06B6D4",
        },
        sjtu: {
          red: "#9E1A2F",
        },
        text: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
          tertiary: "#475569",
        },
        alert: {
          red: "#EF4444",
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
