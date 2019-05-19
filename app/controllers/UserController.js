const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { User } = require("../models/User")

const { userAuth } = require("../middlewares/auth")

//localhost:3005/register
router.post("/register",function(req,res){
    const body= _.pick(req.body,["name","mobile","email","role","password"]) 
    const whitelist = ["driver", "vendor", "user"]
    if(whitelist.includes(body.role)) {
        const user= new User(body)
        user.save()
            .then(function(user){
                res.send({
                    user,
                    notice: "Successfully registered"
                })
            })
    
            .catch(function(err){
                res.send({
                    err,
                    notice:"Registration failed"
                })
            })
    } else {
        res.json({
            msg: 'invalid data'
        })
    }
    
})

//localhost:3005/login
router.post("/login",function(req,res){
    const body= _.pick(req.body,["mobile_email","password"])
    User.findByCredentials(body.mobile_email,body.password)
        .then(function(user){
            return user.generateToken()
        })
        .then(function(user){
            res.send(user)
        })
        .catch(function(errors){
            res.send({errors})
        })
})



module.exports = {
    userRouter: router
}