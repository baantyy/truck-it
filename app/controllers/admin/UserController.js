const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { User } = require("../../models/User")

const { auth } = require("../../middlewares/auth")
const { adminAccess } = require("../../middlewares/access")

//localhost:3005/admin/users
router.get("/", auth, adminAccess, (req,res) => {
    User.find()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/users/:id
router.get("/:id", auth, adminAccess, (req,res) => {
    const id = req.params.id
    User.findOne({_id: id})
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/users/:id
router.put("/:id", auth, adminAccess, (req,res) => {
    const id = req.params.id
    const body = _.pick(req.body,['fullname','email','mobile','allowAccess','password','role'])
    !['vendor','admin','customer'].includes(body.role) && delete body.role
    body.passUpdate = body.password.length > 5 ? true : false
    body.password.length <= 5 && delete body.password 
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'})
        .then(user => {
            return user.updatePassword()
        })
        .then(user => {
            res.send({success: user})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/users/:id
router.delete("/:id", auth, adminAccess, (req,res) => {
    const id = req.params.id
    User.findByIdAndDelete(id)
        .then(user => {
            if(user){
                res.send({ success: "successfully deleted" })
            }else{
                res.status("404").send({ failed: "user not found" })
            }
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    adminUserRouter: router
}