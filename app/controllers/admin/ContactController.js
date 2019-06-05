const express = require("express")
const _ = require("lodash")
const router = express.Router()

const { Contact } = require("../../models/Contact")

//localhost:3005/admin/contacts
router.get("/", (req,res) => {
    Contact.find().sort({ sentAt: -1 })
        .then(contacts => {
            res.send(contacts)
        })
        .catch(err => {
            res.send(err)
        })
})

//localhost:3005/admin/contacts/:id
router.delete("/:id", (req,res) => {
    const id = req.params.id
    Contact.findByIdAndDelete(id)
        .then(contact => {
            res.send({success: contact})
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = {
    adminContactRouter: router
}