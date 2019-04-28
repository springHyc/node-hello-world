var express = require("express");
var fortune = require("./lib/fortunes.js");
var formidable = require("formidable");

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

app.post("/process", (req, res) => {
  console.log("Form (from querystring): " + req.query.form);
  console.log("CSRF token (from hidden from field): " + req.body._csrf);
  console.log("姓名 (from visible form field): " + req.body.name);
  console.log("邮箱 (from visible form field): " + req.body.email);
  // 添加jQuery
  if (req.xhr || req.accepts("json,html") === "json") {
    res.send({ success: true });
  } else {
    res.redirect(303, "/thank-you"); // 重定向
  }
});
app.get("/thank-you", function(req, res) {
  res.render("thank-you");
});

app.get("/contest/vacation-photo", (req, res) => {
  var now = new Date();
  res.render("contest/vacation-photo", {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.post("/contest/vacation-photo/:year/:month", function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {
      return res.redirect(303, "/erroe");
    }
    console.log("received fields:");
    console.log(fields);
    console.log("received files:");
    console.log(files);
    res.redirect(303, "/thank-you");
  });
});

//get和post都可以是有个all

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
