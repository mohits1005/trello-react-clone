var { Track } = require('../models/track');
var { TrackModule } = require('../models/track_module');

const findTrack = (name) => {
    return new Promise((resolve, reject) => {
        Track.findOne({ 'track': name }).then((track) => {
            resolve(track);
        }, (e) => {
            reject(e);
        });
    })
}
const findTrackModules = (track) => {
    var module_ids = [];
    track.modules.forEach(function (element) {
        module_ids.push(element.module_id);
        if (element.child === undefined)
            element.child = [];
        element.child.forEach(function (inElement) {
            module_ids.push(inElement.module_id);
        })
    });
    return new Promise((resolve, reject) => {
        TrackModule.find({ 'module_id': { '$in': module_ids } }).then((track_modules) => {
            var status = 1;
            resolve(track_modules);
        }, (e) => {
            reject(e);
        });
    })
}
const getTrackData = async (name) => {
    const track = await findTrack(name);
    var module_ids = [];
    track.modules.forEach(function (element) {
        module_ids.push(element.module_id);
        if (element.child === undefined)
            element.child = [];
        element.child.forEach(function (inElement) {
            module_ids.push(inElement.module_id);
        })
    });
    const track_modules = await findTrackModules(track);
    const status = 1;
    return { status, track, module_ids, track_modules };
}

module.exports = {
    getTrackData,
    findTrack
};