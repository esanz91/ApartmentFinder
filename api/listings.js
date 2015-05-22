var request = require('request');
var listingModel = require('../models/listing');
var userModel = require('../models/user');

exports.updateListingById = function(req, res){
    var listingID = req.params.listingID;
    listingModel.find().where("_id", listingID).select('').lean().exec(function(err, listing) {
        // error
        if (err) {
            return res.send({msg: "error"});
        }
        // listings not found
        if ((!listing) || (null === listing) || (listing.length == 0)) {
            return res.send({msg: "no matches"});
        }
        // listings found
        if (listing) {
            var conditions = {'local.username': req.session.username, 'listings.favorites': {$ne: listingID}};
            var update = {$push: {'listings.favorites': listingID}};
            userModel.update(conditions, update).exec(function(err, user){
                // error
                if (err) {
                    return res.send({msg: "error"});
                }
                // user not found
                if ((!user) || (null === user) || (user.length == 0)) {
                    return res.send({msg: "no matches"});
                }
                // user found
                if (user){
                    return res.send({msg: "match"});
                }
            });
        }
    });
}

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
            //listingModel.find(query, 'address.longitude address.latitude', function (err, listings) {
            listingModel.find().where(fieldName, value).select('').lean().exec(function(err, listings) {

                // error
                if (err) {
                    return res.send({msg: "error"});
                }
                // listings not found
                if ((!listings) || (null === listings) || (listings.length == 0)) {
                    return res.send({msg: "no matches"});
                }
                // listings found
                if (listings) {
                    return res.json({msg: "match", locations: listings, focus: data.results[0].geometry.location});
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
