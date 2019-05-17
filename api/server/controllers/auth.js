require('../config/config.js')
const jwt = require('jsonwebtoken');
var redis = require("redis");

var generateToken = (referer, userData) => {
    return new Promise((resolve, reject) => {
        var token = {};
        var hosted_zone = 'facenxt.com';
        var g_audience_map = {
            "1": "*",
            "2": "https://" + hosted_zone,
            "3": "https://android." + hosted_zone,
            "4": "https://ios." + hosted_zone,
            "5": "https://dev." + hosted_zone,
            "6": "http://localhost",
            "7": "https://beta." + hosted_zone
        };
        var g_redis_expirey = 3 * 86400;
        //global variables end
        var uid = userData.uid;
        var usr = userData.usr === undefined ? 'New User' : userData.usr;
        var usr_type = userData.usr_type === undefined ? '1' : userData.usr_type;
        var email = userData.email;
        var verified = userData.verified === undefined ? 0 : userData.verified;
        var device_density = userData.device_density === undefined ? 'hdpi' : userData.device_density;
        var platform_type = userData.platform;
        var acl_batches = userData.acl_batches === undefined ? '' : userData.acl_batches;
        var creator_tracks = userData.creator_tracks === undefined ? '' : userData.creator_tracks;
        var client_ids = userData.client_ids === undefined ? '' : userData.client_ids;
        var audience = g_audience_map[platform_type];
        var g_redis_token_prefix = "AUTH_";
        var date = new Date();
        var time = parseInt((date.getTime())/1000);
        var token_key = g_redis_token_prefix + uid + "_" + platform_type + "_" + time;
        var tokenData = {
            'iss': referer,
            'aud': audience,
            'jti': token_key,
            'iat': time,
            'nbf': time,
            'exp': time + g_redis_expirey,
            'uid': uid,
            'usr': usr,
            'usr_type': usr_type,
            'email': email,
            'verified': verified,
            'device_density': device_density,
            'platform': platform_type,
            'acl_batches': acl_batches,
            'creator_tracks': creator_tracks,
            'client_ids': client_ids
        };
        var signer = 'MUINELLIMNOCLAF';
        token = jwt.sign(tokenData, signer);
        //save in redis
        try {
            var host = process.env.REDIS_URI;
            var port = process.env.REDIS_PORT;
            var client = redis.createClient(port, host);
            client.set(token_key, token);
            resolve({ token, token_key });
        } catch (e) {
            reject(e);
        }
        reject(e);
    })
};
var getTokenParams = (token) => {
    var g_signer = "MUINELLIMNOCLAF";
    token_params = {}
    token_params = jwt.verify(token, g_signer);
    return token_params;
}
module.exports = {
    generateToken,
    getTokenParams
};