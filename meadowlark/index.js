var express = require("express");
var fortune = require("./lib/fortunes.js");
var initVacations = require("./lib/initVacations");
var formidable = require("formidable");
var fs = require("fs");

var Vacation = require("./models/vacation.js"); // 引入Mongoose创建的Vacation模型对象

var weather = require("./src/partials/weather.js");
var handlebars = require("express3-handlebars").create({
  defaultLayout: "main"
});
var app = express();
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);
initVacations.init();

// 连接数据库
// meadowlark:数据库名称
// root:账号
// he123456:密码
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://root:he123456@node-db-sfoe4.mongodb.net/meadowlark?retryWrites=true",
  {
    server: { socketOptions: { keepAlive: 1 } },
    useNewUrlParser: true
  }
);

// 连接数据库

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

var dataDir = __dirname + "/data";
var vacationPhotoDir = dataDir + "vacation-photo";
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

function saveContestEntry(contestName, email, year, month, photoPath) {
  // todo
}
app.post("/contest/vacation-photo/:year/:month", function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {
      return res.redirect(303, "/error");
    }
    if (err) {
      res.session.flash = {
        type: "danger",
        intro: "Oops!",
        message:
          "There was an error processing your submission. " +
          "Please try again."
      };
      return res.redirect(303, "/contest/vacation-photo");
    }
    var photo = files.photo;
    var dir = vacationPhotoDir + "/" + Date.now();
    var path = dir + "/" + photo.name;
    fs.mkdirSync(dir);
    fs.renameSync(photo.path, dir + "/" + photo.name);
    saveContestEntry(
      "vacation-photo",
      fields.email,
      req.params.year,
      req.params.month,
      path
    );
    req.session.flash = {
      type: "success",
      intro: "Good luck!",
      message: "You have been entered into the contest."
    };
    // return res.redirect(303, "/contest/vacation-photo/entries");
    return res.redirect(303, "/thank-you");

    console.log("received fields:");
    console.log(fields);
    console.log("received files:");
    console.log(files);
    res.redirect(303, "/thank-you");
  });
});

app.get("/vacations", (req, res) => {
  // 只会展示2条数据
  Vacation.find({ available: true }, (err, vacations) => {
    var context = {
      vacations: vacations.map(vacation => {
        return {
          sku: vacation.sku,
          name: vacation.name,
          description: vacation.description,
          price: vacation.getDisplayPrice(),
          inSeason: vacation.inSeason
        };
      })
    };
    res.render("vacations", context);
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
