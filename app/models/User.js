const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Schema = mongoose.Schema
const userSchema = new Schema({
    fullname: {
        type: String,
        minlength: [4, 'Fullname is short'],
        required: [true, 'Fullname is required']
    },
    mobile: {
        type: String,
        minlength: [10, 'Mobile is too short'],
        maxlength: [12, 'Mobile is too long'],
        required: [true, 'Mobile number is required'],
        unique: true
    },
    email: {
        type: String,
        unique: true,
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
    password: {
        type: String,
        minlength: [6, 'Password is too short'],
        maxlength: [128, 'Password is too long'],
        required: [true, 'Password is required']
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

userSchema.pre("save", function(next){
    const user = this
    if(user.passUpdate){
        encryptPassword = () => {
            return bcrypt.genSalt(10)
                .then(salt => {
                    return bcrypt.hash(user.password,salt)
                        .then(encPass => {
                            user.password = encPass
                            user.passUpdate = false
                        })
                })
        }
        setRole = () => {
            return User.countDocuments()
                .then(count => {
                    if(count == 0){
                        user.role = "admin"
                    }
                })
        }
        return Promise.all([encryptPassword(),setRole()])
            .then(values => {
                next()
            })
            .catch(err => {
                return Promise.reject(err.message)
            })
    }else{
        next()
    }    
})

userSchema.statics.findByCredentials = function(email_mobile,password){
    const User = this
    return User.findOne({$or:[{email: email_mobile},{mobile: email_mobile}]})
            .then(user => {
                if(!user){
                    return Promise.reject("invalid credentials")
                }
                else{
                    return bcrypt.compare(password,user.password)
                        .then(result => {
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
            .catch(err => {
                return Promise.reject(err)
            })
}

userSchema.statics.findByToken = function(token){
    const User = this
    let tokenData
    try{
        tokenData = jwt.verify(token,"truckit@123")
    }catch(err){
        return Promise.reject(err)
    }
    return User.findOne({
            _id: tokenData._id,
            "tokens.token": token
        })
}

userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
        _id: user.id,
        email: user.email,
        createdAt: Number(new Date())
    }
    const token = jwt.sign(tokenData,"truckit@123")
    user.tokens.push({
        token
    })
    return user.save()
        .then(user => {
            return Promise.resolve({
                id: user._id, 
                fullname: user.fullname, 
                role: user.role, 
                token,
                mobile: user.mobile,
                email: user.email,
                allowAccess: user.allowAccess
            })
        })
        .catch(err => {
            return Promise.reject(err)
        })
}

userSchema.methods.updatePassword = function(){
    const user = this
    return user.save()
        .then(user => {
            return Promise.resolve(user)
        })
        .catch(err => {
            return Promise.reject(err)
        })
}

const User = mongoose.model("User",userSchema)
module.exports = {
    User
}