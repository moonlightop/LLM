const path = require("path")
const webpack = require("webpack")
const { VueLoaderPlugin } = require("vue-loader")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const isDev = process.env.NODE_ENV === "dev"

module.exports = {
  entry: path.join(__dirname, "../src/main.ts"),
  resolve: {
    extensions: [".vue", ".ts", ".js", ".json"],
    modules: [path.join(__dirname, "../node_modules")],
    alias: {
      "@": path.join(__dirname, "../src"),
    },
  },
  output: {
    filename: "static/js/[name].[chunkhash:8].js",
    path: path.join(__dirname, "../dist"),
    clean: true,
    publicPath: "./"
  },
  optimization: {
    nodeEnv: false
  },
  cache: {
    type: "filesystem",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        include: [path.join(__dirname, "../src")],
        use: ["thread-loader", "vue-loader"],
      },
      {
        test: /\.(ts|js)$/,
        include: [path.join(__dirname, "../src")],
        use: ["thread-loader", "babel-loader"],
      },
      {
        test: /\.css$/,
        include: [path.join(__dirname, "../src")],  
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ]
      },
      {
        test: /\.less$/,
        include: [path.join(__dirname, "../src")],    
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test:/.(png|jpg|jpeg|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          }
        },
        generator:{ 
          filename:"static/imgs/[name].[contenthash:8][ext]",
        },
      },
      {
        test:/.(woff2?|eot|ttf|otf)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          }
        },
        generator: {
          filename: "static/fonts/[name].[contenthash:8][ext]",
        },
      },
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          }
        },
        generator: {
          filename: "static/media/[name].[contenthash:8][ext]",
        },
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "__VUE_OPTIONS_API__": JSON.stringify(true),
      "__VUE_PROD_DEVTOOLS__": JSON.stringify(false),
      "__VUE_PROD_HYDRATION_MISMATCH_DETAILS__": JSON.stringify(false)
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../public/index.html"),
      inject: true,
    })
  ]
}