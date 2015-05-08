var express = require('express');
var router = express.Router();
var userHandler = require('../handler/users');

router.get('/', function (req, res) {
    res.send("validation routes");
});

router.get('/username/:username', userHandler.isValidUsername);

router.get('/email/:email', userHandler.isValidEmail);

module.exports = router;