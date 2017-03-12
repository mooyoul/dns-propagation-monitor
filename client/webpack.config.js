'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const isProduction = process.env.NODE_ENV === 'production';


const config = {
  entry: {
    core: './app/app.js'
  },
  output: {
    filename: isProduction ? '[name]-[hash].js' : '[name].js',
    chunkFilename: isProduction ? 'bundle-[id]-[hash].js' : 'bundle-[id].js',
    path: path.join(__dirname, '../dist/public/app'),
    publicPath: '/app/'
  },
  module: {
    loaders: [
      { test: /\.js/i, loaders: ['ng-annotate', 'babel'], exclude: path.join(__dirname, 'node_modules') },
      { test: /\.html/i, loaders: ['html'], exclude: path.join(__dirname, 'index.html') },
      { test: /\.jade$/i, loaders: ['html', 'jade-html'] },
      { test: /\.css/i, loader: ExtractTextPlugin.extract('style', 'css') },
      { test: /\.sass/i, loader: ExtractTextPlugin.extract('style', 'css!sass') },
      { test: /\.(png|jpg|gif|jpeg|ico)/i, loaders: ['url?limit=10240&name=images/[hash].[ext]'] },
      { test: /\.(woff|woff2|eot|ttf|svg)/i, loaders: ['url?limit=10240&name=fonts/[hash].[ext]'] }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      // expose jQuery for linking angular.element as jQuery instead of jqLite
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery'
    }),
    // For ignoring ununsed moment locales
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(ko)$/),
    new ExtractTextPlugin(isProduction ? '[name]-[hash].css' : '[name].css', {
      allChunks: false
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'index.html',
      inject: false,
      minify: {
        removeComments: true,
        collapseBooleanAttributes: true
      }
    })
  ],
  htmlLoader: {

  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './assets/styles'),
      path.resolve(__dirname, './node_modules/compass-mixins/lib')
    ]
  }
};



if (isProduction) {
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
  config.plugins.push(new webpack.SourceMapDevToolPlugin({
    filename: '[file].map',
    moduleFilenameTemplate: 'webpack:///[resourcePath]',
    fallbackModuleFilenameTemplate: 'webpack:///[resourcePath]?[hash]',
    append: [
      '',
      '',
      `//@ sourceMappingURL=${process.env.PROTOCOL}://${process.env.HOST}/app/[url]`,
      `//# sourceMappingURL=${process.env.PROTOCOL}://${process.env.HOST}/app/[url]`,
    ].join('\n'),
    module: true,
    columns: true
  }));
  config.htmlLoader.root =__dirname;
}

module.exports = exports = config;
