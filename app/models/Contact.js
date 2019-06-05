const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const validator = require("validator")

const Schema = mongoose.Schema
const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: value => {
                return validator.isEmail(value)
            },
            message: () => {
                return "Email is invalid"
            }
        }
    },
    mobile: {
        type: Number,
        min: [1000000000, 'Mobile number is short'],
        max: [9999999999, 'Mobile number is long'],
        required: [true, 'Mobile number is required']
    },
    message: {
        type: String,
        maxlength: [1000, "Message is too long"]
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
})

contactSchema.plugin(uniqueValidator, { message: '{PATH} already exists' })

const Contact = mongoose.model("Contact",contactSchema)
module.exports = {
    Contact
}