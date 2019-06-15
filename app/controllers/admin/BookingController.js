const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Booking } = require("../../models/Booking")

const { auth } = require("../../middlewares/auth")
const { adminAccess } = require("../../middlewares/access")

//localhost:3005/admin/bookings
router.get("/", auth, adminAccess, (req, res) => {
    Booking.find()
           .populate("user")
           .populate("vendor")
           .sort({ bookedAt: -1 })
        .then(bookings => {
            res.send(bookings)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/bookings/:id
router.put("/:id", auth, adminAccess, (req, res) => {
    const body = _.pick(req.body,["status", "vendor"])
    body.vendor === null && delete body.vendor
    const id = req.params.id
    Booking.findByIdAndUpdate(id, body, {new: true, runValidators: true})
        .then(booking => {
            res.send({booking})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/bookings/:id
router.get("/:id", auth, adminAccess, (req, res) => {
    const { id } = req.params
    Booking.findOne({_id: id})
           .populate("truck")
           .populate("vendor")
           .populate("user")
        .then(booking => {
            res.send(booking)
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    adminBookingRouter: router
}