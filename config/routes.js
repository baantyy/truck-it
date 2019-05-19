const express = require("express")
const router = express.Router()

const { vendorAdminController }= require('../app/controllers/admin/VendorController')

const { userRouter } = require('../app/controllers/UserController')
const { vendorRouter } = require('../app/controllers/VendorController')


router.use("/admin/vendor", vendorAdminController )

router.use("/", userRouter)
router.use("/vendor", vendorRouter)

module.exports = {
    routes: router
}