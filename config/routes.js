const express = require("express")
const router = express.Router()

const { userRouter } = require('../app/controllers/UserController')
const { vendorVehicleRouter } =require('../app/controllers/VendorVehicleController')


router.use("/users", userRouter)
router.use("/vendorVehicle",vendorVehicleRouter)   

module.exports = {
    routes: router
} 