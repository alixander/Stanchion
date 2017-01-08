var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./test/api-test/script.js",
  output: {
    path: "test-dist/api-test",
    filename: "script.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          "test"
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
      "test",
      "src"
    ]
  },
  plugins: [
  ]
};
