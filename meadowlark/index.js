var express = require("express");
var fortune = require("./lib/fortunes.js");

var weather = require("./src/partials/weather.js");
var handlebars = require("express3-handlebars").create({
  defaultLayout: "main"
});
var app = express();
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

// 设置的路径
app.use(express.static(__dirname + "/public"));
app.use(require("body-parser")());
// 针对每个路径，要放在前面
app.use(function(req, res, next) {
  if (!res.locals.partials) {
    res.locals.partials = {};
  }
  res.locals.partials.weather = weather.getWeatherData();
  next();
});
app.get("/", (req, res) => {
  // res.type("text/plain");
  // res.send("Meadowlark Travel");
  res.render("home");
});
app.get("/about", (req, res) => {
  // 使用另外的模板文件
  res.render("about", { fortune: fortune.getFortune(), layout: "microsite" });
});

// 返回一个接口，jsonp的数据
app.get("/about.do", (req, res) => {
  res.send('callback({name:"dezhao"})');
});

app.get("/test", (req, res) => {
  res.type("text/plain");
  res.send("this is a test");
});

app.get("/main-layout", (req, res) => {
  res.render("home", { layout: null });
});

app.get("/api/tour/:id", (req, res) => {
  res.json({ success: true });
});

app.get("/newsletter", (req, res) => {
  res.render("newsletter", { csrf: "CSRF token goes here" });
});

app.use(function(req, res) {
  res.status(404).render("404");
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("500");
});

app.listen(app.get("port"), function() {
  console.log(
    `Express started on http://localhost:${app.get(
      "port"
    )};press Ctrl - C to terminate.`
  );
});
