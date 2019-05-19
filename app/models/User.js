const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Vender = require("./Vendor")

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
        required: [true, 'mobile number is required'],
        unique: "true"
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
        default: "customer"
    },
    allowAccess: {
        type: Boolean,
        default: true
    },
})

userSchema.plugin(uniqueValidator, { message: '{PATH} already exists' })

//pre hooks - before saving
userSchema.pre("save",function(next){
    const user = this
    if(user.isNew){
        function encryptPassword(){
            return bcrypt.genSalt(10)
                .then(function(salt){
                    return bcrypt.hash(user.password,salt)
                    .then(function(encPass){
                        user.password= encPass
                    })
                })
        }
        function setRole(){
            return User.countDocuments()
                .then(function(count){
                    if(count == 0){
                        user.role = "admin"
                    }
                })
        }
        return Promise.all([encryptPassword(),setRole()])
            .then(function(values){
                next()
            })
            .catch(function(err){
                return Promise.reject(err.message)
            })
    }else {
        next()
    }
})

//static methods
userSchema.statics.findByCredentials = function(mobile_email,password) {
    const User = this
    return User.findOne({$or:[{mobile: mobile_email},{email: mobile_email}]})
            .then(function(user){
                if(!user){
                    return Promise.reject("invalid credentials")
                }
                else{
                    return bcrypt.compare(password,user.password)
                        .then(function(result){
                            if(!result){
                                return Promise.reject("invalid credentials")
                            }else{                                
                                if(user.allowAccess){
                                    return Promise.resolve(user)
                                }else{
                                    return Promise.reject("access denied")
                                }
                            }
                        })
                }                
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

//static method
userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData 
    try{
        tokenData = jwt.verify(token,"jwt@123")
    }catch(err){
        return Promise.reject(err)
    }
    return User.findOne({
        _id: tokenData._id,
        "tokens.token" : token
    })
}

//instance methods
userSchema.methods.generateToken = function() {
    const user = this
    const tokenData = {
        _id: user._id,
        username: user.username,
        createdAt: Number(new Date())
    }
    const token = jwt.sign(tokenData,"jwt@123")
    user.tokens.push({
        token
    })
    return user.save()
    .then(function(user){
        return Promise.resolve({name: user.name,mobile: user.mobile,email: user.email, id: user._id, tokens: user.tokens,role: user.role})
    })
    .catch(function(err){
        return Promise.reject(err)
    })
}

const User = mongoose.model("User",userSchema)
module.exports = {
    User
}