const path = require ('path');
const {CleanWebpackPlugin} = require ('clean-webpack-plugin');

module.exports =
{
    entry: './src/index.ts',
    mode: 'production',
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
        path: path.resolve (__dirname, 'dist')
    },
    plugins: [new CleanWebpackPlugin ()]
}