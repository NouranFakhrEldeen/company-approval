/* eslint-disable no-undef */
const path = require('path');
const common = require('./webpack.config');
const merge = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/[name].js',
    publicPath: '/',
  },
  devServer: {
    proxy: {
      context: ['/api'],
      target: 'http://localhost:3044',
    },
  },
  module: {
    rules: [

    ],
  },
});
