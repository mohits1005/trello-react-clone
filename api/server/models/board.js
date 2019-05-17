var mongoose = require('mongoose');

var BoardModule = mongoose.model('BoardModule', {
    id: {
        type: Number,
        required: true,
        minlength: 1
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lanes: {
        type: Array,
    },
    status: {
        type: Number,
        required: true,
        minlength: 1
    }
}, 'board_modules');

module.exports = {
    BoardModule
};