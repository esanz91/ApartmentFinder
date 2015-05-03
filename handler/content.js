function ContentHandler (db) {
    "use strict";

    this.displayMain = function(req, res) {
        "use strict";
        return res.render('home', { title: 'Spotaru' });
    }
    this.displaySearch = function(req, res) {
        "use strict";
        return res.render('search', {
            //title: 'Spotaru'
        });
    }
    this.displayPost = function(req, res) {
        "use strict";
        return res.render('post', {
            //title: 'Spotaru'
        });
    }
    this.displaySignup = function(req, res) {
        "use strict";
        return res.render('signup', { msg: 'ERROR' });
    }
    this.displayLogin = function(req, res) {
        "use strict";
        return res.render('login', {
            //title: 'Spotaru'
        });
    }
    this.displayProfile = function(re, res){
        "use strict"
        return res.send("Profile");
    }
}

module.exports = ContentHandler;
