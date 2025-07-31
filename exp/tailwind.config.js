module.exports = {
  theme: {
    fontFamily: {
      robotoslab: ["RobotoSlab"],
      roboto: ["Roboto"],
      sans: ["Roboto"],
    },
    extend: {
      // fontFamily: {
      //   customFont: ["Orkney"],
      // },
      colors: {
        color1: "#1B1F23", // darker, more neutral dark background (instead of #222831)
        color2: "#2A2F36", // slightly lighter section background (instead of #31363F)
        color3: "#76ABAE", // keep as your soft teal accent
        color4: "#E4E4E4", // softer white for text (instead of #EEEEEE)
        crimson: "#4CB9E7", // bright accent color, keep as is
        "crimson-darker": "#3A9FC4", // darker accent for hover states, keep as is
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
