var mongoose = require('mongoose');

var TrackModule = mongoose.model('TrackModule', {
    program_id: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    module_id: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    module_name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
}, 'track_modules');

module.exports = {
    TrackModule
};