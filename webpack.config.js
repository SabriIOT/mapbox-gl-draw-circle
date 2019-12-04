const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

const config = {
    entry: './index.js',
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        sourceMapFilename: 'bundle.js.map'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CompressionPlugin()
    ]
};

module.exports = config;
