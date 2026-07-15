/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
      },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // 暖意有机风主题令牌
        cream: "#F7F1E8", // 背景奶油米
        creamdark: "#EFE6D6", // 略深的奶油
        ink: "#3A2E26", // 深咖文字
        inksoft: "#6B5B4E", // 次级文字
        clay: "#C56B3F", // 暖陶土橙 主色
        claydark: "#A8532C",
        sage: "#7C8B6A", // 鼠尾草绿 次色
        sagedark: "#5E6B4F",
        // 安全等级徽章色
        safe: "#7C8B6A",
        caution: "#D4A24C",
        forbidden: "#B5503E",
        // 品牌外部链接色
        douyin: "#161823",
        xhs: "#FF2442",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Noto Serif SC"', "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(58, 46, 38, 0.15)",
        card: "0 10px 30px -12px rgba(58, 46, 38, 0.18)",
      },
      borderRadius: {
        pill: "9999px",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        fade: "fade 0.5s ease both",
      },
    },
  },
  plugins: [],
};
