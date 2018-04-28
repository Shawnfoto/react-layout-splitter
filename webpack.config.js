var path = require("path");
var webpack = require("webpack");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var node_modules_dir = __dirname + "/node_modules";
var min = process.argv.indexOf("--min") === -1 ? false : true;

var outputfile = "[name].bundle.[chunkhash:5].js";
var routeComponentRegex = /routes\/([^\/]+\/?[^\/]+).js$/;
var plugins = [];

plugins.push(new CleanWebpackPlugin([`dist/`]));

if (min) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, drop_console: true }
    })
  );
}

var config = {
  entry: {
    index: ["./index.js"]
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "dist/",
    filename: outputfile,
    chunkFilename: "[name].[chunkhash:5].chunk.js"
  },
  /*外部套件 */
  plugins: plugins,
  resolve: {
    extensions: ["", ".js", ".css", ".html"]
  },
  /*編碼器 */
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        query: {
          compact: false,
          cacheDirectory: true,
          presets: ["es2015", "stage-0", "react"]
        }
      },
      {
        test: /\.css$/,
        // exclude: /(node_modules|bower_components)/,
        loader: "style-loader!css-loader",
        options: {
          name: "my-chunk"
        }
      },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader?name=[path][name].[ext]&limit=50000"
      }, // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=[path][name].[ext]"
      },
      {
        test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
        loader: "url-loader?mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader:
          "url-loader?name=[path][name].[ext]&limit=50000&mimetype=application/octet-stream"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader:
          "url-loader?name=[path][name].[ext]&limit=50000&mimetype=image/svg+xml"
      }
    ],
    noParse: [/moment-with-locales/]
  }
};

module.exports = config;
