const {resolve} = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "js/[contenthash:8].js",
        path: resolve(__dirname, "../build"),
        publicPath: "/"
    },
    module: {
        rules: [     //loader的配置
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: "pre",  //提前执行
                loader: "eslint-loader",
                options: {
                    fix: true    //一旦出现eslint错误自动修复
                }
            },
            {
                oneOf: [ //以下loader只会执行一个
                    {
                        test: /\.css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            "css-loader",
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins: (loader) => [
                                        require('postcss-import')({root: loader.resourcePath}),
                                        require('postcss-preset-env')(),
                                        require('cssnano')()
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            "css-loader",
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins: (loader) => [
                                        require('postcss-import')({root: loader.resourcePath}),
                                        require('postcss-preset-env')(),
                                        require('cssnano')()
                                    ]
                                }
                            },
                            "less-loader"
                        ]
                    },
                    {
                        test: /\.(png|jpg|gif|webp)$/,
                        use: {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                outputPath: "images",
                                name: "[hash:6].[ext]",
                                publicPath: "images"
                            }
                        }
                    },
                    {
                        test: /\.html$/,
                        loader: "html-loader",
                    },
                    /*{
                        test: /\.(eot|svg|ttf|woff)$/,
                        loader: "file-loader",
                        options: {
                            name: "[hash:6].[ext]",
                            outputPath: "media"
                        }
                    },*/
                    {
                        test: /\.js$/,
                        use: [
                            "thread-loader",   //开辟loader池,加载代码,一般给js使用,因为js代码量大,耗时
                            {
                                loader: 'babel-loader',
                                options: {
                                    "presets": [
                                        [
                                            "@babel/preset-env",
                                            {//实现js按需加载兼容性处理
                                                useBuiltIns: "usage",
                                                corejs: {version: 3, proposals: true},
                                                targets: {
                                                    ie: 8,
                                                    chrome: 59,
                                                    edge: 13,
                                                    firefox: 50,
                                                }
                                            }
                                        ]
                                    ],
                                    cacheDirectory: true  // 缓存babel执行结果
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({//以./src/index.html为模板创建新的html文件（1. 结构和模板文件一样 2. 自动引入js/css）
            template: "./src/index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        }),
        /*new AddAssetHtmlPlugin({//能给HtmlWebpackPlugin生成的html文件添加资源（js/css）
            filepath: require.resolve('../src/js/iconfont.js'),
            outputPath: "js",// 决定文件输出路径
            publicPath: "/js" // 决定script.src的文件路径
        }),*/
        new MiniCssExtractPlugin({// 提取css成单独文件
            filename: 'css/[contenthash:8].css',
            chunkFilename: 'css/[contenthash:8].css',
            ignoreOrder: false,
        }),
        new OptimizeCssAssetsPlugin({   //压缩css文件
            //assetNameRegExp: /\.optimize\.css$/g,
            //cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: { // 解决source-map不生效问题(github搜索出来的方案)
                    inline: false,
                    annotation: true,
                }
            },
            cssProcessorPluginOptions: {
                preset: ['default', {discardComments: {removeAll: true}}],
            },
            //canPrint: true
        }),
        new CleanWebpackPlugin(),
    ],
    mode: "production",
    devtool: "cheap-module-source-map",  // 追踪源代码错误
    resolve: {
        alias: {
            $css: resolve(__dirname, '../src/css'),
            $less: resolve(__dirname, '../src/less'),
        },
        extensions: ['.js', '.json', '.less']
    },
    externals: {
        jquery: 'jQuery'
    },
    performance: {
        hints: false
    }
};