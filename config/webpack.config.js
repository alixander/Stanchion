var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./src/stanchion.js",
  target: "node",
  output: {
    path: "dist",
    filename: "stanchion.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          "src"
        ],
        exclude: [
          "node_modules"
        ]
      }
    ]
  },
  resolve: {
    modules: [
      "node_modules",
      "src"
    ]
  },
  plugins: [
  ]
}
