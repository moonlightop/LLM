const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const { VueLoaderPlugin } = require("vue-loader")
const smp = new SpeedMeasurePlugin({
  excludedPlugins: [VueLoaderPlugin],
})
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")
const { merge } = require("webpack-merge")
const prodConfig = require("./webpack.prod.js")

module.exports = smp.wrap(merge(prodConfig, {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}))