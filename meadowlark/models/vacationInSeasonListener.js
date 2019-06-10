const mongoose = require("mongoose");

const vacationInSeasonListenerSchema = mongoose.Schema({
  email: String,
  skus: [String]
});

var VacationInSeasonListener = mongoose.model(
  "VacationInSeasonListener",
  vacationInSeasonListenerSchema
);

module.exports = VacationInSeasonListener;
