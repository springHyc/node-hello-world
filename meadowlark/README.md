# node-hello-world

学习《node 与 express 开发》时的 code

## 添加 nodemon

一个监控工具，在它发现`JavaScript`被修改后会自动重启服务器。

## 启动命令（有改动会自动重启需要）

`node index.js`
`npx nodemon index.js` or `nodemon [--debug] index.js` - 由于`nodemon`并不是安装的全局的，所以要这样启动。具体可查看[nodemon](https://github.com/remy/nodemon)

npx 需要 nodev6 以上和调试组件所需版本号冲突

## 手动重启

`rs`

## jshint

`npx jshint index.js`

## package 记录

- body-parser 来解析 post 请求 URL 编码

## todo

- 添加 log4js 日志记录，试试

## 添加`node-inspector`调试

`node-inspector&` 后台启动 node 探查器
然后 `node --debug index.js`
就可以在 chrome 上调试 node 程序啦
调试地址：`http://127.0.0.1:8080/?port=5858`

## 添加 mongolab

- `https://cloud.mongodb.com/v2/5ccfa15e014b760ad382c70d#clusters?fastPoll=true`
