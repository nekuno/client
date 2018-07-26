const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    "mode": "production",
    "node" : { "fs": "empty", "net": "empty", "tls": "empty" },
    "entry": {
        "bundle": "./src/js/index.js",
        "firebase-messaging-sw": "./src/js/firebase-messaging-sw.js"
    },
    "output": {
        "path": __dirname+'/www',
        "filename": "[name].js"
    },
    "optimization": {
        "minimizer": [
            new UglifyJsPlugin({
                "cache"    : true,
                "parallel" : true,
                "sourceMap": false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    "module": {
        "rules": [
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
            {
                "test": /\.s?css$/,
                "exclude": /(src\/js)/,
                "use": [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                "test": /src\/js\/components\/ui\/.+\.s?css$/,
                "use": [
                    MiniCssExtractPlugin.loader,
                    "css-loader?modules&camelCase",
                    "sass-loader"
                ]
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
            { from: './img/*', context: './src' },
            { from: './img/*', context: './src/scss' },
            { from: './**/*', context: './src/scss/img', to: 'img' },
            { from: './manifest.json', context: './src' },
            { from: './hello.js', context: './node_modules/hellojs/dist' },
            { from: './google-services.json', context: './src' },
            { from: './GoogleService-Info.plist', context: './src' },
            { from: './framework7.min.js.map', context: './node_modules/framework7/dist/js' },
        ]),
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
            chunkFilename: '[id].css',
        })
    ]
};