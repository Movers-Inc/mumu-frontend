import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      },
      zIndex: {
        "action-group": "50",
        header: "100",
        navigator: "100",
        "action-sheet": "110",
        toast: "150"
      },
      boxShadow: {
        box: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        plan: "inset 0px 0px 10px rgba(0, 0, 0, 0.1)",
        tabs: "0px 2px 4px rgba(0,0,0,0.1)",
        basic: "0px 8px 30px rgba(0,0,0,0.12)",
        popup: "0px 4px 12px rgba(55,81,255,0.24)"
      }
    }
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/line-clamp")
  ]
} satisfies Config;
