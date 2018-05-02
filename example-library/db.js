var mongoose = require('mongoose');

var mongoDB = 'mongodb://example:example@ds111050.mlab.com:11050/example-library';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;
