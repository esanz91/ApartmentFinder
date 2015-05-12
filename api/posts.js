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
            postModel.find().where(fieldName, value).select('address.longitude address.latitude').exec(function(err, posts) {
                console.log("posts: " + posts);

                // error
                if (err) {
                    console.log("error: " + err);
                    return res.send("error");
                }
                // posts not found
                if ((!posts) || (null === posts) || (posts.length == 0)) {
                    console.log("no search results found...");
                    return res.send("no matches");
                }
                // posts found
                if (posts) {
                    console.log("search results!");
                    console.log(posts);
                    //Todo: add markers to maps
                    return res.json({msg: "match", data: posts});
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
