var PostModel = require('../models/post');

function ContentHandler () {
    "use strict";

    this.displayMain = function(req, res) {
        "use strict";
        return res.render('home', { title: 'Spotaru' });
    }
    this.displaySearch = function(req, res) {
        "use strict";
        return res.render('search');
    }
    this.displayPost = function(req, res) {
        "use strict";
        return res.render('post');
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

        var postJSON = {
            aptDetails      : {
                location    : location,
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
                return res.render('msgs', {msgs: "Error posting..."});
                //return next(err);
            }
            return res.render('msgs', {msgs: postJSON.toString});
        })
    }
}

module.exports = ContentHandler;
