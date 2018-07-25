const webpack = require('webpack');
const path = require('path');

let config = {
    entry: {app: './public/js/global.js'},
    output: {
        path: path.resolve(__dirname, './public/output'),
        filename: 'output.js'
    },
    mode: 'development',
    module: {
        rules: [
          {
            test: /\.js$/, // files ending with .js
            exclude: /node_modules/, // exclude the node_modules directory
            loader: "babel-loader" // use this (babel-core) loader
          },
          {
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
          },
          {
            test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: ['url-loader']
          },
          {
            test: /\.(html)$/,
            use: {
              loader: 'html-loader',
              options: {
                attrs: [':data-src']
              }
            }
          },
        ]
    },
}

module.exports = config;