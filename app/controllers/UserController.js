const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { User } = require("../models/User")

const { auth } = require("../middlewares/auth")

//localhost:3005/users/register
router.post("/register", (req,res) => {
    const body = _.pick(req.body,["fullname","mobile","email","password","role"])
    body.passUpdate = true
    const availableRoles = ['customer', 'vendor']
    !availableRoles.includes(body.role) && delete body.role
    const user = new User(body)
    user.save()
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/users/login
router.post("/login", (req,res) => {
    const body = _.pick(req.body,["email_mobile","password"])
    User.findByCredentials(body.email_mobile,body.password)
        .then(user => {
            return user.generateToken()
        })
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.send({error: err})
        })
})

//localhost:3005/users/logout
router.delete("/logout", auth, (req,res) => {
    const { user, token } = req
    User.findByIdAndUpdate(user._id,{ tokens: [] })
        .then(() => {
            res.send({success: "successfully logged out"})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/users/token/:id
router.get("/token/:id", (req,res) => {
    const token = req.params.id
    User.findOne({"tokens.token": token})
        .then(user => {
            res.send({
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
            res.send(err)
        })
})


//localhost:3005/users/update_profile
router.put("/update_profile", auth, (req,res) => {
    const id = req.user._id
    const body = _.pick(req.body,["fullname","mobile","email","password"])
    body.password.length > 0 ? body.passUpdate = true : delete body.password
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'})
        .then(user => {
            return body.password ? user.updatePassword() : user
        })
        .then(user => {
            res.send({success: user})
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    userRouter: router
}