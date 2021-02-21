const path = require('path');
const { merge } = require('webpack-merge');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const prod = process.argv.indexOf('-p') !== -1 || process.env.NODE_ENV === 'production';
const ENV_CONF = prod ? require('./webpack.config.prod') : require('./webpack.config.dev');

const config = {
    entry: {
        coda: './source/coda.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].js',
        assetModuleFilename: 'imgs/[name].[ext]',
    },
    devtool: prod ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: {
                                        version: 3,
                                        proposals: false, // 使用尚在“提议”阶段特性的 polyfill
                                    },
                                },
                            ],
                            '@babel/typescript',
                        ],
                        plugins: ['transform-class-properties'],
                    },
                },
            },
            {
                test: /\.less/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                config: path.resolve(__dirname, './postcss.config.js'),
                            },
                        },
                    },
                    'less-loader',
                ],
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        modules: ['source', 'node_modules', 'service'],
        extensions: ['*', '.js', '.ts'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCSSExtractPlugin({
            filename: 'styles/[name].css',
            chunkFilename: 'styles/[id].css',
        }),
    ],
};

module.exports = () => merge(config, ENV_CONF);
