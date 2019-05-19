const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken") 

const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        minlength: [4, 'name is short'],
        required: [true, 'name is required']
    },
    mobile: {
        type: String,
        maxlength: [12, 'mobile number is long'],
        minlength: [10, 'mobile number is short'],
        required: [true, 'mobile number is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is required'],
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return "email is invalid"
            }
        }
    },
    password: {
        type: String,
        minlength: [6, 'password is too short'],
        maxlength: [128, 'password is too long'],
        required: [true, 'password is required']
    },
    passUpdate: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    role: {
        type: String,
        default: 'customer'
    },
    allowAccess: {
        type: Boolean,
        default: true
    }
})

userSchema.plugin(uniqueValidator, { message: '{PATH} already exists' })

const User = mongoose.model("User",userSchema)
module.exports = {
    User
}