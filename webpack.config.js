const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve } = require('path')

module.exports = {

    // devtool: 'source-map',
    entry: {
      // "viewer/index.js" : "./src/viewer/index.js",
      // "page/index.js" : "./src/page/index.js",
      // "course/index.js" : "./src/course/index.js",
      // "home/index.js" : "./src/home/index.js",
      // "exam/index.js" : "./src/exam/index.js",
      // "editor/index.js" : "./src/editor/index.js",
      "index.js" : "./src/index.js",
    },

    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name]',
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.html$/,
            use: {
                loader: "html-loader",
                options: { minimize: true }
            }
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
            test: /\.doenet$/,
            use: {loader: "raw-loader"}
        },
        {
          test: /\.(png|jp(e*)g|svg)$/,  
          use: [{
              loader: 'url-loader',
              options: { 
                  limit: 10000, // Convert images < 10kb to base64 strings
                  name: 'images/[hash]-[name].[ext]'
              } 
          }]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
          chunks:['index.js'],
          template: "./src/index.html",
          filename: "./index.html",
          // favicon: "",
      }),
      new MiniCssExtractPlugin({
          filename: "[name].css",
          // filename: "main.css",
          chunkFilename: "[id].css"
      }),
      new CopyWebpackPlugin([
        { from: 'static' }
      ])
  ],
    devServer: {
      port: 3000,
      // openPage: "protected",
    }
  };