const webpack = require('webpack');

module.exports = {
    "mode": "development",
    "node" : { "fs": "empty", "net": "empty", "tls": "empty" },
    "entry": "./src/js/index.js",
    "output": {
        "path": __dirname+'/www',
        "filename": "bundle.js"
    },
    "devtool": "source-map",
    "module": {
        "rules": [
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            ["env", {"modules": false} ],
                            "react",
                            "stage-0"
                        ],
                        "plugins": ["transform-decorators-legacy"]
                    }
                }
            },
            {
                "test": /\.s?css$/,
                "exclude": /(src\/js)/,
                "use": [
                    'style-loader',
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                "test": /src\/js\/components\/.+\.s?css$/,
                "loader": "style-loader!css-loader?modules&camelCase&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader"
            },
            {
                "test": /src\/js\/pages\/.+\.s?css$/,
                "loader": "style-loader!css-loader?modules&camelCase&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader"
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
    }
};