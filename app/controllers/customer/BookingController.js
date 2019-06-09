const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Booking } = require("../../models/Booking")

const { auth } = require("../../middlewares/auth")
const { customerAccess } = require("../../middlewares/access")

//localhost:3005/users/bookings
router.get("/", auth, customerAccess, (req, res) => {
    const { user } = req
    Booking.find({user}).sort({ bookedAt: -1 })
        .then(bookings => {
            res.send(bookings)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/users/bookings
router.post("/", auth, customerAccess, (req, res) => {
    const body = _.pick(req.body,["pickup", "dropoff", "pickup_date", "volume", "distance", "duration", "truck", "amount"])
    body.user = req.user
    const booking = new Booking(body)
    booking.save()
        .then(booking => {
            res.send({booking})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/users/bookings/:id
router.put("/:id", auth, customerAccess, (req, res) => {
    const body = _.pick(req.body,["distance", "duration", "amount"])
    const id = req.params.id
    Booking.findOneAndUpdate({user: req.user._id, _id: id}, body, {new: true, runValidators: true})
        .then(booking => {
            res.send({booking})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/users/bookings/:id
router.get("/:id", auth, customerAccess, (req, res) => {
    const { user } = req
    const { id } = req.params
    Booking.findOne({user, _id: id}).populate("truck")
        .then(booking => {
            res.send(booking)
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    bookingRouter: router
}