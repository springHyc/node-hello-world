const mongoose = require('mongoose');

const viewPointSchema = mongoose.Schema({
    title: String,
    id: Number,
    createdTime: Date,
    bestTime: [String],
    transportation: String,
    partner: String,
    isGo: Boolean,
    whenDid: [String],
    imgIds: [String],
    notes: String
});

var ViewPoint = mongoose.model('ViewPoint', viewPointSchema);
module.exports = ViewPoint;
