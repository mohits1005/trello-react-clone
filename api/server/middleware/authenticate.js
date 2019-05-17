require('../config/config.js')
const jwt = require('jsonwebtoken');
var redis = require("redis");
var authenticate = (req, res, next) => {
    try {
        var host = process.env.REDIS_URI;
        var port = process.env.REDIS_PORT;
        var g_signer = "MUINELLIMNOCLAF";
        client = redis.createClient(port, host);
        var token = req.header('Authorization');
        var decoded = {};
        decoded = jwt.verify(token, g_signer);
        var jti = decoded.jti;
        client.get(jti, function (err, reply) {
            if (reply === token) {
                next();
            }
            else {
                res.status(403).send(err);
            }
        });
        client.on("error", function (err) {
            res.status(403).send(err);
        });
    }
    catch (err) {
        res.status(403).send(err);
    }
};
module.exports = {
    authenticate
};