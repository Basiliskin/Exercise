const webpack = require('webpack');

module.exports = {
    entry: [
        'react-hot-loader/patch',
        './src/index.js'
    ],
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.css$/,
            loader:[ 'style-loader', 'css-loader' ]
          },
          {test: /\.(png|jpg)$/, loader: "file-loader?name=images/[name].[ext]"}
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      historyApiFallback: true,
      publicPath: '/',
      contentBase: './dist'
    }
  };