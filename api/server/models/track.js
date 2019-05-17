var mongoose = require('mongoose');

var Track = mongoose.model('Track', {
    track_id: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    uid: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    modules: {
        type: Array
    },
    track: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
}, 'track');

module.exports = {
    Track
};