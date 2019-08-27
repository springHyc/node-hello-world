const mongoose = require('mongoose');

// 照片附带信息存储
const imgInfoSchema = mongoose.Schema({
    viewPointId: String,
    url: String,
    title: String,
    desc: String,
    filename: String,
    createdTime: Number
});

var ImgInfo = mongoose.model('ImgInfo', imgInfoSchema);
module.exports = ImgInfo;
