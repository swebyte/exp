module.exports = {
  theme: {
    fontFamily: {
      robotoslab: ["RobotoSlab"],
      roboto: ["Roboto"],
      sans: ['Roboto']
    },
    extend: {
      // fontFamily: {
      //   customFont: ["Orkney"],
      // },
      colors: {
        'color1': '#222831',
        'color2': '#31363F',
        'color3': '#76ABAE',
        'color4': '#E2E8F0',
        'crimson': '#ff5577',
        'crimson-light': '#ff7799',
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}