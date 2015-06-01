var validator = require('validator');
var request = require('request');
var userModel = require('../models/user');

exports.isValidUsername = function (req, res) {
    "use strict";

    var username = validator.trim(req.params.username);
    console.log(username);

    // check if alphanumeric
    if (!validator.isAlphanumeric(username)) {
        return res.send("username not alphanumeric");
    }

    //check if exists
    userModel.findOne({'local.username': username}, 'local.username', function (err, user) {

        // error
        if (err) {
            return res.send(err);
        }
        // username available
        if (!user) {
            return res.send("username available");
        }
        // username found
        if (user) {
            return res.send("username unavailable");
        }
    });
};

exports.isValidEmail = function (req, res) {
    "use strict";

    // trim name
    var email = validator.trim(req.params.email);
    console.log(email);

    // check if email
    if (!validator.isEmail(email)) {
        return res.send("no email format");
    }

    // check if exists
    userModel.findOne({'local.email': email}, 'local.email', function (err, user) {
        // error
        if (err) {
            return res.send(response);
        }
        // email not on file
        if (!user) {
            return res.send("email okay");
        }
        // email on file
        if (user) {
            return res.send("email on file");
        }
    });
}

exports.readUserFavorites = function(req, res){
    //console.log("req HEADERS:\n" + req.headers);
    //console.log("responseCode: " + res.statusCode);

    userModel.find({"local.username": req.session.username, "listings.favorites": {$exists: true}}, {"listings.favorites": 1, "_id": 0}, function(err, userFavorites) {
        // error
        if (err) {
            return res.send({msg: "error"});
        }
        // favorite not found
        if ((!userFavorites) || (null === userFavorites) || (userFavorites.length == 0)) {
            return res.send({msg: "no matches"});
        }
        // favorite found
        if (userFavorites) {
            console.log("listings.favorites:\n" + userFavorites[0].listings.favorites);
            return res.send({msg: "match", favorites: userFavorites[0].listings.favorites});
        }
    });
}

exports.deleteUserFavoritesByListingId = function (req, res) {
    var listingID = req.params.listingID;
    var query = {'local.username': req.session.username};
    var update = {'$pull': {'listings.favorites': listingID}};

    userModel.update(query, update, function (err, numAffected) {
        // error
        if (err) {
            return res.send({msg: "error", error: err});
        }

        // not deleted
        if (numAffected <= 0) {
            return res.send({msg: "not deleted", numAffected: numAffected});
        }

        // deleted
        if (numAffected > 0) {
            return res.send({msg: "deleted", numAffected: numAffected});
        }
    });
}

exports.updateUserFavoritesByListingId = function (req, res) {
    var listingID = req.params.listingID;
    var conditions = {'local.username': req.session.username, 'listings.favorites': {$ne: listingID}};
    var update = {$push: {'listings.favorites': listingID}};

    userModel.update(conditions, update, function (err, numAffected) {
        // error
        if (err) {
            return res.send({msg: "error"});
        }
        // user not found
        if (numAffected <= 0) {
            return res.send({msg: "no matches"});
        }
        // user found
        if (numAffected) {
            return res.send({msg: "match"});
        }
    });
}

exports.getUsername = function(req, res){
    if(req.session.username){
        console.log("userModel/getUsername: " + req.session.username); //returns henree
        res.send({msg: "found", username: req.session.username});
    }
    else{
        res.send({msg: "not found", username: null});
    }
}

