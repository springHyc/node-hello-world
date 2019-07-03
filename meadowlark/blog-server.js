var express = require('express');
var app = express();
var Vacation = require('./models/vacation.js');
var ViewPoint = require('./models/viewPoint.js');
var initViewPoint = require('./lib/initViewPoint');

app.set('port', process.env.PORT || 4321);

// 连接数据库
// meadowlark:数据库名称
// root:账号
// he123456:密码
var mongoose = require('mongoose');
var MongoSessionStore = require('session-mongoose')(require('connect'));
mongoose.connect(
    'mongodb+srv://root:he123456@node-db-sfoe4.mongodb.net/meadowlark?retryWrites=true',
    {
        server: { socketOptions: { keepAlive: 1 } },
        useNewUrlParser: true
    }
);

// 设置的路径
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());
initViewPoint.init();
app.get('/', (req, res) => {
    // res.type("text/plain");
    // res.send("Meadowlark Travel");
    res.send('{"code": 200,"data": {"name": "hehe"}}');
});
// 返回一个接口，jsonp的数据
app.get('/about.do', (req, res, next) => {
    //   res.send('callback({name:"dezhao"})');
    res.send('{"code": 200,"data": {"name": "hehe"}}');
});

app.get('/hehe/vacations', (req, res) => {
    Vacation.find({ available: false }, (err, vacations) => {
        res.send(JSON.stringify(vacations));
    });
});

app.get('/viewPoints', (req, res) => {
    ViewPoint.find({}, (err, viewPoints) => {
        res.send(JSON.stringify(viewPoints));
    });
});

app.post('/viewPoint', (req, res) => {
    if (req.body.data._id) {
        // update
        console.log('update:======', '\n', req.body.data);
        ViewPoint.findByIdAndUpdate(req.body.data._id, req.body.data).then(
            viewPoint => {
                res.send(JSON.stringify(viewPoint));
            }
        );
    } else {
        // create
        new ViewPoint(req.body.data).save().then(
            viewPoint => {
                console.log('保存成功！\n', viewPoint);
                res.send(JSON.stringify(viewPoint));
            },
            () => console.log('保存失败！')
        );
    }
});

app.delete('/viewPoint/:id', (req, res) => {
    ViewPoint.findByIdAndRemove(req.params.id).then(viewPoint => {
        console.log('删除成功！\n', viewPoint);
        // res.send(JSON.stringify(viewPoint));
        res.json({ success: true });
    });
});

app.listen(app.get('port'), function() {
    console.log(
        `Express started on http://localhost:${app.get(
            'port'
        )};press Ctrl - C to terminate.`
    );
});
function newFunction(req) {
    console.log(`req.params.id=${req.params.id}`);
}
