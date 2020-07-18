const HtmlWebpackPlugin = require("html-webpack-plugin");
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');
const path = require("path");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    new FaviconsWebpackPlugin({
      logo: './src/assets/img/favicon.png',
      outputPath: './assets/favicons',
      prefix: './assets/favicons/'
    }),
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
      exclude: [
        /\.map$/,
        /manifest$/,
        /\.htaccess$/,
        /service-worker\.js$/,
        /sw\.js$/,
      ],
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/assets/img/icons/', to: './assets/img/icons/', toType: 'dir' },
        { from: './src/manifest.json', to: './manifest.json' },
      ],
    })
   ]
}