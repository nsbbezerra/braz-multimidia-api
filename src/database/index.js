const mongoose = require("mongoose");
const configs = require("../configs/index");

mongoose.connect(configs.db_connection, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

module.exports = mongoose;
