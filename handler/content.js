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

        return res.render('msgs', {msgs: "you posted!"});
    }
}

module.exports = ContentHandler;
