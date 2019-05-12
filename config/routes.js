const express = require("express")
const router = express.Router()

const { userRouter } = require('../app/controllers/UserController')

router.use("/users", userRouter)

module.exports = {
    routes: router
}