var ViewPoint = require('../models/viewPoint.js');

exports.init = function() {
    ViewPoint.find(function(err, viewPoints) {
        if (viewPoints.length) return;

        new ViewPoint({
            title: 'Hood River Day Trip'
        }).save();

        new ViewPoint({
            title: 'Oregon Coast Getaway'
        }).save();
    });
};
