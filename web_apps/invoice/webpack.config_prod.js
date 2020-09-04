var path = require('path');
//var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './app/index.js',
    output: {
        path: path.resolve(__dirname, '../../public/invoice_files'),
        filename: 'index_bundle.js'
    },
    module: {
        rules: [{
            test: /\.(js)$/,
            use: 'babel-loader'
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
        ]
    },
    mode: 'production',
    plugins: []

}