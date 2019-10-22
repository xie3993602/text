const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
    entry:["./src/js/index.js","./src/index.html"],
    output:{
        filename:"./js/built.js",
        path:resolve(__dirname,"build")
    },
    module:{
        rules:[     //loader的配置
            {
                test:/\.css$/,
                use:["style-loader","css-loader"]
            },
            {
                test:/\.less$/,
                use:["style-loader","css-loader","less-loader"]
            },
            {
                test:/\.(png|jpg|gif|webp)$/,
                use:{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        outputPath:"imgs",
                        name:"[hash:6].[ext]"
                    }
                }
            },
            {
                test:/\.html$/,
                loader:"html-loader",
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:"eslint-loader",
                options: {
                    fix:true
                }
            },
            {
                test:/\.(eot|svg|ttf|woff)$/,
                loader:"file-loader",
                options:{
                    name:"[hash:6].[ext]",
                    outputPath:"media"
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({//以./src/index.html为模板创建新的html文件（1. 结构和模板文件一样 2. 自动引入js/css）
            template: "./src/index.html"
        }),
        new AddAssetHtmlPlugin({//能给HtmlWebpackPlugin生成的html文件添加资源（js/css）
            filepath: require.resolve('./src/js/iconfont.js'),
            outputPath:"js",// 决定文件输出路径
            publicPath:"js" // 决定script.src的文件路径
        }),
    ],
    mode:"development",
    devServer:{// npm i webpack-dev-server -D
        contentBase:resolve(__dirname,"build"),
        compress:true,
        port:4564,
        open:true,
        hot:true
    },
    devtool:"cheap-module-eval-source-map"  // 追踪源代码错误
};