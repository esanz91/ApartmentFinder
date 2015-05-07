var express = require('express');
var router = express.Router();
var userHandler = require('../handler/users');

router.get('/', function (req, res) {
    res.send("api");
});

router.get('/name/:name', userHandler.isValidName);

router.get('/username/:username', userHandler.isValidUsername);

module.exports = router;