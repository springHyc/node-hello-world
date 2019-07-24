var express = require('express');
var app = express();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');
var ViewPoint = require('./models/viewPoint');
var initViewPoint = require('./lib/initViewPoint');

const mineType = require('mime-types');

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
app.all('*', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*');
    //允许的header类型
    res.header('Access-Control-Allow-Headers', 'content-type');
    //跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    if (req.method.toLowerCase() == 'options') res.send(200);
    //让options尝试请求快速结束
    else next();
});

app.get('/api/', (req, res) => {
    // res.type("text/plain");
    // res.send("Meadowlark Travel");
    res.send('{"code": 200,"data": {"name": "hehe"}}');
});
// 返回一个接口，jsonp的数据
app.get('/api/about.do', (req, res, next) => {
    //   res.send('callback({name:"dezhao"})');
    res.send('{"code": 200,"data": {"name": "hehe"}}');
});

app.get('/api/viewPoints', (req, res) => {
    ViewPoint.find({}, (err, viewPoints) => {
        res.send(JSON.stringify(viewPoints));
    });
});

app.post('/api/viewPoint', (req, res) => {
    if (req.body.data._id) {
        // update
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

// 列表中删除记录
app.delete('/api/viewPoint/:id', (req, res) => {
    ViewPoint.findByIdAndRemove(req.params.id).then(viewPoint => {
        console.log('删除成功！\n', viewPoint);
        res.json({ success: true });
    });
});

// 列表中删除某张图片
app.delete('/api/viewPoint/photo/:id', (req, res) => {
    ViewPoint.findById(req.params.id, (err, viewPoint) => {
        const _imgIds = viewPoint.imgIds || [];
        const newImgUrls = _imgIds.filter(item => item != req.query.url);
        ViewPoint.findByIdAndUpdate(req.params.id, { imgIds: newImgUrls }).then(
            () => {
                console.log('delete url is success');
                let path = `${__dirname}/public${req.query.url}`;
                fs.unlink(path, err => {
                    if (err) throw err;
                    res.status(200).send({ message: '删除成功！' });
                });
            },
            () => {
                console.log('delete url is failure');
                res.status(200).send({ message: '删除失败！' });
            }
        );
    });
});

//upload上传图片
app.post('/api/viewPoint/photo/upload', multipartMiddleware, (req, res) => {
    if (!(req.files && req.files.file && req.files.file.path)) {
        return;
    }
    if (req.query.id == 'undefined') {
        res.status(400).send({ message: '没有ID不能存储' });
        return;
    }
    fs.readFile(req.files.file.path, (err, data) => {
        if (err) throw err;
        var viewPointId = req.query.id;
        let uri = `/img/${new Date().valueOf()}_${req.files.file.name}`;
        let path = `${__dirname}/public${uri}`;
        fs.writeFile(path, data, err => {
            if (err) throw err;
            res.status(200).send({ imgName: uri });
            ViewPoint.findById(viewPointId, (err, viewPoint) => {
                const _imgIds = viewPoint.imgIds || [];
                _imgIds.push(uri);
                ViewPoint.findByIdAndUpdate(viewPointId, {
                    imgIds: _imgIds
                }).then(
                    () => {
                        console.log(
                            '将photo.url插入 ViewPoint表中的imgIds字段success!'
                        );
                    },
                    () =>
                        console.log(
                            '将photo.url插入 ViewPoint表中的imgIds字段failure!'
                        )
                );
            });
        });
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
