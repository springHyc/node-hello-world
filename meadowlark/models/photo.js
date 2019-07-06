const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    data: Buffer,
    // 关联的viewPoint的ID
    viewPointId: String
});

var Photo = mongoose.model('Photo', photoSchema);
module.exports = Photo;
