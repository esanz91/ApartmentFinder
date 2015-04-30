function check_auth(req, res, next) {

    // user not logged in, redirect them to login page
    if(!req.session.login) {
        res.redirect("../login");
        return;
    }

    // user logged in, call next()
    next();
}

module.exports = check_auth;