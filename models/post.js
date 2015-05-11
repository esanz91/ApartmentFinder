var mongoose = require('mongoose');

// post schema : schema maps to a MongoDB collection
var postSchema = new mongoose.Schema({
        aptDetails          : {
            address        : {
                postal      : {type: String, required: true},
                longitude   : {type: Number, required: true},
                latitude    : {type: Number, required: true}
            },
            bedrooms        : {type: Number, required: true},
            bathrooms       : {type: Number, required: true},
            sqft            : {type: Number},
            price           : {type: Number, required: true}
        },
        extraDetails        : {
            pets            : {type: Boolean},
            amenities       : {
                dishwasher  : {type: Boolean},
                gym         : {type: Boolean},
                elevator    : {type: Boolean}
            }
        },
        created: {type: Date, default: Date.now}
    },
    {versionKey: '_MongooseVersionKey'});

// create and export post model
module.exports = mongoose.model('Post', postSchema);