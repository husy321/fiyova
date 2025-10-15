import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,mjs}",
    "./node_modules/@heroui/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      animation: {
        'confetti': 'confetti 3s ease-in-out forwards',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        confetti: {
          '0%': {
            transform: 'translateY(0) rotateZ(0deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(100vh) rotateZ(720deg)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [
    heroui(),
  ],
} satisfies Config;


