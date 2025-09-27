import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,mjs}",
    "./node_modules/@heroui/**/*.{js,mjs}",
  ],
  plugins: [
    heroui(),
  ],
} satisfies Config;


