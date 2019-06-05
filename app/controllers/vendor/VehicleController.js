const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Vendor } = require("../../models/Vendor")
const { Vehicle } = require("../../models/Vehicle")

const { auth } = require("../../middlewares/auth")
const { vendorAccess } = require("../../middlewares/access")

//localhost:3005/vendors/vehicles/all
router.get("/all", auth, vendorAccess, (req,res) => {
    Vehicle.find()
        .then(vehicles => {
            res.send(vehicles)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/vendors/vehicles
router.get("/", auth, vendorAccess, (req,res) => {
    Vendor.findOne({user: req.user._id})
        .populate({
            path: 'vehicles.vehicle',
            model: 'Vehicle'
        })
        .then(vendor => {
            res.send(vendor.vehicles)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/vendors/vehicles
router.post("/", auth, vendorAccess, (req,res) => {
    const user = req.user._id
    const { vehicle, number_plate, pricing_intercity_km, pricing_intercity_min, pricing_intracity_km, pricing_intracity_min, helper_rate } = req.body
    const body = {
        vehicle,
        number_plate,
        pricing: {
            inter_city: {
                ratePerKm: pricing_intercity_km,
                ratePerMin: pricing_intercity_min
            },
            intra_city: {
                ratePerKm: pricing_intracity_km,
                ratePerMin: pricing_intracity_min
            }
        },
        helper_rate
    }
    Vendor.findOneAndUpdate({user},{
            $push: {
                vehicles: body
            }
        }, {new: true, runValidators: true})
        .then(vendor => {
            res.send({success: vendor.vehicles})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/vendors/vehicles/:id
router.put("/:id", auth, vendorAccess, (req,res) => {
    const user = req.user._id
    const id = req.params.id
    const { vehicle, number_plate, pricing_intercity_km, pricing_intercity_min, pricing_intracity_km, pricing_intracity_min, helper_rate } = req.body
    const body = {
        vehicle,
        number_plate,
        pricing: {
            inter_city: {
                ratePerKm: pricing_intercity_km,
                ratePerMin: pricing_intercity_min
            },
            intra_city: {
                ratePerKm: pricing_intracity_km,
                ratePerMin: pricing_intracity_min
            }
        },
        helper_rate
    }
    Vendor.findOneAndUpdate({
            user,
            "vehicles._id": id
        },{
            $set: {
                "vehicles.$": body
            }
        }, {new: true, runValidators: true})
        .then(vendor => {
            res.send({success: vendor.vehicles})
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/vendors/vehicles/:id
router.delete("/:id", auth, vendorAccess, (req,res) => {
    const user = req.user._id
    const id = req.params.id
    Vendor.findOneAndUpdate({
            user,
            "vehicles._id": id
        },{ 
            $pull: {
                "vehicles": {
                    _id: id
                }
            } 
        }, {new: true, runValidators: true})
        .then(vendor => {
            res.send({success: vendor.vehicles})
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    vendorVehicleRouter: router
}