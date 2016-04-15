module.exports = {
  entry: ['./index.js'],
  output: {
    path: './',
    filename: 'build.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loaders: ['babel'],
      exclude: [/node_modules/],
    }]
  }
}