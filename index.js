var http = require("http");
var fs = require("fs");
const hostname = "127.0.0.1";
const port = 3000;

// 读取文件
function serveStaticFile(res, path, contentType, responseCode) {
  if (!responseCode) {
    responseCode = 200;
  }
  fs.readFile(__dirname + path, function(err, data) {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain", charset: "gb2312" });
      res.end("500 - Internal Error");
    } else {
      res.writeHead(responseCode, {
        "Content-Type": "text/html",
        charset: "gb2312"
      });
      res.end(data);
    }
  });
}

http
  .createServer(function(req, res) {
    var path = req.url.replace(/\/?(?:\?.*)?$/, "").toLocaleLowerCase();
    switch (path) {
      case "/":
        serveStaticFile(res, "/public/home.html", "text/html");
        break;
      case "/about":
        serveStaticFile(res, "/public/about.html", "text/html");
        break;
      case "/img/logo.jpg":
        serveStaticFile(res, "/public/img/logo.jpg", "image/jpeg");
        break;
      default:
        serveStaticFile(res, "/public/404.html", "text/html");
        break;
    }
  })
  .listen(port);

console.log(`Server running at http://${hostname}:${port}/`);
