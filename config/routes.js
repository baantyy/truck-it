const express = require("express")
const router = express.Router()

//user
const { userRouter } = require('../app/controllers/UserController')
const { contactRouter } = require('../app/controllers/ContactController')
const { vehicleRouter } = require('../app/controllers/VehicleController')
const { bookingRouter } = require('../app/controllers/customer/BookingController')
router.use("/users", userRouter)
router.use("/users/contact", contactRouter)
router.use("/users/vehicles", vehicleRouter)
router.use("/users/bookings", bookingRouter)

//vendor
const { vendorRouter } = require('../app/controllers/vendor/VendorController')
const { vendorVehicleRouter } = require('../app/controllers/vendor/VehicleController')
const { vendorBookingRouter } = require('../app/controllers/vendor/BookingController')
router.use("/vendors", vendorRouter)
router.use("/vendors/vehicles", vendorVehicleRouter)
router.use("/vendors/bookings", vendorBookingRouter)

//admin
const { adminUserRouter } = require('../app/controllers/admin/UserController')
const { adminVehicleRouter } = require('../app/controllers/admin/VehicleController')
const { adminVendorRouter } = require('../app/controllers/admin/VendorController')
const { adminContactRouter } = require('../app/controllers/admin/ContactController')
const { adminBookingRouter } = require('../app/controllers/admin/BookingController')
router.use("/admin/users", adminUserRouter)
router.use("/admin/vehicles", adminVehicleRouter)
router.use("/admin/vendors", adminVendorRouter)
router.use("/admin/contacts", adminContactRouter)
router.use("/admin/bookings", adminBookingRouter)

//user
const { locationRouter } = require('../app/controllers/LocationController')
router.use("/location", locationRouter)

module.exports = {
    routes: router
}