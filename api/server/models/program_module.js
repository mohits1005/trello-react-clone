var mongoose = require('mongoose');

var ProgramModule = mongoose.model('ProgramModule', {
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
}, 'program_modules');

module.exports = {
    ProgramModule
};