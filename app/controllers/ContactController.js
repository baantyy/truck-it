const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Contact } = require("../models/Contact")

//localhost:3005/users/contact
router.post("/", (req,res) => {
    const body = _.pick(req.body,["name","mobile","email","message"])
    const contact = new Contact(body)
    contact.save()
        .then(contact => {
            res.send({success: contact})
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    contactRouter: router
}