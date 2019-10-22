import '../css/index.css';
import '../less/index.less';
import add from './module';

console.log(add(100, 855));

/*
  下载包：
    npm i webpack webpack-cli -g
    npm i webpack webpack-cli -D
  使用：
    webpack src/js/index.js -o build/js/built.js --mode=development
      功能：
        1. 将所有js打包成一个js
        2. 将ES6的模块化语法装换成浏览器能识别的语法
    webpack src/js/index.js -o build/js/built.js --mode=production
      功能：
        1. 将所有js打包成一个js
        2. 将ES6的模块化语法装换成浏览器能识别的语法
        3. 压缩js代码
    默认webpack只能打包js和json文件，其他文件类型需要引入loader解析
 */
