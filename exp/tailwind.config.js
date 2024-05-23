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
        'color4': '#EEEEEE',
        'crimson': '#4CB9E7',
        'crimson-darker': '#3A9FC4',
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}