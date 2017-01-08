var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./test/images-test/script.js",
  output: {
    path: "test-dist/images-test",
    filename: "script.js"
  },
  module: {
    rules: [
      {
        test: /\.s$/,
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
  module: {
    rules: [
      {
        test: /\.img$|\.png$/
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
