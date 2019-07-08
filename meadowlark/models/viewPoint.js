const mongoose = require('mongoose');

const viewPointSchema = mongoose.Schema({
    title: String,
    id: Number,
    bestTime: String,
    transportation: String,
    partner: String,
    isGo: Boolean,
    whenDid: String,
    imgIds: [String]
});

var ViewPoint = mongoose.model('ViewPoint', viewPointSchema);
module.exports = ViewPoint;
