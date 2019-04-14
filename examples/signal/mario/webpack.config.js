const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')

const babelConfig = require('./babel.config')

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  entry: __dirname + '/src/Main',
  target: 'web',
  output: {
    path: __dirname + '/lib',
    filename: 'Main.js',
    library: 'Mario',
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.(ts|tsx|js|jsx)$/,
      include: [__dirname + '/src', path.resolve(__dirname + '../../../../src')],
      use: [{
        loader: require.resolve('babel-loader'),
        options: {
          ...babelConfig,
          cacheDirectory: true,
        },
      }],
    }],
  },
  resolve: {
    modules: [__dirname + '../../../../node_modules'],
    extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
}
