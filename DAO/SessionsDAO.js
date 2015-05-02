var crypto = require('crypto');

function SessionsDAO(db) {
    "use strict";

    if (false === (this instanceof SessionsDAO)) {
        console.log('Warning: SessionsDAO constructor called without "new" operator');
        return new SessionsDAO(db);
    }

    var sessions = db.collection("sessions");

    this.startSession = function(username, callback) {
        "use strict";
    }

    this.endSession = function(session_id, callback) {
        "use strict";

    }
    this.getUsername = function(session_id, callback) {
        "use strict";

    }

}

module.exports.SessionsDAO = SessionsDAO;
