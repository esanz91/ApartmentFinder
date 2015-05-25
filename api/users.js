var request = require('request');
var userModel = require('../models/user');

exports.readUserFavorites= function(){
    var listingID = req.body.listingID;

    userModel.find().where("listings.favorites", listingID).select('').lean().exec(function(err, favorite) {
        // error
        if (err) {
            return res.send({msg: "error"});
        }
        // favorite not found
        if ((!favorite) || (null === favorite) || (favorite.length == 0)) {
            return res.send({msg: "no matches"});
        }
        // favorite found
        if (favorite) {

        }
    });
}