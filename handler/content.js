var request = require('request');
var listingModel = require('../models/listing');

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

    this.displayListing = function (req, res) {
        "use strict";
        return res.render('listing', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }

    this.handleListing = function (req, res) {
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
                var listingJSON = {
                    address: {
                        formatted_address   : data.results[0].formatted_address,
                        street_number       : queryGoogleComponentsByType("street_number", data.results[0].address_components),
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
                var listing = new listingModel(listingJSON);
                listing.save(function (err, listing) {
                    if (err) {
                        return res.render('msgs', {
                            msgs: "Error posting listing...",
                            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                        });
                    }
                    //Todo: render a better "listing" page
                    return res.render('msgs', {
                        msgs: listing,
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
