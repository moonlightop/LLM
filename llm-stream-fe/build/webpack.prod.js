const path = require("path")
const { merge } = require("webpack-merge")
const CopyPlugin = require("copy-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const globAll = require("glob-all")
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
// const CompressionPlugin  = require("compression-webpack-plugin")
const baseConfig = require("./webpack.base.js")

module.exports = merge(baseConfig, {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          },
          format: {
            comments: false
          }
        }
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: "vendors",
          minChunks: 1,
          chunks: "initial",
          minSize: 0,
          priority: 1,
        },
        commons: {
          name: "commons",
          minChunks: 2,
          chunks: "initial",
          minSize: 0,
        }
      }
    }
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          filter: source => {
            return !source.includes("index.html")
          }
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
    }),
    new PurgeCSSPlugin({
      paths: globAll.sync([
        `${path.join(__dirname, "../src")}/**/*.vue`,
        path.join(__dirname, "../public/index.html")
      ]),
      safelist: {
        standard: [/^el-/],
      }
    }),
    // new CompressionPlugin({
    //   test: /.(js|css)$/,
    //   filename: "[path][base].gz",
    //   algorithm: "gzip",
    //   threshold: 10240,
    //   minRatio: 0.8
    // })
  ]
})