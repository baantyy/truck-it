const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const validator = require("validator")

const Schema = mongoose.Schema
const vehicleSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    dimension: {
        _length: {
            type: String,
            required: [true, 'Length is required']
        },
        _breadth:  {
            type: String,
            required: [true, 'Breadth is required']
        },
        _height:  {
            type: String,
            required: [true, 'Height is required']
        }
    },
    capacity:  {
        type: String,
        required: [true, 'Capacity is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    }
})

vehicleSchema.plugin(uniqueValidator, { message: '{PATH} already exists' })

const Vehicle = mongoose.model("Vehicle",vehicleSchema)
module.exports = {
    Vehicle
}