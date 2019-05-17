var mongoose = require('mongoose');

var UserSession = mongoose.model('UserSession', {
    module_id: {
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
    last_t: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    min_t_s: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    u_t_s: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    usr_data: {
        type: Array
    }
}, 'user_module_sessions');

module.exports = {
    UserSession
};