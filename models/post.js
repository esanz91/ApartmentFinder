var mongoose = require('mongoose');

// post schema : schema maps to a MongoDB collection
var postSchema = new mongoose.Schema({
        address             : {
            formatted_address   : {type: String, required: true},
            route               : {type: String},           // street
            neighborhood        : {type: String},
            locality            : {type: String},           // city
            administrative_area_level_2 : {type: String},   // county
            administrative_area_level_1 : {type: String},   // state
            postal_code         : {type: String},           // zip code
            country             : {type: String},
            longitude           : {type: Number, required: true},
            latitude            : {type: Number, required: true}
        },
        aptDetails          : {
            bedrooms            : {type: Number, required: true},
            bathrooms           : {type: Number, required: true},
            sqft                : {type: Number},
            rent                : {type: Number, required: true}
        },
        extraDetails        : {
            pets                : {type: Boolean},
            amenities           : {
                dishwasher          : {type: Boolean},
                gym                 : {type: Boolean},
                elevator            : {type: Boolean}
            }
        },
        created: {type: Date, default: Date.now}
    },
    {versionKey: '_MongooseVersionKey'});

// create and export post model
module.exports = mongoose.model('Post', postSchema);