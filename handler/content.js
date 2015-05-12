var request = require('request');
var postModel = require('../models/post');

function ContentHandler() {
    "use strict";

    this.displayMain = function (req, res) {
        "use strict";
        return res.render('home', {
            title: 'Spotaru',
            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
        });
    }

    this.displaySearch = function (req, res) {
        "use strict";
        return res.render('search', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }

    this.handleSearch = function (req, res) {
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
                        return res.render('msgs', {
                            msgs: err,
                            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                        });
                    }
                    // posts not found
                    if ((!posts) || (null === posts) || (posts.length == 0)) {
                        console.log("no search results found...");
                        return res.render('msgs', {
                            msgs: "no match",
                            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                        });
                    }
                    // posts found
                    if (posts) {
                        console.log("search results!");
                        console.log(posts);
                        //Todo: add markers to maps


                        return res.render('search', {
                            msgs: posts,
                            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                        });
                    }
                });
            }
        });
    }

    this.displayPost = function (req, res) {
        "use strict";
        return res.render('post', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
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

    this.handlePost = function (req, res) {
        "use strict";
        var address = req.body.postalAddress;
        var bedrooms = req.body.bedrooms;
        var bathrooms = req.body.bathrooms;
        var sqft = req.body.sqft;
        var rent = req.body.rent;
        //var pets = req.body.pets;
        //var amenities = req.body.amenities;

        request.post("http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false", function (err, response, body) {
            if (!err && response.statusCode === 200) {
                var data = JSON.parse(body);
                var postJSON = {
                    address: {
                        formatted_address   : data.results[0].formatted_address,
                        route               : queryGoogleComponentsByType("route", data.results[0].address_components),
                        neighborhood        : queryGoogleComponentsByType("neighborhood", data.results[0].address_components),
                        locality            : queryGoogleComponentsByType("locality", data.results[0].address_components),
                        administrative_area_level_2 : queryGoogleComponentsByType("administrative_area_level_2", data.results[0].address_components),
                        administrative_area_level_1 : queryGoogleComponentsByType("administrative_area_level_1", data.results[0].address_components),
                        postal_code         : queryGoogleComponentsByType("postal_code", data.results[0].address_components),
                        country             : queryGoogleComponentsByType("country", data.results[0].address_components),
                        longitude           : data.results[0].geometry.location.lng,
                        latitude            : data.results[0].geometry.location.lat
                    },
                    aptDetails: {
                        bedrooms            : bedrooms,
                        bathrooms           : bathrooms,
                        sqft                : sqft,
                        rent                : rent
                    }
                };
                var post = new postModel(postJSON);
                post.save(function (err, post) {
                    if (err) {
                        return res.render('msgs', {
                            msgs: "Error posting...",
                            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                        });
                    }
                    //Todo: render a better "post" page
                    return res.render('msgs', {
                        msgs: post,
                        user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                    });
                });
            }
            else {
                //Todo: handle error better
                console.log("could not get geolocation");
            }
        });
    }
}

module.exports = ContentHandler;
