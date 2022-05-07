const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const StylelintPlugin = require('stylelint-webpack-plugin');

const entries = (function () {
    const entryFiles = glob.sync(
        path.join(__dirname, '../src/entries/') + '**/*.ts'
    );
    const map = {};
    entryFiles.forEach((filePath) => {
        const filename = filePath.replace(
            /.*\/(\w+)\/(\w+)(\.html|\.ts)$/,
            (rs, $1, $2) => $2
        );
        map[filename] = filePath;
    });

    return map;
})();
const htmlPlugins = Object.keys(entries).map((key) => {
    return new HtmlWebpackPlugin({
        title: key,
        chunks: [key],
        filename: path.join(__dirname, '../dist', key + '.html'),
        template: path.resolve(__dirname, '../public/index.html'),
    });
});
const extensions = ['.tsx', '.ts', '.js', '.jsx', '.vue'];
module.exports = {
    entry: entries,
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
        library: {
            name: 'myLibrary',
            type: 'umd',
        },
    },
    resolve: {
        extensions,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            },
            {
                test: /\.[jt]sx?$/,
                exclude: /(node_modules|bower_components)/,
                use: 'swc-loader',
            },
            {
                test: /\.(bin|jpe?g|png)$/,
                loader: 'file-loader',
                options: { esModule: false },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new ESLintPlugin({
            context: path.join(__dirname, '../'),
            extensions,
        }),
        ...htmlPlugins,
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                extensions: {
                    vue: {
                        enabled: true,
                        compiler: '@vue/compiler-sfc',
                    },
                },
            },
        }),
        new StylelintPlugin({
            context: path.join(__dirname, '../'),
            extensions: ['css', 'scss', 'sass', 'vue'],
        }),
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ],
    stats: {
        children: true,
    },
    optimization: {
        // splitChunks: {
        //     cacheGroups: {
        //         // 打包业务中公共代码
        //         common: {
        //             name: 'common',
        //             chunks: 'initial',
        //             minSize: 1,
        //             priority: 0,
        //             minChunks: 2, // 同时引用了2次才打包
        //         },
        //         // 打包第三方库的文件
        //         vendor: {
        //             name: 'vendor',
        //             test: /[\\/]node_modules[\\/]/,
        //             chunks: 'initial',
        //             priority: 10,
        //             minChunks: 2, // 同时引用了2次才打包
        //         },
        //     },
        // },
        // runtimeChunk: { name: 'manifest' }, // 运行时代码
    },
};
