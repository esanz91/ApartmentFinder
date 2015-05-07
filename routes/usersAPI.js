var express = require('express');
var router = express.Router();
var userHandler = require('../handler/users');

router.get('/', function (req, res) {
    res.send("api");
});

router.get('/:username', userHandler.isValidUsername);

router.get('/validate/:username', function (req, res) {
    var username = request.params.username;
    res.send("validating");
    //function to validate user
});

module.exports = router;