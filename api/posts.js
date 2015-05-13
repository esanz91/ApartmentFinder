var request = require('request');
var postModel = require('../models/post');

exports.getMarkers = function (req, res) {
    var address = req.query.postalAddress;

    request.post("http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false", function (err, response, body) {
        if (!err && response.statusCode === 200) {
            var data = JSON.parse(body);
            var longitude = data.results[0].geometry.location.lng;
            var latitude = data.results[0].geometry.location.lat;
            var type = data.results[0].types[0];
            var fieldName = "address." + type;
            var value = queryGoogleComponentsByType(type, data.results[0].address_components);

            console.log("type: " + type);
            console.log("field name: " + fieldName);
            console.log("value: " + value);
            console.log("lng: " + longitude + ", lat:" + latitude);

            //var query = {};
            //query[fieldName] = value;
            //postModel.find(query, 'address.longitude address.latitude', function (err, posts) {
            postModel.find().where(fieldName, value).select('address.longitude address.latitude').lean().exec(function(err, posts) {

                // error
                if (err) {
                    return res.send({msg: "error"});
                }
                // posts not found
                if ((!posts) || (null === posts) || (posts.length == 0)) {
                    return res.send({msg: "no matches"});
                }
                // posts found
                if (posts) {
                    return res.json({msg: "match", markerList: posts, lng: posts[0].address.longitude, lat: posts[0].address.latitude});
                }
            });
        }
    });
}

function queryGoogleComponentsByType(type, components) {
    return components.filter(function (item) {
        return item.types.filter(function (addressType) {
                return addressType == type;
            }).length > 0;
    }).map(function (item) {
        return item.long_name
    });
}
