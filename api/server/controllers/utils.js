require('../config/config.js')
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto')
var util = require('util')
var urlParse = require('url')

const s3Upload = () => {
    var access_key = process.env.AWS_KEY;
    var secret = process.env.AWS_SECRET;
    var s3 = new AWS.S3({
        accessKeyId: access_key,
        secretAccessKey: secret
    });
    var myBucket = 'nodes3uploads';
    var myKey = 'uploads/image1.png';
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname,'/image1.png'), function (err, data) {
            if (err) { reject(err); }
            params = { Bucket: myBucket, Key: myKey, Body: data };
            s3.putObject(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve({status:1, msg:`Successfully uploaded data to ${myBucket}/${myKey}`});
                }
            });
        });
    });
};
const generateCfUrl = () => {

    var resourceKey = 'https://d2mr3qxhcfbtri.cloudfront.net/imgs/064abf-jk3s4r/1525436115_YbcP1.jpeg';
    var date = new Date();
    var time = parseInt(date.getTime() / 1000);
    var expires = time + (3 * 86400);
    var policy = { "Statement": [{ "Resource": resourceKey, "Condition": { "DateLessThan": { "AWS:EpochTime": expires } } }] };
    return new Promise((resolve, reject) => {
        try {
            var sign = crypto.createSign('RSA-SHA1')
            var pem = fs.readFileSync(path.resolve(__dirname, './cert/pk-APKAIELMH7EG4DZZXPIQ.pem'));

            //check if readfile is working
            var key = pem.toString('ascii')
            sign.update(JSON.stringify(policy))
            var signature = sign.sign(key, 'base64');
            var url = {
                host: 'd2mr3qxhcfbtri.cloudfront.net',
                protocol: 'https',
                pathname: 'imgs/064abf-jk3s4r/1525436115_YbcP1.jpeg'
            }
            var cloudfrontAccessKey = process.env.CF_KEY;
            var policy_64 = new Buffer(JSON.stringify(policy)).toString('base64');
            var params = [
                'Key-Pair-Id=' + cloudfrontAccessKey,
                'Expires=' + expires,
                'Signature=' + signature,
                'Policy=' + policy_64
            ];
            var signedUrl = util.format('%s?%s', urlParse.format(url), params.join('&'))
            resolve({signedUrl});
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    s3Upload,
    generateCfUrl
};