var request = require('request');
var listingModel = require('../models/listing');

function queryGoogleComponentsByType(type, components) {
    return components.filter(function (item) {
        return item.types.filter(function (addressType) {
                return addressType == type;
            }).length > 0;
    }).map(function (item) {
        return item.long_name
    });
}

function addToQuery(query, category, minInput, maxInput){
    var mininput = null;
    var maxinput = null;

    // determine rent ranges
    if ((minInput && (maxInput === null)) ||    // minRent only
        (+minInput > +maxInput)){             // minRent is greater than maxRent
        console.log("set min " + category + " " + minInput + " only, bc...");
        console.log("max " + category + " is null?: " + (maxInput === null));
        console.log("min" + category +" > max" + category + "?: " + (minInput > maxInput));
        mininput = minInput;
    }
    else if (maxInput && (minInput === null)){ // maxRent only
        console.log("set max " + category + " " + maxInput + " only, bc...");
        console.log("min" + category + " is null?: " + (minInput === null));
        maxinput = maxInput;
    }

    // insert rent ranges to query
    if(mininput){
        console.log("set minrent as: " + mininput);
        var rentQuery =  { $gte: mininput};
        query[category] = rentQuery;
    }
    else if(maxinput) {
        console.log("set maxrent as: " + mininput);
        var rentQuery = {$lte: maxinput};
        query[category] = rentQuery;
    }
    else if (minInput && maxInput){
        console.log("set rent range");
        var rentQuery =  { $gte: minInput, $lte: maxInput };
        query[category] = rentQuery;
    }

    return query;
}

exports.readListings = function (req, res) {
    "use strict"

    var address = req.query.postalAddress || null;
    var minBedrooms = req.query.minBedrooms || null;
    var maxBedrooms = req.query.maxBedrooms || null;
    var minBathrooms = req.query.minBathrooms || null;
    var maxBathrooms = req.query.maxBathrooms || null;
    var sqft = req.query.sqft || null;
    var minRent = req.query.minRent || null;
    var maxRent = req.query.maxRent || null;

    var dogs = req.query.dogs || null;
    var cats = req.query.cats || null;
    var centralAir = req.query.centralAir || null;
    var dishwasher = req.query.dishwasher || null;
    var elevator = req.query.elevator || null;
    var gym =  req.query.gym || null;
    var pool = req.query.pool || null;
    var washerDryer = req.query.washerDryer || null;

    var query = {};

    query = addToQuery(query, "aptDetails.bedrooms", minBedrooms, maxBedrooms);
    query = addToQuery(query, "aptDetails.bathrooms", minBathrooms, maxBathrooms);
    query = addToQuery(query, "aptDetails.rent", minRent, maxRent);
    if(sqft !== null) {
        query["aptDetails.sqft"] = {$gte: sqft};
    }

    // print filters
    var filterLabels = ["dogs", "cats", "centralAir", "dishwasher", "elevator", "gym", "pool", "washerDryer"];
    var filterValues = [dogs, cats, centralAir, dishwasher, elevator, gym, pool, washerDryer];
    console.log("filterLabels w/null:\n" + filterLabels);
    console.log("filterValues w/null:\n" + filterValues);

    for(var i=0; i < filterValues.length; i++){
        if(filterValues[i] !== null){
            if (i <= 1) {
                var filterLabel = "extraDetails.pets." + filterLabels[i];
                var petsQuery = true;
                query[filterLabel] = petsQuery;

                console.log(filterLabel);
            }
            else {
                var filterLabel = "extraDetails.amenities." + filterLabels[i];
                var amenitiesQuery = true;
                query[filterLabel] = amenitiesQuery;
            }
        }
    }

    // print JSON query
    console.log("filtersJSON:\n" + JSON.stringify(query));

    // get google maps address type
    request.post("http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false", function (err, response, body) {
        if (!err && response.statusCode === 200) {
            var data = JSON.parse(body);
            var type = data.results[0].types[0];
            var addressTypeLabel = "address." + type;
            var addressTypeValue = queryGoogleComponentsByType(type, data.results[0].address_components)[0];
            query[addressTypeLabel] = addressTypeValue;

            console.log("query: " + JSON.stringify(query));

            listingModel.find(query ,function (err, listings) {

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
                    return res.json({msg: "match", listings: listings, focus: data.results[0].geometry.location});
                }
            });

        }
    });
}

exports.createListing = function (req, res) {
    "use strict";
    var address = req.body.postalAddress;
    var bedrooms = req.body.bedrooms;
    var bathrooms = req.body.bathrooms;
    var sqft = req.body.sqft;
    var rent = req.body.rent;
    var dogs = req.body.dogs || false;
    var cats = req.body.cats || false;
    var centralAir = req.body.centralAir || false;
    var dishwasher = req.body.dishwasher || false;
    var elevator = req.body.elevator || false;
    var gym = req.body.gym || false;
    var pool = req.body.pool || false;
    var washerDryer = req.body.washerDryer || false;

    console.log("ADDRESS:\n" + address);
    address = encodeURIComponent(address);
    console.log("ADDRESS ENCODED:\n" + address);

    request.post("http://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&sensor=false", function (err, response, body) {
        if (!err && response.statusCode === 200) {
            var data = JSON.parse(body);
            var listingJSON = {
                address: {
                    formatted_address: data.results[0].formatted_address,
                    street_number: queryGoogleComponentsByType("street_number", data.results[0].address_components),
                    route: queryGoogleComponentsByType("route", data.results[0].address_components),
                    neighborhood: queryGoogleComponentsByType("neighborhood", data.results[0].address_components),
                    locality: queryGoogleComponentsByType("locality", data.results[0].address_components),
                    administrative_area_level_2: queryGoogleComponentsByType("administrative_area_level_2", data.results[0].address_components),
                    administrative_area_level_1: queryGoogleComponentsByType("administrative_area_level_1", data.results[0].address_components),
                    postal_code: queryGoogleComponentsByType("postal_code", data.results[0].address_components),
                    country: queryGoogleComponentsByType("country", data.results[0].address_components),
                    longitude: data.results[0].geometry.location.lng,
                    latitude: data.results[0].geometry.location.lat
                },
                aptDetails: {
                    bedrooms: bedrooms,
                    bathrooms: bathrooms,
                    sqft: sqft,
                    rent: rent
                },
                extraDetails: {
                    pets: {
                        dogs: dogs,
                        cats: cats
                    },
                    amenities: {
                        centralAir: centralAir,
                        dishwasher: dishwasher,
                        elevator: elevator,
                        gym: gym,
                        pool: pool,
                        washerDryer: washerDryer
                    }
                },
                creator: req.session.username
            };

            console.log("ListingJSON:\n" + listingJSON);

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
                    msgs: "Thank you for posting!",
                    user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                });
            });
        }
        else {
            //Todo: handle error better
            res.render('msgs', {
                msgs: "could not get geolocation",
                user: {
                    loggedout: !res.locals.loggedin,
                    loggedin: res.locals.loggedin
                }
            });
            console.log("could not get geolocation");
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
            listingModel.find().where(fieldName, value).select('').lean().exec(function (err, listings) {

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