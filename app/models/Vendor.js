const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const validator = require("validator")

const Schema = mongoose.Schema
const vendorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    address: {
        full: String,
        pincode: String
    },
    payment: {
        bank_account: {
            number: String,
            ifsc: String
        }
    },
    document: {
        pan: String,
        aadhar: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    reviews: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        feedback: {
            type: String,
            maxlength: 1000
        }
    }],
    vehicles: [{
        vehicle: {
            type: Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: [true, 'Vehicle is required']
        },
        number_plate: {
            type: String,
            required: [true, 'Number plate is required']
        },
        pricing: {
            inter_city: {
                ratePerKm: {
                    type: Number,
                    required: [true, 'Intercity rate is required']
                },
                ratePerMin: {
                    type: Number,
                    required: [true, 'Intercity rate is required']
                }
            },
            intra_city: {
                ratePerKm: {
                    type: Number,
                    required: [true, 'Intracity rate is required']
                },
                ratePerMin: {
                    type: Number,
                    required: [true, 'Intracity rate is required']
                }
            }
        },
        helper_rate: {
            type: Number,
            required: [true, 'Helper rate is required']
        }
    }]
})

vendorSchema.plugin(uniqueValidator, { message: '{PATH} already exists' })

const Vendor = mongoose.model("Vendor",vendorSchema)
module.exports = {
    Vendor
}