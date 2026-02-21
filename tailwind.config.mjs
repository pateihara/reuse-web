import daisyui from "daisyui";

const config = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        reuse: {
          /* principais */
          primary: "#2563EB",
          "primary-content": "#FFFFFF",

          secondary: "#7C3AED",
          "secondary-content": "#FFFFFF",

          /* neutros / base */
          "base-100": "#FFFFFF",  // cards
          "base-200": "#F5F5F5",  // fundo principal
          "base-300": "#E5E7EB",  // bordas/linhas
          "base-content": "#111827", // texto primário

          /* feedback */
          success: "#047857",
          error: "#DC2626",
          warning: "#D97706",

          /* opcional */
          info: "#2563EB",
          neutral: "#111827",
          "neutral-content": "#FFFFFF",
        },
      },
      "light",
    ],
  },
};

export default config;