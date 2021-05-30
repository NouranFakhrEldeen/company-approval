const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;


// eslint-disable-next-line no-undef
module.exports = {
  // eslint-disable-next-line no-undef
  context: __dirname,

  entry: ['@babel/polyfill', './src/index.js'],

  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: ['/node_modules/', '/.eslintrc.js/', '/webpack.config.js/'],
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|j?g|svg|gif)?$/,
        use: 'file-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg|eot|woff|woff2|ttf)$/,
        use: 'file-loader',
      },


    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['module', 'browser', 'main'],
  },
  plugins: [
    new HtmlWebPackPlugin({
      // eslint-disable-next-line no-undef
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
    }),
    new webpack.DefinePlugin(Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {
      process: { env: {} },
    })),
  ],
};