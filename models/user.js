var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// user schema : schema maps to a MongoDB collection
var userSchema = new mongoose.Schema({
    local           : {
        name        : {
            firstName   : {type: String},
            lastName    : {type: String}
        },
        email       : {type: String, unique: true},
        password    : {type: String}
    },
    facebook        : {
        id          : {type: String, unique: true},
        token       : {type: String},
        email       : {type: String, unique: true},
        name        : {
            firstName: {type: String},
            lastName: {type: String}
        }
    }
});

// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// export user model
module.exports = mongoose.model('User', userSchema);