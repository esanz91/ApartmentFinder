var mongoose = require('mongoose');

// listing schema : schema maps to a MongoDB collection
var listingSchema = new mongoose.Schema({
        address             : {
            formatted_address   : {type: String, required: true},
            street_number       : {type: String},           // street number
            route               : {type: String},           // street
            neighborhood        : {type: String},
            locality            : {type: String},           // city
            administrative_area_level_2 : {type: String},   // county
            administrative_area_level_1 : {type: String},   // state
            postal_code         : {type: String},           // zip code
            country             : {type: String},
            longitude           : {type: Number, required: true},
            latitude            : {type: Number, required: true},
            privateAddress      : {type: Boolean}           // display exact address?
        },
        aptDetails          : {
            bedrooms            : {type: Number, required: true},
            bathrooms           : {type: Number, required: true},
            sqft                : {type: Number},
            rent                : {type: Number, required: true}
        },
        extraDetails        : {
            pets                : {
                dogs                : {type: Boolean, default: false},
                cats                : {type: Boolean, default: false}
            },
            amenities           : {
                centralAir          : {type: Boolean, default: false},
                dishwasher          : {type: Boolean, default: false},
                elevator            : {type: Boolean, default: false},
                gym                 : {type: Boolean, default: false},
                pool                : {type: Boolean, default: false},
                washerDryer         : {type: Boolean, default: false}
            }
        },
        creator: {type: String, required: true},
        created: {type: Date, default: Date.now}
    },
    {versionKey: '_MongooseVersionKey'});

// create and export listing model
module.exports = mongoose.model('Listing', listingSchema);