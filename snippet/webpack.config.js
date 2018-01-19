const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const isProd = process.env.NODE_ENV == 'production';

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    devtool: isProd ? 'source-map': 'eval-cheap-module-source-map',
    output: {
        path: path.resolve(__dirname),
        filename: 'static/js/[name].[hash:8].js',
        chunkFilename: 'static/js/[name].[hash:8].chunk.js',
    },
    devServer: {
        contentBase: path.resolve(__dirname),
        port: 9000,
        stats: "errors-only",
        open: true,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: (isProd) ? ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                }) : ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Harish Rajput :: Full Stack Developer',
            template: './src/index.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
        }),
        new ExtractTextPlugin({
            filename: '[name].[hash:8].css',
            disable: !isProd
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.ProvidePlugin({
            Popper: "popper.js",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new SWPrecacheWebpackPlugin({
            cacheId: 'doubleh-rajput',
            filename: 'sw.js',
            minify: true,
            disable: !isProd
        })
    ]
};