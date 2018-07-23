//const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache    : true,
                parallel : true,
                sourceMap: devMode
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    "mode": devMode ? "development" : "production",
    "node" : { "fs": "empty", "net": "empty", "tls": "empty" },
    "entry": {
        "bundle": "./src/js/index.js",
        "firebase-messaging-sw": "./src/js/firebase-messaging-sw.js"
    },
    "output": {
        "path": __dirname+'/www',
        "filename": "[name].js"
    },
    "devtool": devMode ? "source-map" : false,
    "watch": true,
    "module": {
        "rules": [
            // {
            //     "enforce": "pre",
            //     "test": /\.(js|jsx)$/,
            //     "exclude": /node_modules/,
            //     "use": "babel-loader"
            // },
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            "env",
                            "react",
                            "stage-0"
                        ],
                        "plugins": [
                            "transform-decorators-legacy"
                        ]
                    }
                }
            },
            // {
            //     "test": /\.s?css$/,
            //     "use": [
            //         devMode ? 'style-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' : MiniCssExtractPlugin.loader,
            //         "css-loader?modules&importLoaders=1",
            //         "sass-loader"
            //     ],
            //     // "loader": "style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"
            // },
            {
                "test": /\.s?css$/,
                "exclude": /(src\/js)/,
                "use": [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                "test": /src\/js\/components\/ui\/.+\.s?css$/,
                "use": [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader?modules&camelCase",
                    "sass-loader"
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.(gif|svg|jpg|png)$/,
                loader: "file-loader",
            }
        ]
    },
    "externals": ["ws"],
    "plugins": [
        new CopyWebpackPlugin([
            { from: './*.html', context: './src/' },
            { from: './*{.ico}|{.png}|{.svg}', context: './src' },
            { from: './img/*', context: './src' },
            { from: './img/*', context: './src/scss' },
            { from: './*', context: './src/scss/img/**/', to: 'img' },
            { from: './manifest.json', context: './src' },
            { from: './hello.js', context: './node_modules/hellojs/dist' },
            { from: './google-services.json', context: './src' },
            { from: './GoogleService-Info.plist', context: './src' },
            { from: './framework7.min.js.map', context: './node_modules/framework7/dist/js' },
        ]),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'bundle.css',
            chunkFilename: '[id].css',
        })
    ]
};