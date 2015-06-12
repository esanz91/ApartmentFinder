var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// user schema : schema maps to a MongoDB collection
var userSchema = new mongoose.Schema({
    local           : {
        name        : {
            firstName   : {type: String, required: true},
            lastName    : {type: String, required: true}
        },
        username    : {type: String, unique: true, required: true},
        email       : {type: String, unique: true, required: true},
        password    : {type: String, required: true}
    },
    /*
    facebook        : {
        id          : {type: String, default: "", unique: true, required: true},
        token       : {type: String, default: "", unique: true, required: true},
        email       : {type: String, default: "", unique: true, required: true},
        name        : {
            firstName: {type: String, default: "", required: true},
            lastName: {type: String, default: "", required: true}
        },
        required: false
    },
    */
    listings        : {
        favorites   : [{ type : mongoose.Schema.Types.ObjectId, ref: 'Listing', default: [], unique: true}]
    },
    created: {type: Date, default: Date.now}
},
    {versionKey: '_MongooseVersionKey'});

// methods
// generating a hash (for registration)
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid (for login)
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create and export user model
module.exports = mongoose.model('User', userSchema);