const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Booking } = require("../../models/Booking")

const { auth } = require("../../middlewares/auth")
const { vendorAccess } = require("../../middlewares/access")

//localhost:3005/vendor/bookings
router.get("/", auth, vendorAccess, (req, res) => {
    Booking.find({vendor: req.user._id})
           .populate("user")
           .sort({ bookedAt: -1 })
        .then(bookings => {
            res.send(bookings)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/vendor/bookings/:id
router.get("/:id", auth, vendorAccess, (req, res) => {
    const { id } = req.params
    Booking.findOne({vendor: req.user._id, _id: id})
           .populate("truck")
           .populate("user")
        .then(booking => {
            res.send(booking)
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    vendorBookingRouter: router
}