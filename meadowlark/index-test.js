var express = require("express");
var app = express();

app.set("port", process.env.PORT || 3000);

switch (app.get("env")) {
  case "development":
    app.use(require("morgan")("dev"));
    break;
  case "production":
    app.use(
      require("express-logger")({ path: __dirname + "/log/requests.log" })
    );
    break;
}
app.use(function(req, res, next) {
  console.log("\n\nallways");
  next();
});

app.get("/a", (req, res, next) => {
  console.log("/a:路由终止");
  res.send("a");
});
app.get("/a", (req, res, next) => {
  console.log("/a:永远不会被调用");
  //   res.send("a2");
});

app.get("/b", (req, res, next) => {
  console.log("/b: 路由未终止");
  next();
});

app.use((req, res, next) => {
  console.log("sometimes");
  next();
});
app.get("/b", (req, res, next) => {
  console.log("/b (part 2): 抛出错误");
  throw new Error("b 失败");
});
app.use("/b", (err, req, res, next) => {
  console.log("/b 检测到错误并传递");
  next(err);
});

app.get("/c", (err, req) => {
  console.log("/c: 抛出错误");
  throw new Error("c 失败");
});

app.use("/c", (err, req, res, next) => {
  console.log("/c: 检测到错误但不传递");
  next();
});

app.use((err, req, res, next) => {
  console.log("检测到未处理的错误：" + err.message);
  res.send("500 - server error!");
});

app.use((req, res) => {
  console.log("未处理的路由！");
  res.send("404 - NOT FOUND!");
});

app.listen(app.get("port"), function() {
  console.log(
    `Express started on http://localhost:${app.get(
      "port"
    )};press Ctrl - C to terminate.`
  );
});
