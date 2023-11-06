const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

//静态资源目录
function fnStatic() {
  if (process.env.ENV === 'test') {
    return "/test/"
  } else if (process.env.ENV === 'build') {
    return "/build/"
  } else {
    return "/"
  }
}

module.exports = defineConfig({

  // transpileDependencies: true,
  publicPath: fnStatic(),
  configureWebpack: {
    // name: name,
    resolve: {
      extensions: ['.js', '.json', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@api': path.resolve(__dirname, './src/api'),
      }
    },
    
    // plugins: [
    //   new webpack.ProvidePlugin({
    //     $: "jquery",
    //     jQuery: "jquery",
    //     "windows.jQuery": "jquery"
    //   })
    // ]
  },
})
