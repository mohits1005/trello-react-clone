require('./config/config.js')
const express = require('express');

var { mongoose } = require('./db/mongoose');
var { getTrackData } = require('./controllers/track');
var { getProgramData, getClientTrackData } = require('./controllers/program');
var { generateToken, getTokenParams } = require('./controllers/auth');
var { authenticate } = require('./middleware/authenticate');
var { s3Upload, generateCfUrl } = require('./controllers/utils');
var { BoardModule } = require('./models/board');

var app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const port = process.env.PORT;

app.get('/ping', (req, res) => {
    res.send({status:1,msg:'Success'});
});

//creating board
app.post('/boards', (req, res) => {
    // console.log(req.body)
    var board = new BoardModule({
        // text: req.body.text,
        id: req.body.id,
        name: req.body.name,
        lanes: req.body.lanes,
        status: 1
    });
    board.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/program/fetch/', (req, res) => {
    var program = req.body.program_id;
    getProgramData(program).then((data) => {
        res.send(data);
    }).catch((errorMessage) => {
        res.send(errorMessage);
    });
});

app.post('/client/track/fetch/', [authenticate], (req, res) => {
    var token = req.header('Authorization');
    var token_params = getTokenParams(token);
    var track_id = req.body.track_id;
    getClientTrackData(token_params, track_id).then((data) => {
        res.send(data);
    }).catch((errorMessage) => {
        res.send(errorMessage);
    });
});

app.get('/tracks/fetch/:name', (req, res) => {
    var name = req.params.name;
    getTrackData(name).then((data) => {
        res.send(data);
    }).catch((errorMessage) => {
        res.send(errorMessage);
    });
});

app.get('/token', (req, res) => {
    var userData = {
        "uid": "MOHIT123",
        "usr": "Mohit   Sharma",
        "usr_type": 9,
        "email": "mohit@chalkstreet.com",
        "verified": 1,
        "device_density": "hdpi",
        "platform": "7",
        "acl_batches": "",
        "creator_tracks": "",
        "client_ids": ""
    }
    var referer = req.header('Referer');
    generateToken(referer, userData).then((data) => {
        res.send(data);
    }).catch((errorMessage) => {
        res.send(errorMessage);
    });
});

app.get('/me', [authenticate], (req, res) => {
    res.send("Success");
});

app.post('/upload/s3', (req, res) => {
    s3Upload().then((data) => {
        res.send(data);
    }).catch((errorMessage) => {
        res.send(errorMessage);
    });
});
app.get('/cloudfront', (req, res) => {
    generateCfUrl().then((data) => {
        res.send(data);
    }).catch((errorMessage) => {
        res.send(errorMessage);
    });
});
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};
