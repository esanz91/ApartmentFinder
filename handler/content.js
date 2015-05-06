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

        return res.render('msgs', {msgs: "you posted!"});
    }
}

module.exports = ContentHandler;
