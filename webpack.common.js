const HtmlWebpackPlugin = require("html-webpack-plugin");
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        include: [resolve('src')],
        loader: 'eslint-loader',
      }
    ]
   },
   plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    }),
    new SimpleProgressPlugin(),
   ]
}