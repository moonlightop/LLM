module.exports = {
  sourceType: "module",
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      }
    ],
    ["@babel/preset-typescript", { ignoreExtensions: true }]
  ],
  plugins: [
    ["@babel/plugin-transform-runtime"]
  ],
}