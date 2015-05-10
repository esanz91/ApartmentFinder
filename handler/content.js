var PostModel = require('../models/post');

function ContentHandler () {
    "use strict";

    this.displayMain = function(req, res) {
        "use strict";
        return res.render('home', { title: 'Spotaru', user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }
    this.displaySearch = function(req, res) {
        "use strict";
        return res.render('search', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }
    this.displayPost = function(req, res) {
        "use strict";
        return res.render('post', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }
    this.handlePost = function(req, res) {
        "use strict";
        var location = req.body.location;
        var bedrooms = req.body.bedrooms;
        var bathrooms = req.body.bathrooms;
        var sqft = req.body.sqft;
        var price = req.body.price;
        var pets = req.body.pets;
        var amenities = req.body.amenities;

        $.ajax({
            url: "http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false",
            type: "POST",
            success: function(res){
                console.log(res.results[0].geometry.location.lat);
                console.log(res.results[0].geometry.location.lng);
            }
        });

        var postJSON = {
            aptDetails      : {
                location        : {
                    name        : location
                    /*,
                    longitude   : ,
                    latitude    :
                    */
                },
                bedrooms    : bedrooms,
                bathrooms   : bathrooms,
                sqft        : sqft,
                price       : price
            }
        };

        console.log(postJSON);
        var post = new PostModel(postJSON);

        post.save(function(err, post){
            if(err){
                console.log(err);
                return res.render('msgs', {msgs: "Error posting...", user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
                //return next(err);
            }
            return res.render('msgs', {msgs: postJSON.toString, user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
        })
    }
}

module.exports = ContentHandler;
