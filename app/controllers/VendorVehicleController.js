const express=require('express')
const router=express.Router()
const { VendorVehicle }= require('../models/VendorVehicle') 
const { authenticateUser } = require('../middlewares/auth')

//localhost:3000/vendorVehicle
router.get('/',authenticateUser,function(req,res){
    VendorVehicle.find({
        user: req.user._id
    })
        .then(function (vendorVehicles) {
            res.send(vendorVehicles)
        })
        .catch(function (err) {
            res.send(err)
        })  
})

module.exports={
    vendorVehicleRouter: router
}