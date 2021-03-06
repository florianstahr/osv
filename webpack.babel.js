/* eslint-disable import/no-extraneous-dependencies */
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import pkg from './package';

export default {
  module: {
    rules: [
      {
        exclude: [path.resolve(__dirname, 'node_modules')],
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  output: {
    filename: path.basename(pkg.main),
    path: path.resolve(__dirname, pkg.main.replace(new RegExp(`${path.basename(pkg.main)}$`), '')),
    library: pkg.meta.libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'src/index.ts'),
  ],
  externals: [
    nodeExternals({}),
  ],
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin({
      clearOnceBeforeBuildPatterns: ['dist'],
    }),
  ],
};
