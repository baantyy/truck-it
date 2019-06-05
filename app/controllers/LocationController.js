const express = require("express")
const _ = require("lodash")
const router = express.Router()
const axios = require('axios')

const { googleApi } = require("../../config/apikey")

//localhost:3005/location/place/:name
router.get("/place/:name", (req,res) => {
    const { name } = req.params
    axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${name}&key=${googleApi}`)
        .then(result => {
            res.send(result.data)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/location/distance/:pickup/:dropoff
router.get("/distance/:pickup/:dropoff", (req,res) => {
    const { pickup, dropoff } = req.params
    axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickup}&destinations=${dropoff}&key=${googleApi}`)
        .then(result => {
            res.send(result.data)
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    locationRouter: router
}