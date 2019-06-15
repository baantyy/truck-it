const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const validator = require("validator")

const Schema = mongoose.Schema
const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    bookedAt: {
        type: Date,
        default: Date.now
    },
    pickup: {
        type: String,
        required: [true, "Pickup location is required"]
    },
    dropoff: {
        type: String,
        required: [true, "Dropoff location is required"]
    },
    pickup_date: {
        type: Date,
        required: [true, "Pickup date is required"]
    },
    volume: {
        type: String,
        required: [true, "Volume is required"]
    },
    truck: {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
        required: [true, "Truck is required"]
    },
    distance: {
        text: String,
        value: Number
    },
    duration:  {
        text: String,
        value: Number
    },
    amount: Number,
    status: {
        type: Boolean,
        default: true
    }
})

bookingSchema.plugin(uniqueValidator, { message: '{PATH} already exists' })

const Booking = mongoose.model("Booking", bookingSchema)
module.exports = {
    Booking
}