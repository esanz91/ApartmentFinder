var request = require('request');
var PostModel = require('../models/post');

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

    this.displayPost = function (req, res) {
        "use strict";
        return res.render('post', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
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
                    aptDetails: {
                        address: {
                            postal: address,
                            longitude: data.results[0].geometry.location.lng,
                            latitude: data.results[0].geometry.location.lat
                        },
                        bedrooms: bedrooms,
                        bathrooms: bathrooms,
                        sqft: sqft,
                        rent: rent
                    }
                };
                var post = new PostModel(postJSON);

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
            else{
                //Todo: handle error better
                console.log("could not get geolocation");
            }
        });
    }
}

module.exports = ContentHandler;
