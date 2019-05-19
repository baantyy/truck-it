const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { User } = require("../models/User") 
const { authenticateUser } = require('../middlewares/access') 
const { authorizeUser } = require('../middlewares/auth') 


const { userAuth } = require("../middlewares/auth")

// admin route
router.get('/', authenticateUser, authorizeUser, function(req, res){
    User.find()
        .then(function(users){
            res.send(users) 
        })
        .catch(function(err){
            res.send(err) 
        })
} ) 


// localhost:3000/users/login 
router.post('/login', function (req, res) {
    const body = req.body
    User.findByCredentials(body.email, body.password)
        .then(function (user) {
            return user.generateToken()
        })
        .then(function (token) {
            res.send({ token })
        })
        .catch(function (err) {
            res.send(err)
        })

})


// localhost:3000/users/logout
router.delete('/logout', authenticateUser, function (req, res) {
    console.log('request')
    const { user, token } = req
    User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token } } })
        .then(function () {
            res.send({ notice: 'successfully logged out' })
        })
        .catch(function (err) {
            res.send(err)
        })
})



module.exports = {
    userRouter: router
}