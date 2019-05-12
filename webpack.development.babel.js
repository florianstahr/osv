/* eslint-disable import/no-extraneous-dependencies */
import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';
import common from './webpack.common.babel';
import pkg from './package.json';

module.exports = merge.smart(common, {
  devtool: 'inline-source-map',
  entry: [
    'webpack/hot/poll?1000',
    path.join(__dirname, 'src/index.ts'),
  ],
  externals: [
    nodeExternals({
      whitelist: [
        'webpack/hot/poll?1000',
      ],
    }),
  ],
  mode: 'development',
  devServer: {
    hot: true,
  },
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: pkg.name.replace(/^(?:@([^/]+?)[/])/, ''),
      logo: path.resolve('./img/favicon.png'),
      suppressSuccess: true,
    }),
    new CleanWebpackPlugin({
      clearOnceBeforeBuildPatterns: ['dist'],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  watch: true,
});
