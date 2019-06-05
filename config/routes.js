const express = require("express")
const router = express.Router()

//user
const { userRouter } = require('../app/controllers/UserController')
const { contactRouter } = require('../app/controllers/ContactController')
router.use("/users", userRouter)
router.use("/users/contact", contactRouter)

//vendor
const { vendorRouter } = require('../app/controllers/vendor/VendorController')
const { vendorVehicleRouter } = require('../app/controllers/vendor/VehicleController')
router.use("/vendors", vendorRouter)
router.use("/vendors/vehicles", vendorVehicleRouter)

//admin
const { adminUserRouter } = require('../app/controllers/admin/UserController')
const { adminVehicleRouter } = require('../app/controllers/admin/VehicleController')
const { adminVendorRouter } = require('../app/controllers/admin/VendorController')
const { adminContactRouter } = require('../app/controllers/admin/ContactController')
router.use("/admin/users", adminUserRouter)
router.use("/admin/vehicles", adminVehicleRouter)
router.use("/admin/vendors", adminVendorRouter)
router.use("/admin/contacts", adminContactRouter)

//user
const { locationRouter } = require('../app/controllers/LocationController')
router.use("/location", locationRouter)

module.exports = {
    routes: router
}