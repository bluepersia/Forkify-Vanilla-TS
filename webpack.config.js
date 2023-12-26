const path = require ('path');
const {CleanWebpackPlugin} = require ('clean-webpack-plugin');

module.exports =
{
    entry: './src/index.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: './'
        }
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude:/node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve (__dirname, 'dist'),
        publicPath: '/dist'
    },
    plugins: [new CleanWebpackPlugin ()]
}