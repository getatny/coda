const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './source/demo/comment-demo.html', to: './demo/comment-demo.html' },
            ],
        }),
    ],
};

module.exports = config;
