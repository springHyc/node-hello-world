var express = require("express");
var fortune = require("./lib/fortunes.js");
var handlebars = require("express3-handlebars").create({
  defaultLayout: "main"
});
var app = express();
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  // res.type("text/plain");
  // res.send("Meadowlark Travel");
  res.render("home");
});
app.get("/about", (req, res) => {
  // res.type("text/plain");
  // res.send("About Meadowlark Travel");

  res.render("about", { fortune: fortune.getFortune() });
});

app.use(function(req, res) {
  // res.type("text/plain");
  // res.status(404);
  // res.send("404 - Not Found");
  res.status(404);
  res.render("404");
});

app.use(function(err, req, res, next) {
  // console.error(err.stack);
  // res.type("text/plain");
  // res.status(500);
  // res.send("500 - Server Error");
  console.error(err.stack);
  res.status(500);
  res.render("500");
});
app.use(express.static(__dirname + "/public"));

app.listen(app.get("port"), function() {
  console.log(
    `Express started on http://localhost:${app.get(
      "port"
    )};press Ctrl - C to terminate.`
  );
});
