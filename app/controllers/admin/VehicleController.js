const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Vehicle } = require("../../models/Vehicle")

const { auth } = require("../../middlewares/auth")
const { adminAccess } = require("../../middlewares/access")
const upload = require("../../middlewares/fileupload")

//localhost:3005/admin/vehicles
router.get("/", auth, adminAccess, (req,res) => {
    Vehicle.find()
        .then(vehicles => {
            res.send(vehicles)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/vehicles/:id
router.get("/:id", auth, adminAccess, (req,res) => {
    const id = req.params.id
    Vehicle.findOne({_id: id})
        .then(vehicle => {
            res.send(vehicle)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/vehicles
router.post("/", auth, adminAccess, upload.single("image"), (req,res) => {
    const { name, capacity, _length, _breadth, _height, image, price } = req.body
    const body = {
        name,
        capacity,
        price,
        image: req.file ? req.file.location || req.file.filename : image,
        dimension: {
            _length, _breadth, _height
        }
    }
    const vehicle = new Vehicle(body)
    vehicle.save()
        .then(vehicle => {
            res.send({success: vehicle})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/vehicles/:id
router.put("/:id", auth, adminAccess, upload.single("image"), (req,res) => {
    const id = req.params.id
    const { name, capacity, _length, _breadth, _height, image, price } = req.body
    const body = {
        name,
        capacity,
        price,
        image: req.file ? req.file.location || req.file.filename : image,
        dimension: {
            _length, _breadth, _height
        }
    }
    Vehicle.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'})
        .then(vehicle => {
            res.send({success: vehicle})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/vehicles/:id
router.delete("/:id", auth, adminAccess, (req,res) => {
    const id = req.params.id
    Vehicle.findByIdAndDelete(id)
        .then(vehicle => {
            res.send({success: "successfully deleted"})
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    adminVehicleRouter: router
}