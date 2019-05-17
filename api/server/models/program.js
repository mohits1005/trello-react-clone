var mongoose = require('mongoose');

var Program = mongoose.model('Program', {
    program_id: {
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
    program: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
}, 'program');

module.exports = {
    Program
};