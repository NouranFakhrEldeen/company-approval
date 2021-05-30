/* eslint-disable no-undef */
const path = require('path');
const common = require('./webpack.config');
const merge = require('webpack-merge');
const exportCSS = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const minimizeJS = require('terser-webpack-plugin');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

module.exports = merge(common, {
  mode: 'production',
  // output: {
  //   filename: '[name].js',
  //   path: path.resolve(__dirname, 'build'),
  //   publicPath: `${env.PUBLIC_URL ? `${env.PUBLIC_URL}/` : '/'}`,

  // },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/[name].js',
    publicPath: `${env.PUBLIC_URL ? `${env.PUBLIC_URL}/` : '/'}`,
  },
  plugins: [
    new exportCSS({
      filename: '[name].[contentHash].css',
    }),
    new CleanWebpackPlugin(),
  ],

  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new minimizeJS,
    ],
  },

  module: {
    rules: [

    ],
  },
});