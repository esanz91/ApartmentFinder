function SessionDAO(db) {
    "use strict";

    if (false === (this instanceof SessionDAO)) {
        return new SessionDAO(db);
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
        if(!session_id){
            return callback(new Error("Session is not set"), null);
        }

        sessions.findOne({'_id':session_id}, function(err,session){
            "use strict";
            if(err){
                return callback(err, null);
            }
            if(!session){
                return callback(new Error("Session: " + session + " does not exist"), null);
            }
            callback(null, session.username);
        });
    }

}

module.exports.SessionDAO = SessionDAO;
