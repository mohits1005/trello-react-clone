require('../config/config.js')
var mongoose = require('mongoose');
const mongodb_uri = process.env.MONGODB_URI;
mongoose.promise = global.Promise;
mongoose.connect(mongodb_uri, { useNewUrlParser: true });

module.exports = {
    mongoose
};
